import Avatar from 'components/Avatar';
import { UserCard } from 'components/Card';
import Notifications from 'components/Notifications';
import { notificationsData } from 'demos/header';
import withBadge from 'hocs/withBadge';
import React from 'react';
import { MdClearAll, MdError, MdExitToApp, MdMessage, MdNotificationsActive, MdNotificationsNone, MdPersonPin } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { NavLink } from 'react-router-dom';
import {
Button, ListGroup, ListGroupItem,
  // NavbarToggler,
  Nav, Navbar, NavItem, NavLink as BSNavLink, Popover, PopoverBody
} from 'reactstrap';
import bn from 'utils/bemnames';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import { GetPropiedadesHorizantales } from '../../api/api';
import { SignOut } from '../../cognito/amplifyMethods';
import { Logout, SetPropiedadesHorizontales, SetPropiedadHorizontal, SetShowPropiedadesHorizontalesModal, SetShowSpinner, SetUserAttributes } from '../../reducers/actions/HorizontalProperties';


const bem = bn.create('header');

const MdNotificationsActiveWithBadge = withBadge({
  size: 'md',
  color: 'primary',
  style: {
    top: -10,
    right: -10,
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  children: <small>5</small>,
})(MdNotificationsActive);

class Header extends React.Component {
  state = {
    isOpenNotificationPopover: false,
    isNotificationConfirmed: false,
    isOpenUserCardPopover: false,
    redirect: false,
  };

  toggleNotificationPopover = () => {
    this.setState({
      isOpenNotificationPopover: !this.state.isOpenNotificationPopover,
    });

    if (!this.state.isNotificationConfirmed) {
      this.setState({ isNotificationConfirmed: true });
    }
  };

  toggleUserCardPopover = () => {
    this.setState({
      isOpenUserCardPopover: !this.state.isOpenUserCardPopover,
    });
  };

  handleSidebarControlButton = event => {
    event.preventDefault();
    event.stopPropagation();

    document.querySelector('.cr-sidebar').classList.toggle('cr-sidebar--open');
  };

  handleSingOut = () => {
    localStorage.removeItem("propiedadesHorizontales");
    localStorage.removeItem("propiedadHorizontal");
    SignOut().then(() => {
      this.setState({ redirect: true },()=>{
        localStorage.removeItem("fechaActual");
        this.props.logout();
      });
    })
  }

  handleChangePropiedadHorizontal = () => {
    const { userAttributes } = this.props;
    let userId = userAttributes["custom:custom:userid"];
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

  render() {
    const { isNotificationConfirmed, redirect } = this.state;
    const { propiedadesHorizontales, propiedadHorizontal } = this.props;
    if (redirect) return <Redirect to={{ pathname: '/login' }} />
    return (
      <Navbar light expand className={bem.b('bg-white')}>
        <Nav navbar className="mr-2">
          <Button outline onClick={this.handleSidebarControlButton}>
            <MdClearAll size={25} />
          </Button>
        </Nav>
        <Nav style={{cursor:'pointer'}} onClick={this.handleChangePropiedadHorizontal} navbar>
          {Object.entries(propiedadHorizontal).length !== 0 &&
            <h6><strong>{propiedadHorizontal.nombre}</strong> actualizar</h6>
          }
        </Nav>

        <Nav navbar className={bem.e('nav-right')}>
          <div style={{display:'none'}}><NavItem className="d-inline-flex">
            <BSNavLink id="Popover1" className="position-relative">
              {isNotificationConfirmed ? (
                <MdNotificationsNone
                  size={25}
                  className="text-secondary can-click"
                  onClick={this.toggleNotificationPopover}
                />
              ) : (
                  <MdNotificationsActiveWithBadge
                    size={25}
                    className="text-secondary can-click animated swing infinite"
                    onClick={this.toggleNotificationPopover}
                  />
                )}
            </BSNavLink>
            <Popover

              placement="bottom"
              isOpen={this.state.isOpenNotificationPopover}
              toggle={this.toggleNotificationPopover}
              target="Popover1"
            >

              <PopoverBody >
                <Notifications notificationsData={notificationsData} />
              </PopoverBody>
            </Popover>
          </NavItem></div>
          {Object.entries(propiedadesHorizontales).length !== 0 &&
            <NavItem>
              <BSNavLink id="Popover2">
                <Avatar
                  onClick={this.toggleUserCardPopover}
                  className="can-click"
                  src={propiedadesHorizontales.copropietario.urlImagenCopropietario}
                />
              </BSNavLink>

              <Popover
                placement="bottom-end"
                isOpen={this.state.isOpenUserCardPopover}
                toggle={this.toggleUserCardPopover}
                target="Popover2"
                className="p-0 border-0"
                style={{ minWidth: 250 }}
              >
                <PopoverBody className="p-0 border-light">
                  <UserCard
                    avatar={propiedadesHorizontales.copropietario.urlImagenCopropietario}
                    title={propiedadesHorizontales.copropietario.nombre}
                    subtitle={Object.entries(propiedadHorizontal).length !== 0 ? propiedadHorizontal.nombre : null}
                    className="border-light"
                  >
                    <ListGroup flush>
                    <BSNavLink
                  id={`navItem-${'perfil'}-${'1'}`}
                  className="text-uppercase"
                  tag={NavLink}
                  to={'/perfil'}
                  activeClassName="inactive"
                  exact={false}
                >
                      <ListGroupItem tag="button" action className="border-light">
                        <MdPersonPin /> Mi perfil
                    </ListGroupItem>
                    </BSNavLink>
                     
                      <ListGroupItem onClick={this.handleSingOut} tag="button" action className="border-light">
                        <MdExitToApp /> Cerrar sesión
                    </ListGroupItem>
                    </ListGroup>
                  </UserCard>
                </PopoverBody>
              </Popover>

            </NavItem>
          }
        </Nav>
        <NotificationSystem
          dismissible={false}
          ref={notificationSystem =>
            (this.notificationSystem = notificationSystem)
          }
          style={NOTIFICATION_SYSTEM_STYLE}
        />
      </Navbar>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    propiedadesHorizontales: state.HorizontalProperties.propiedadesHorizontales,
    propiedadHorizontal: state.HorizontalProperties.propiedadHorizontal,
    userAttributes: state.HorizontalProperties.userAttributes,
  }
}

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(Logout()),
  setPropiedadesHorizontales: (item) => dispatch(SetPropiedadesHorizontales(item)),
  setUserAttributes: (item) => dispatch(SetUserAttributes(item)),
  setShowSpinner: (item) => dispatch(SetShowSpinner(item)),
  setShowPropiedadesHorizontalesModal: (item) => dispatch(SetShowPropiedadesHorizontalesModal(item)),
  setPropiedadHorizontal: (item) => dispatch(SetPropiedadHorizontal(item)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header);
