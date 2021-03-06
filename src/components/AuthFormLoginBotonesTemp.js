import logoMiInc from 'assets/img/logo/logo_miinc_completo.png';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { MdError, MdInfo } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { Redirect } from 'react-router';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import { ForgotPassword, ForgotPasswordSubmit, GetUserData, SignIn } from '../cognito/amplifyMethods';
import Spinner from '../components/Spinner';
import { HandleKeyPressTextoNumeros } from '../utils/utilsFunctions';
import TerminosCondicionesModal from './Modals/TerminosCondicionesModal';
import VerificationCodeModal from './Modals/VerificationCodeModal';

const styles = {
  terminos: {
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '10px'
  },
  darClic: {
    fontSize: '10px'
  }
}

class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible: false,
      username: '',
      password: '',
      verificationCodeUser: '',
      usernameVerificationCode: '',
      redirect: false,
      openVerificationCodeModal: false,
      passwordRecordar: '',
      usernameRecordar: '',
      mostrarCamposRecordar: false,
      openTerminosCondiciones: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    GetUserData().then(result => {
      if (result != 'not authenticated') {
        this.setState({ redirect: true })
      }
    });
  }

  handleKeyPressTextoNumeros = (event) => {
    if (!HandleKeyPressTextoNumeros(event)) {
      event.preventDefault();
    }
  }

  handleChange = (event) => {
    let value = event.target.value;
    if (event.target.id == 'username') {
      this.setState({ usernameVerificationCode: value });
    }
    this.setState({ [event.target.id]: value });
  }

  handleChangeRecordar = (event) => {
    let value = event.target.value;
    this.setState({ [event.target.id]: value });
  }

  get isLogin() {
    return this.props.authState === STATE_LOGIN;
  }

  get isCambiarPassword() {
    return this.props.authState === CAMBIAR_PASSWORD;
  }

  get isSignup() {
    return this.props.authState === STATE_SIGNUP;
  }

  get isForgot() {
    return this.props.authState === STATE_FORGOT;
  }

  changeAuthState = authState => event => {
    event.preventDefault();
    this.props.onChangeAuthState(authState);
  };

  changeAuthStatePassword = (value) => {
    this.props.onChangeAuthState(value);
  };

  Notificacion = (message, icon, level) => {
    this.setState({ spinnerVisible: false });
    setTimeout(() => {
      if (!this.notificationSystem) {
        return;
      }

      this.notificationSystem.addNotification({
        title: icon,
        message: message,
        level: level,
      });
    }, 0);
  }

  handleSubmit = (event) => {
    const { usernameRecordar, passwordRecordar, verificationCodeUser } = this.state;
    event.preventDefault();
    let accion= event.target.id;
    
    this.setState({ spinnerVisible: true }, () => {
      switch (accion) {
        case INICIAR_SESION:
          localStorage.removeItem("fechaActual");
          localStorage.removeItem("propiedadesHorizontales");
          localStorage.removeItem("propiedadHorizontal");
          SignIn(this.state).then(result => {
            this.validarRespuestaSignIn(result);
          })
          break;
        case ENVIAR_CODIGO:
          ForgotPassword(usernameRecordar).then(result => { this.validarRespuestaEnvioCodigo(result) })
          break;
        case CAMBIAR_PASSWORD:
          ForgotPasswordSubmit(usernameRecordar, verificationCodeUser,passwordRecordar).then(result => { this.validarRespuestaCambioPassword(result) })
          break;
      }
    })
  }

  validarRespuestaEnvioCodigo = (result) => {
    if (result.code == undefined) {
      this.setState({ mostrarCamposRecordar: true, }, () => {
        this.changeAuthStatePassword(CAMBIAR_PASSWORD);
        this.Notificacion('Ingrese la nueva contraseña', <MdInfo />, 'success')
      })
    } else {
      let mensaje = '';
      switch (result.code) {
        case 'UserNotFoundException':
          mensaje = 'Lo sentimos, el usuario no fue encontrado';
          break;
        case 'NetworkError':
          mensaje = 'Lo sentimos, parece que no tienes internet.'
          break;
        case 'InvalidParameterException':
          mensaje = `Lo sentimos, el usuario debió activarse antes`;
          break;
        default:
          mensaje = `Lo sentimos, ocurrió un error no identificado al registrarse: ${result.message}`;
          break;
      }
      this.Notificacion(mensaje, <MdError />, 'error')
    }
  }

  validarRespuestaSignIn = (result) => {
    if (result == 'SUCCESS') {
      GetUserData().then(result => {
        let fechaExpiracionToken = result.signInUserSession.idToken.payload.exp;
        localStorage.setItem("fechaActual", fechaExpiracionToken);
        this.setState({ spinnerVisible: true, redirect: true })
      })
      return;
    }
    this.setState({ spinnerVisible: false, }, () => {
      switch (result) {
        case 'UserNotConfirmedException':
          this.setState({ username: '', password: '', spinnerVisible: false, openVerificationCodeModal: true }, () => { })
          break;
        case 'PasswordResetRequiredException':
          //Que hacer en caso de que cognito resetee la contraseña dle usuario y deba cambiarse
          break;
        case 'NotAuthorizedException':
          this.setState({ password: '' }, () => { this.Notificacion('Usuario o contraseña incorrectos', <MdError />, 'error') })
          break;
        case 'UserNotFoundException':
          this.setState({ username: '', password: '' }, () => { this.Notificacion('El ususario no existe', <MdError />, 'error') })
          break;
        default:

          break;
      }
    })
  }

  validarRespuestaCambioPassword = (result) => {
    if (result.code == undefined) {
      this.setState({ mostrarCamposRecordar: false, }, () => {
        this.Notificacion('Cambio realizado. Favor inicie sesión', <MdInfo />, 'success')
        this.changeAuthStatePassword(STATE_LOGIN)
      })
    } else {
      let mensaje = '';
      
      switch (result.code) {
        case 'ExpiredCodeException':
          mensaje = 'El código ya expiró, por favor solicite un nuevo código';
          break;
        case 'CodeMismatchException':
          mensaje = 'El código es incorrecto';
          break;
        case 'UserNotFoundException':
          mensaje = 'Lo sentimos, el usuario no fue encontrado';
          break;
        case 'NetworkError':
          mensaje = 'Lo sentimos, parece que no tienes internet.'
          break;
        case 'InvalidParameterException':
          mensaje = 'Lo sentimos, la contraseña ingresada no es correcta. Debe tener una lóngitud mínina de 6 carácteres, contener letras minúsculas y al menos un número';
          break;
        case 'InvalidPasswordException':
          mensaje = 'Lo sentimos, la contraseña ingresada no es correcta. Debe tener una lóngitud mínina de 6 carácteres, contener letras minúsculas y al menos un número';
          break;
        default:
          mensaje = `Lo sentimos, ocurrió un error no identificado al registrarse: ${result.message}`;
          break;
      }
      this.Notificacion(mensaje, <MdError />, 'error')
    }
  }

  handleClick = (event) =>{
    event.preventDefault();
    let accion= event.target.value;
    let username = 'danielm';
    let password = 'danielm2019';
    if(accion === '2'){
      username = 'portero';
      password = 'portero2019';
    }

    if(accion === '3'){
      username = 'admon';
      password = 'admon2019';
    }

    const object = new Object({'username':username, 'password':password});

    this.setState({ spinnerVisible: true }, () => {
          localStorage.removeItem("fechaActual");
          localStorage.removeItem("propiedadesHorizontales");
          localStorage.removeItem("propiedadHorizontal");
          SignIn(object).then(result => {
            this.validarRespuestaSignIn(result);
          })
    })
  }

  render() {
    const {
      showLogo,
      usernameLabel,
      usernameInputProps,
      passwordLabel,
      passwordInputProps,
      verificationCodeLabel,
      verificationCode,
      children,
      passwordRecordarLabel,
      passwordRecordarInputProps
    } = this.props;

    const {
      spinnerVisible,
      username,
      password,
      verificationCodeUser,
      redirect,
      openVerificationCodeModal,
      passwordRecordar,
      usernameRecordar,
      mostrarCamposRecordar,
      openTerminosCondiciones
    } = this.state;

    if (redirect) return <Redirect to={{ pathname: '/app' }} />

    return (
      <Fragment>
      
        {showLogo && (
          <div className="text-center">
            <img
              src={logoMiInc}
              className="rounded"
              style={{ width: 300, height: 150, cursor: 'pointer' }}
              alt="MiInc"
            />
          </div>
        )}
        
        {spinnerVisible &&
          <Spinner />
        }
       
       <div className="text-center pt-1"><Label >Iniciar sesión como</Label></div>
        <Button
          size="lg"
          className="bg-gradient-theme-left border-0"
          block
          value='1'
          onClick={this.handleClick}
        >
          Copropietario
        </Button>

        <Button
          size="lg"
          className="bg-gradient-theme-left border-0"
          block
          value='2'
          onClick={this.handleClick}
        >
          Portero
        </Button>

        <Button
          size="lg"
          className="bg-gradient-theme-left border-0"
          block
          value='3'
          onClick={this.handleClick}
        >
          Administrador
        </Button>
        {children}
        <NotificationSystem
          dismissible={false}
          ref={notificationSystem =>
            (this.notificationSystem = notificationSystem)
          }
          style={NOTIFICATION_SYSTEM_STYLE}
        />

      </Fragment>
    );
  }
}

