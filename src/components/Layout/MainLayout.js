import { Content, Footer, Header, Sidebar } from 'components/Layout';
import React from 'react';
import {
  MdImportantDevices,
  MdLoyalty,
  MdError,
  MdInfo
} from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import { GetPropiedadesHorizantales,GetReserva } from '../../api/api';
import { 
  SetPropiedadesHorizontales, 
  SetUserAttributes,
  SetShowSpinner, 
  SetShowPropiedadesHorizontalesModal,
  SetPropiedadHorizontal,SetReservas } from '../../reducers/actions/HorizontalProperties';
import { connect } from 'react-redux';
import { GetUserData } from '../../cognito/amplifyMethods';
import Spinner from '../Spinner';
import HorizontalPropertiesModal from '../../components/Modals/HorizontalPropertiesModal';
import { Redirect } from 'react-router-dom';

class MainLayout extends React.Component {
  constructor(props){
    super(props);
    this.state={
      redirect:false
    }
  }

  static isSidebarOpen() {
    return document
      .querySelector('.cr-sidebar')
      .classList.contains('cr-sidebar--open');
  }

  componentWillMount() {
    GetUserData().then(result => {
      if (result != 'not authenticated') {
        this.props.setUserAttributes({ ...result.attributes, 'grupo': result.signInUserSession.accessToken.payload["cognito:groups"] })
        let userId = result.attributes["custom:custom:userid"];
        if (userId.length > 0) {
          this.ValidarLocalStorage().then(result=>{
            if(!result){
              GetPropiedadesHorizantales(userId, this.props.setShowSpinner).then(result => {
                if (result.status === 200) {
                  this.props.setPropiedadesHorizontales(result.data);
                  localStorage.removeItem("propiedadesHorizontales");
                  localStorage.setItem("propiedadesHorizontales", JSON.stringify(result.data));
                  this.props.setShowPropiedadesHorizontalesModal(true);
                } else {
                  this.Notificacion(result.data, <MdError />, 'error', 1000);
                }
              });
            }else{
              this.props.setPropiedadHorizontal(JSON.parse(localStorage.getItem("propiedadHorizontal")));
              this.props.setPropiedadesHorizontales(JSON.parse(localStorage.getItem("propiedadesHorizontales")));
              let data = JSON.parse(localStorage.getItem("propiedadHorizontal"))
              this.consultarReservas(data.id);
            }
          })
        }
      }else{
        this.setState({ redirect: true })
      }
    });
  }

  consultarReservas = (idPropiedadHorizontal) =>{
    GetReserva(idPropiedadHorizontal, this.props.setShowSpinner).then(result => {
        switch (result.status) {
            case 200:
                this.props.setReservas(result.data);
                localStorage.removeItem("reservas");
                localStorage.setItem("reservas", JSON.stringify(result.data));
                break;
            case 404:
                this.Notificacion('No se encontraron eventos para el calendario', <MdInfo />, 'error', 1000);
                break;
            default:
                this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                break;
        }
    })
}

  componentWillReceiveProps({ breakpoint }) {
    if (breakpoint !== this.props.breakpoint) {
      this.checkBreakpoint(breakpoint);
    }
  }

  componentDidMount() {
    this.checkBreakpoint(this.props.breakpoint);

    this.Notificacion('Bienvenido a Mi Inc', <MdImportantDevices />, 'info', 2000);
  }

  ValidarLocalStorage = async () =>{
     if(localStorage.getItem("propiedadesHorizontales") == null){
       return false;
     }

     if(localStorage.getItem("propiedadHorizontal") == null){
      return false;
    }

    return true;
    // if (localStorage.getItem("propiedadesHorizontales") == null) {
    //   localStorage.setItem("propiedadesHorizontales", JSON.stringify([]));
    // } else {
    //   let propiedadesHorizontalesStorage = JSON.parse(localStorage.getItem("propiedadesHorizontales"))
    //   localStorage.removeItem("propiedadesHorizontales");
    //   localStorage.setItem("propiedadesHorizontales", JSON.stringify(propiedadesHorizontalesStorage));
    // }
  }

  Notificacion = (message, icon, level, time) => {
    setTimeout(() => {
      if (!this.notificationSystem) {
        return;
      }

      this.notificationSystem.addNotification({
        title: icon,
        message: message,
        level: level,
      });
    }, time);
  }

  handleContentClick = event => {
    // close sidebar if sidebar is open and screen size is less than `md`
    if (
      MainLayout.isSidebarOpen() &&
      (this.props.breakpoint === 'xs' ||
        this.props.breakpoint === 'sm' ||
        this.props.breakpoint === 'md')
    ) {
      this.openSidebar('close');
    }
  };

  checkBreakpoint(breakpoint) {
    switch (breakpoint) {
      case 'xs':
      case 'sm':
      case 'md':
        return this.openSidebar('close');

      case 'lg':
      case 'xl':
      default:
        return this.openSidebar('open');
    }
  }

  openSidebar(openOrClose) {
    if (openOrClose === 'open') {
      return document
        .querySelector('.cr-sidebar')
        .classList.add('cr-sidebar--open');
    }
    document.querySelector('.cr-sidebar').classList.remove('cr-sidebar--open');
  }

  render() {
    const { children,showSpinner,propiedadesHorizontalesModal,userAttributes } = this.props;
    const {redirect} = this.state;
    
    if (redirect) return <Redirect to={{ pathname: '/login' }} />
    return (
      <main className="cr-app bg-light">
        <Sidebar userAttributes={userAttributes} breakpoint={this.props.breakpoint} />
        <Content fluid onClick={this.handleContentClick}>
          <Header breakpoint={this.props.breakpoint} />
          {showSpinner &&
            <Spinner />
          }
          {children}
          <Footer />
        </Content>
        {propiedadesHorizontalesModal &&
          <HorizontalPropertiesModal />
        }
        
        <NotificationSystem
          dismissible={false}
          ref={notificationSystem =>
            (this.notificationSystem = notificationSystem)
          }
          style={NOTIFICATION_SYSTEM_STYLE}
        />
      </main>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userAttributes: state.HorizontalProperties.userAttributes,
    showSpinner: state.HorizontalProperties.showSpinner,
    propiedadesHorizontalesModal: state.HorizontalProperties.propiedadesHorizontalesModal,
  }
}

const mapDispatchToProps = (dispatch) => ({
  setPropiedadesHorizontales: (item) => dispatch(SetPropiedadesHorizontales(item)),
  setUserAttributes: (item) => dispatch(SetUserAttributes(item)),
  setShowSpinner: (item) => dispatch(SetShowSpinner(item)),
  setShowPropiedadesHorizontalesModal: (item) => dispatch(SetShowPropiedadesHorizontalesModal(item)),
  setPropiedadHorizontal: (item) => dispatch(SetPropiedadHorizontal(item)),
  setReservas: (item) => dispatch(SetReservas(item)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
