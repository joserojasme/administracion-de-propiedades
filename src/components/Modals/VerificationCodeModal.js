import React, { Fragment } from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    FormGroup,
    Input,
    Label,
    Form
} from 'reactstrap';
import { HandleKeyPressTextoNumeros } from '../../utils/utilsFunctions';
import { ResendUserCodeSignUp, ConfirmSignUp } from '../../cognito/amplifyMethods';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import {
    MdImportantDevices,
    MdError,
} from 'react-icons/md';
import Spinner from '../../components/Spinner';


class ModalPage extends React.Component {
    state = {
        verificationCodeUser: '',
        spinnerVisible: false,
    }

    HandleKeyPressTextoNumeros = (event) => {
        if (!HandleKeyPressTextoNumeros(event)) {
            event.preventDefault();
        }
    }

    handleChange = (event) => {
        let value = event.target.value;
        this.setState({ [event.target.id]: value });
    }

    handleClickReenviarCodigo = () => {
        this.setState({ spinnerVisible: true }, () => {
            ResendUserCodeSignUp(this.props.user).then(() => {
                this.Notificacion('Código reenviado', <MdImportantDevices />, 'success')
            });
        })
    }

    handleClickTerminarRegistro = (event) => {
        event.preventDefault();
        this.setState({ spinnerVisible: true, }, () => {
            ConfirmSignUp(this.props.user, this.state.verificationCodeUser).then(result => {
                if (result == 'SUCCESS') {
                    this.Notificacion('La cuenta se activó. Favor inicie sesión', <MdImportantDevices />, 'success')
                } else {
                    switch (result.code) {
                        case 'CodeMismatchException':
                            this.Notificacion('Código ingresado es incorrecto', <MdError />, 'error')
                            break;
                        case 'NotAuthorizedException':
                            this.setState({ redirect: true })
                            break;
                        case 'LimitExceededException':
                            this.Notificacion('Por favor inténtelo más tarde', <MdError />, 'error', 1000);
                            break;
                        default:
                            this.Notificacion('Error desconocido', <MdError />, 'error', 1000);
                            break;
                    }
                }
            })
        })
    }

    Notificacion = (message, icon, level) => {
        this.setState({ spinnerVisible: false, verificationCodeUser: '' }, () => {
            setTimeout(() => {
                if (!this.notificationSystem) {
                    return;
                }

                this.notificationSystem.addNotification({
                    title: icon,
                    message: message,
                    level: level,
                });
            }, 100);
        })
    }

    render() {
        const { open, closeModal } = this.props;
        const { verificationCodeUser, spinnerVisible } = this.state;
        return (
            <Fragment>
                <Modal
                    isOpen={open}
                    toggle={closeModal}
                    className={this.props.className}
                    centered>
                    <ModalHeader toggle={closeModal}>La cuenta no está activa</ModalHeader>
                    <Form onSubmit={this.handleClickTerminarRegistro}>
                        <ModalBody>
                            Hemos enviado el código de verificación a su correo electrónico. Por favor ingrese el código para activar su nueva cuenta.
                        <hr />

                            <FormGroup>
                                <Label for={verificationCodeUser}>Código de verificación</Label>
                                <Input required id='verificationCodeUser'
                                    onKeyPress={this.HandleKeyPressTextoNumeros}
                                    onChange={this.handleChange}
                                    value={verificationCodeUser}
                                    placeholder="Ingrese el código"
                                    type='text'
                                    autoComplete="off" />
                            </FormGroup>
                            <small onClick={this.handleClickReenviarCodigo} style={{cursor:'pointer'}} className="text-muted">Reenviar código a mi E-mail</small>
                        </ModalBody>
                        <ModalFooter>
                            <FormGroup>
                                {spinnerVisible &&
                                    <Spinner />
                                }
                                <Button color="primary" >
                                    Activar cuenta
            </Button>{' '}</FormGroup>

                        </ModalFooter>
                    </Form>
                </Modal>
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

export default ModalPage;