export const STATE_LOGIN = 'LOGIN';
export const STATE_SIGNUP = 'SIGNUP';
export const STATE_FORGOT = 'FORGOT';
export const INICIAR_SESION = 'Iniciar sesión';
export const ENVIAR_CODIGO = 'Enviar código';
export const CAMBIAR_PASSWORD = 'Cambiar contraseña';

AuthForm.propTypes = {
  authState: PropTypes.oneOf([STATE_LOGIN, STATE_SIGNUP, STATE_FORGOT]).isRequired,
  showLogo: PropTypes.bool,
  usernameLabel: PropTypes.string,
  usernameInputProps: PropTypes.object,
  passwordLabel: PropTypes.string,
  passwordInputProps: PropTypes.object,
  verificationCodeLabel: PropTypes.string,
  verificationCode: PropTypes.object,
  onLogoClick: PropTypes.func,
};

AuthForm.defaultProps = {
  authState: 'LOGIN',
  showLogo: true,
  usernameLabel: 'Usuario',
  usernameInputProps: {
    type: 'text',
    placeholder: 'Ingrese usuario',
  },
  passwordLabel: 'Contraseña',
  passwordInputProps: {
    type: 'password',
    placeholder: 'Su contraseña',
  },
  passwordRecordarLabel: 'Nueva contraseña',
  passwordRecordarInputProps: {
    type: 'password',
    placeholder: 'Su nueva contraseña',
  },
  verificationCodeLabel: 'Código de verificación',
  verificationCode: {
    type: 'password',
    placeholder: 'Ingrese el código',
  },
  onLogoClick: () => { },
};


export default AuthForm;
