import React, { Fragment } from 'react';
import { MdError, MdInfo } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { ActualizarCopropietarioPropiedades, ActualizarReinvitar, BorrarCopropietarioPropiedades, GetCopropietarioPropiedades, GuardarCopropietarioPropiedades } from '../../api/api';
import { SignUp } from '../../cognito/amplifyMethods';
import { SetShowSpinner } from '../../reducers/actions/HorizontalProperties';
import { NOTIFICATION_SYSTEM_STYLE } from '../../utils/constants';
import { handleKeyPressNumeros, handleKeyPressTexto, handleKeyPressTextoEmail } from '../../utils/utilsFunctions';
import AdministrarUsuariosTabla from '../AdministrarUsuariosTabla';

const regEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const initialState = {
    urlImagenPropietario: "https://www.logolynx.com/images/logolynx/03/039b004617d1ef43cf1769aae45d6ea2.png",
    usuarioCognito: '',
    nombre: '',
    tipoIdentificacion: 'CC',
    identificacion: '',
    telefono: '',
    celular: '',
    email: '',
    genero: 'M',
    particularidades: '',
    idPropiedad: '',
    rolUsuario: 'Copropietario',
    idPropiedadHorizontal: '',
    urlImagen: "https://www.logolynx.com/images/logolynx/03/039b004617d1ef43cf1769aae45d6ea2.png",
    botonActualizarDisable: true,
    listaCopropietariosPropiedades: [],
    isUpdate: false,
    usuarioActualizar: {}
}
class ActualizarPerfilesModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...initialState };
    }

    componentWillMount() {
        this.DatosIniciales();
    }

    DatosIniciales = () => {
        const { propiedad, propiedadHorizontal } = this.props;

        this.setState({
            ...propiedad, botonActualizarDisable: true,
            idPropiedad: propiedad.id, idPropiedadHorizontal: propiedadHorizontal.id
        })

        GetCopropietarioPropiedades(propiedad.id, this.props.setShowSpinner).then(result => {
            if (result.status == 200) {
                this.setState({ listaCopropietariosPropiedades: result.data })
            } else {
                this.Notificacion('No se pudo obtener los usuarios de la propiedad', <MdError />, 'error', 10);
            }
        })
    }

    handleChange = (event) => {
        let value = event.target.value;
        this.setState({ [event.target.id]: value, botonActualizarDisable: false })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (!regEmail.test(this.state.email)) {
            this.Notificacion('El email tiene un formato incorrecto', <MdError />, 'error', 10);
            return;
        }

        const { isUpdate } = this.state;
        if (isUpdate) {
            this.ActualizarUsuario();
        } else {
            this.GuardarUsuario();
        }
    }

    GuardarUsuario = () => {
        const { urlImagenPropietario, nombre, tipoIdentificacion, identificacion, telefono, celular, email, genero, particularidades, idPropiedad,
            rolUsuario, idPropiedadHorizontal, urlImagen, isUpdate } = this.state;

        this.setState({ usuarioCognito: identificacion }, () => {
            let objectoCopropietarioPropiedades = new Object({
                tblCopropietario: {
                    UsuarioCognito: this.state.usuarioCognito,
                    UrlImagenCopropietario: urlImagenPropietario,
                    Nombre: nombre,
                    TipoIdentificacion: tipoIdentificacion,
                    Identificacion: identificacion,
                    Telefono: telefono,
                    Celular: celular,
                    Email: email,
                    Genero: genero,
                    Particularidades: particularidades
                },
                tblCopropietarioPropiedades: {
                    IdPropiedad: idPropiedad,
                    RolUsuario: rolUsuario
                },
                tblCopropietarioPropiedadHorizontal: {
                    IdPropiedadHorizontal: idPropiedadHorizontal
                },
                tblInquilinos: {
                    UrlImagen: urlImagen,
                    Nombre: nombre,
                    Documento: identificacion,
                    Telefono: telefono,
                    Celular: celular,
                    IdPropiedad: idPropiedad
                }
            })

            GuardarCopropietarioPropiedades(JSON.stringify(objectoCopropietarioPropiedades), this.props.setShowSpinner).then(result => {
                if (result.status == 200) {
                    this.Notificacion('El usuario se ha creado', <MdInfo />, 'success', 10);
                    this.setState({ ...initialState }, () => {
                        this.DatosIniciales();
                    })
                } else {
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                }
            })
        })
    }

    ActualizarUsuario = () =>{
        const { nombre, tipoIdentificacion, identificacion, telefono, celular, email, genero, particularidades, idPropiedad,
             urlImagen, usuarioActualizar } = this.state;

            let objectoCopropietarioPropiedades = new Object({
                copropietario: {
                    UsuarioCognito: usuarioActualizar.copropietarios.usuarioCognito,
                    UrlImagenCopropietario: usuarioActualizar.copropietarios.urlImagenPropietario,
                    Nombre: nombre,
                    TipoIdentificacion: tipoIdentificacion,
                    Identificacion: usuarioActualizar.copropietarios.identificacion,
                    Telefono: telefono,
                    Celular: celular,
                    Email: usuarioActualizar.copropietarios.email,
                    Genero: genero,
                    Particularidades: particularidades,
                    id: usuarioActualizar.copropietarios.id,
                    fechaCumpleaños: usuarioActualizar.copropietarios.fechaCumpleaños,
                    fechaRegistro: usuarioActualizar.copropietarios.fechaRegistro
                },
                inquilino: {
                    UrlImagen: urlImagen,
                    Nombre: nombre,
                    Documento: identificacion,
                    Telefono: telefono,
                    Celular: celular,
                    IdPropiedad: idPropiedad
                }
            })

            ActualizarCopropietarioPropiedades(JSON.stringify(objectoCopropietarioPropiedades), this.props.setShowSpinner).then(result => {
                if (result.status == 200) {
                    this.Notificacion('El usuario se ha actualizado', <MdInfo />, 'success', 10);
                    this.setState({ ...initialState }, () => {
                        this.DatosIniciales();
                    })
                } else {
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                }
            })
    }

    handleChangeRol = (event) => {
        let value = event.target.value;
        this.setState({ rolUsuario: value })
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

    handleKeyPressTextoEmail = (event) => {
        if (!handleKeyPressTextoEmail(event)) {
            event.preventDefault();
        }
    }

    handleKeyPressNumeros = (event) => {
        if (!handleKeyPressNumeros(event)) {
            event.preventDefault();
        }
    }

    handleKeyPressTexto = (event) => {
        if (!handleKeyPressTexto(event)) {
            event.preventDefault();
        }
    }

    handleClickBorrar = (event) => {
        const { idPropiedad, idPropiedadHorizontal } = this.state;
        const objetoBorrar = new Object({
            usuarioCognito: event.target.value,
            idPropiedad: idPropiedad,
            idPropiedadHorizontal: idPropiedadHorizontal
        })

        BorrarCopropietarioPropiedades(objetoBorrar, this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    this.Notificacion('Usuario eliminado de la propiedad', <MdInfo />, 'success', 10);
                    this.DatosIniciales();
                    break;
                case 404:
                    this.Notificacion('No se encontró el usuario', <MdInfo />, 'error', 10);
                    break;
                default:
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 10);
                    break;
            }
        })
    }

    handleClickInvitar = (event) => {
        let data = JSON.parse(event.target.value);
        if (data.copropietariosPropiedades.invitadoApp === 0) {
            this.CrearUsuarioCognito(data.copropietarios.usuarioCognito, data.copropietarios.email, data.copropietariosPropiedades.id);
        }

        if (data.copropietariosPropiedades.invitadoApp === 1) {
            this.Reinvitar(data.copropietariosPropiedades.id);
        }

    }

    Reinvitar = (idCopropietarioPropiedad) => {
        ActualizarReinvitar(idCopropietarioPropiedad, this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    this.Notificacion('Usuario invitado', <MdInfo />, 'success', 10);
                    this.DatosIniciales();
                    break;
                case 404:
                    this.Notificacion('No se encontró el usuario', <MdInfo />, 'error', 10);
                    break;
                default:
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 10);
                    break;
            }
        })
    }

    CrearUsuarioCognito = (usuarioCognito, email, idCopropietarioPropiedad) => {
        let data = new Object({
            username: usuarioCognito,
            password: usuarioCognito,
            email: email,
            userid: usuarioCognito
        });

        SignUp(data).then(result => {
            switch (result.code) {
                case 'SUCCESS':
                    this.Reinvitar(idCopropietarioPropiedad);
                    this.Notificacion('Usuario creado e invitado', <MdInfo />, 'success', 1000);
                    break;
                case 'InvalidPasswordException':
                    this.Notificacion('La contraseña es incorrecta', <MdError />, 'error', 1000);
                    break;
                case 'UsernameExistsException':
                    this.Reinvitar(idCopropietarioPropiedad);
                    this.Notificacion('El usuario ya existe, y fue notificado', <MdError />, 'success', 1000);
                    break;
                default:
                    this.Notificacion('Error desconocido', <MdError />, 'error', 1000);
                    break;
            }
        })
    }

    handleClickEditar = (event) => {
        let data = JSON.parse(event.target.value);
        this.setState({
            isUpdate: true, nombre: data.copropietarios.nombre, identificacion: data.copropietarios.identificacion,
            telefono: data.copropietarios.telefono, celular: data.copropietarios.celular, email: data.copropietarios.email, usuarioActualizar: data
        })
    }

    render() {
        const { open, closeModal } = this.props;
        const { nombre,
            identificacion,
            telefono,
            celular,
            email,
            botonActualizarDisable, listaCopropietariosPropiedades, isUpdate } = this.state;
        return (
            <Fragment>
                <NotificationSystem
                    dismissible={false}
                    ref={notificationSystem =>
                        (this.notificationSystem = notificationSystem)
                    }
                    style={NOTIFICATION_SYSTEM_STYLE}
                />
                <Modal
                    size="xl"
                    isOpen={open}
                    toggle={closeModal}
                    className={this.props.className}
                    centered>
                    <ModalHeader toggle={closeModal}>Perfiles de la propiedad</ModalHeader>
                    <Form onSubmit={this.handleSubmit}>
                        <ModalBody className="d-flex justify-content-center align-items-center flex-column" >
                            <Col style={{ display: 'block' }} className="mb-3" md={12} sm={12} xs={12} lg={12} >
                                <Card className="d-flex justify-content-center align-items-center flex-column">
                                    <CardBody className="w-100">
                                        <Row>
                                            <Col xl={12} lg={12} md={12} sm={12}>
                                                <Card>
                                                    <CardHeader >CREE, ACTUALICE O ELIMINE USUARIOS PARA LA PROPIEDAD</CardHeader>
                                                    <CardBody>

                                                        <FormGroup row>
                                                            <Label sm={2} for="nombre" >Nombre *</Label>
                                                            <Col sm={4} >
                                                                <Input
                                                                    required
                                                                    id='nombre'
                                                                    type="text"
                                                                    name='nombre'
                                                                    placeholder="Ingrese el nombre"
                                                                    value={nombre}
                                                                    onChange={this.handleChange}
                                                                    autocomplete="off"
                                                                />
                                                            </Col>
                                                            <Label sm={2} for="rolUsuario" >Rol usuario</Label>
                                                            <Col sm={4} >
                                                                <Input type="select" name="select" onChange={this.handleChangeRol}>
                                                                    {
                                                                        rolUsuarioList.length > 0 &&
                                                                        rolUsuarioList.map(tipo => {
                                                                            return (
                                                                                <Fragment>
                                                                                    <option>{tipo}</option>
                                                                                </Fragment>
                                                                            )
                                                                        })
                                                                    }
                                                                </Input>
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup row>
                                                            <Label sm={2} for="identificacion" ># identificación *</Label>
                                                            <Col sm={4} >
                                                                <Input
                                                                    required
                                                                    id='identificacion'
                                                                    type="text"
                                                                    name='identificacion'
                                                                    placeholder="Ingrese el # de identificación"
                                                                    value={identificacion}
                                                                    onChange={this.handleChange}
                                                                    autocomplete="off"
                                                                    disabled={isUpdate}
                                                                    minLength={6}
                                                                />
                                                            </Col>
                                                            <Label sm={2} for="telefono" >Teléfono</Label>
                                                            <Col sm={4} >
                                                                <Input
                                                                    id='telefono'
                                                                    type="text"
                                                                    name='telefono'
                                                                    placeholder="Ingrese el # de teléfono"
                                                                    value={telefono}
                                                                    onChange={this.handleChange}
                                                                    autocomplete="off"
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup row>
                                                            <Label sm={2} for="celular" ># Celular *</Label>
                                                            <Col sm={4} >
                                                                <Input
                                                                    required
                                                                    id='celular'
                                                                    type="text"
                                                                    name='celular'
                                                                    placeholder="Ingrese el # de celular"
                                                                    value={celular}
                                                                    onChange={this.handleChange}
                                                                    autocomplete="off"
                                                                    onKeyPress={this.handleKeyPressNumeros}
                                                                />
                                                            </Col>
                                                            <Label sm={2} for="email" >E-mail</Label>
                                                            <Col sm={4} >
                                                                <Input
                                                                    required
                                                                    id='email'
                                                                    type="text"
                                                                    name='email'
                                                                    placeholder="Ingrese el email"
                                                                    value={email}
                                                                    onChange={this.handleChange}
                                                                    autocomplete="off"
                                                                    onKeyPress={this.handleKeyPressTextoEmail}
                                                                    disabled={isUpdate}
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <CardBody>
                                            <Row>
                                                <Col lg={6}>
                                                    <Button disabled={botonActualizarDisable} color="info" outline>
                                                        {isUpdate ? 'Actualizar' : 'Guardar'}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                        {listaCopropietariosPropiedades.length > 0 &&
                                            <Row style={styles.tabla}>
                                                {listaCopropietariosPropiedades.length > 0 &&
                                                    <AdministrarUsuariosTabla
                                                        rows={listaCopropietariosPropiedades}
                                                        handleClickBorrar={this.handleClickBorrar}
                                                        handleClickInvitar={this.handleClickInvitar}
                                                        handleClickEditar={this.handleClickEditar} />
                                                }
                                            </Row>
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        </ModalBody>
                    </Form>
                </Modal>
            </Fragment>
        );
    }
}

const styles = {
    tabla: {
        height: '500px',
        maxWidth: 'inherit',
        overflowY: 'auto'
    }
}

let rolUsuarioList = [
    'Copropietario',
    'Administrador delegado',
    'Inquilino',
    'Inmobiliario'
]

function mapStateToProps(state, props) {
    return {
        propiedadHorizontal: state.HorizontalProperties.propiedadHorizontal,
        propiedadesHorizontales: state.HorizontalProperties.propiedadesHorizontales,
        userAttributes: state.HorizontalProperties.userAttributes,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setShowSpinner: (item) => dispatch(SetShowSpinner(item)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ActualizarPerfilesModal);