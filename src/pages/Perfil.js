import Page from 'components/Page';
import { IconWidget } from 'components/Widget';
import React, { Fragment } from 'react';
import { MdError, MdInfo, MdPerson, MdPets, MdSubway } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { ActualizarPerfilCopropietario } from '../api/api';
import Avatar from '../components/Avatar';
import AdministrarInquilinosModal from '../components/Modals/AdministrarInquilinosModal';
import CrearCopropietariosModal from '../components/Modals/CrearCopropietariosModal';
import MascotasModal from '../components/Modals/MascotasModal';
import VehiculosModal from '../components/Modals/VehiculosModal';
import { SetPropiedadesHorizontales, SetPropiedadHorizontal, SetShowSpinner } from '../reducers/actions/HorizontalProperties';
import { NOTIFICATION_SYSTEM_STYLE } from '../utils/constants';

const style = {
    cardBody: {
        maxHeight: '350px',
        height: '350px',
        overflowY: 'auto'
    },
    etiqueta: {
        textDecoration: 'none'
    },
    widget: {
        cursor: 'pointer'
    }
}

class Perfil extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            nombre: '',
            identificacion: '',
            email: '',
            fechaCumpleaños: '',
            genero: '',
            particularidades: '',
            celular: '',
            botonActualizarDisable: true,
            showInquilinosModal: false,
            showMascotasModal: false,
            showVehiculosModal: false,
            mostrarBotones:true,
            showCopropietariosModal:false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClickActualizarPerfil = this.handleClickActualizarPerfil.bind(this);
    }

    componentWillMount() {
        const { propiedadHorizontal, userAttributes, propiedadesHorizontales } = this.props;
        if(userAttributes.grupo !== undefined){
            if (userAttributes.grupo[0] === "porteria") {
                this.setState({ redirect: true });
            }
        }else{
            this.setState({mostrarBotones:false})
        }

        if (Object.entries(propiedadHorizontal).length < 1) {
            this.setState({ redirect: true });
        }
        if (Object.entries(propiedadesHorizontales).length < 1) {
            this.setState({ redirect: true });
        }

        this.setState({
            nombre: propiedadesHorizontales.copropietario.nombre, identificacion: propiedadesHorizontales.copropietario.identificacion,
            email: propiedadesHorizontales.copropietario.email, fechaCumpleaños: propiedadesHorizontales.copropietario.fechaCumpleaños.substring(0, 10),
            genero: propiedadesHorizontales.copropietario.genero, particularidades: propiedadesHorizontales.copropietario.particularidades,
            celular: propiedadesHorizontales.copropietario.celular
        })
    }

    handleChange = (event) => {
        let value = event.target.value;
        value = value.toUpperCase();
        this.setState({ [event.target.id]: value }, () => {
            const { nombre, identificacion, email, fechaCumpleaños, genero, particularidades, celular } = this.state;
            if (nombre != '' && celular != '' && identificacion != '' && email != '' && fechaCumpleaños != '' && genero != '' && particularidades != '') {
                this.setState({ botonActualizarDisable: false })
            } else {
                this.setState({ botonActualizarDisable: true })
            }
        })
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

    handleClickActualizarPerfil = async () => {
        const { propiedadesHorizontales } = await this.props;
        const { nombre, identificacion, email, fechaCumpleaños, genero, particularidades, celular } = this.state;

        let body = await {
            celular: celular, email: email, fechaCumpleaños: fechaCumpleaños,
            fechaRegistro: propiedadesHorizontales.copropietario.fechaRegistro, genero: genero
            , id: propiedadesHorizontales.copropietario.id,
            identificacion: identificacion, nombre: nombre, particularidades: particularidades,
            telefono: propiedadesHorizontales.copropietario.telefono,
            tipoIdentificacion: propiedadesHorizontales.copropietario.tipoIdentificacion,
            urlImagenCopropietario: propiedadesHorizontales.copropietario.urlImagenCopropietario,
            usuarioCognito: propiedadesHorizontales.copropietario.usuarioCognito
        }

        ActualizarPerfilCopropietario(body, this.props.setShowSpinner).then(result => {
            if (result.status == 200) {
                this.Notificacion('El perfil se actualizó', <MdInfo />, 'success', 1000);
            } else {
                this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
            }
        })
    }

    handleCloseMascotasModal = () => {
        this.setState({ showMascotasModal: false });
    }

    handleClickOpenMascotaModal = () => {
        this.setState({ showMascotasModal: true });
    }

    handleCloseVehiculosModal = () => {
        this.setState({ showVehiculosModal: false });
    }

    handleClickOpenVehiculosModal = () => {
        this.setState({ showVehiculosModal: true });
    }

    handleCloseAdministrarInquilinosModal = () => {
        this.setState({ showInquilinosModal: false });
    }

    handleCloseCrearInquilinosModal = () => {
        this.setState({ showCopropietariosModal: false });
    }

    handleOpenAdministrarInquilinosModal = () => {
        this.setState({ showInquilinosModal: true });
    }

    handleOpenAdministrarUsuariosCopropietariosModal = () => {
        this.setState({ showCopropietariosModal: true });
    }

    render() {
        const { propiedadHorizontal, propiedadesHorizontales, userAttributes } = this.props;
        const { nombre,
            identificacion,
            email,
            fechaCumpleaños,
            genero,
            particularidades,
            botonActualizarDisable, celular, showMascotasModal, showInquilinosModal, showVehiculosModal,mostrarBotones,showCopropietariosModal } = this.state;
        const { redirect } = this.state;
        if (redirect) return <Redirect to={{ pathname: '/app' }} />
        return (
            <Page
                className="Home"
            >
                <NotificationSystem
                    dismissible={false}
                    ref={notificationSystem =>
                        (this.notificationSystem = notificationSystem)
                    }
                    style={NOTIFICATION_SYSTEM_STYLE}
                />
                <Row>
                    <Col md={12} sm={12} xs={12} lg={12} >
                        <Card className="d-flex justify-content-center align-items-center flex-column">
                            <Avatar
                                size={150}
                                className="mt-1"
                                src={propiedadesHorizontales.copropietario.urlImagenCopropietario}
                            />
                            <CardBody className="w-100">
                                <Row>
                                    <Col xl={12} lg={12} md={12} sm={12}>
                                        <Card>
                                            <CardHeader >PERFIL</CardHeader>
                                            <CardBody>
                                                <Form>
                                                    <FormGroup row>
                                                        <Label sm={2} for="nombre" >
                                                            Nombre
                  </Label>
                                                        <Col sm={10} >
                                                            <Input
                                                                autoFocus
                                                                id='nombre'
                                                                type="text"
                                                                name='nombre'
                                                                placeholder="Ingrese nombre"
                                                                value={nombre}
                                                                onChange={this.handleChange}
                                                                autocomplete="off"
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Label sm={2} for="identificacion" >
                                                            Cédula
                  </Label>
                                                        <Col sm={10} >
                                                            <Input
                                                                id='identificacion'
                                                                type="text"
                                                                name='identificacion'
                                                                placeholder="Ingrese cédula"
                                                                value={identificacion}
                                                                onChange={this.handleChange}
                                                                autocomplete="off"
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Label sm={2} for="celular" >
                                                            Celular
                  </Label>
                                                        <Col sm={10} >
                                                            <Input
                                                                id='celular'
                                                                type="text"
                                                                name='celular'
                                                                placeholder="Ingrese celular"
                                                                value={celular}
                                                                onChange={this.handleChange}
                                                                autocomplete="off"
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Label sm={2} for="email" >
                                                            Email
                  </Label>
                                                        <Col sm={10} >
                                                            <Input
                                                                type="email"
                                                                name="email"
                                                                id="email"
                                                                value={email}
                                                                placeholder="Ingrese el e-mail"
                                                                onChange={this.handleChange}
                                                                autocomplete="off"
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Label sm={2} for="fechaCumpleaños">Fecha nacimiento</Label>
                                                        <Col sm={10} >
                                                            <Input
                                                                type="date"
                                                                name="fechaCumpleaños"
                                                                id="fechaCumpleaños"
                                                                value={fechaCumpleaños}
                                                                placeholder="Ingrese su fecha de nacimiento"
                                                                onChange={this.handleChange}
                                                                autocomplete="off"
                                                            />
                                                        </Col>
                                                    </FormGroup>

                                                    <FormGroup row>
                                                        <Label sm={2}>
                                                            Género
                  </Label>
                                                        <Col sm={5}>
                                                            <FormGroup check>
                                                                <Label check>
                                                                    <Input
                                                                        checked={genero == 'M' ? true : false}
                                                                        type="radio" id="genero" value="M" onChange={this.handleChange} /> Másculino
                      </Label>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col sm={5}>
                                                            <FormGroup check>
                                                                <Label check>
                                                                    <Input type="radio" onChange={this.handleChange}
                                                                        checked={genero == 'F' ? true : false}
                                                                        id="genero" value="F" /> Femenino
                      </Label>
                                                            </FormGroup>
                                                        </Col>

                                                    </FormGroup>


                                                    <FormGroup row>
                                                        <Label sm={2} for="particularidades">Particularidades</Label>
                                                        <Col sm={10} >
                                                            <Input
                                                                type="textarea"
                                                                name="particularidades"
                                                                id="particularidades"
                                                                value={particularidades}
                                                                placeholder="Ingrese su particularidad"
                                                                onChange={this.handleChange}
                                                                autocomplete="off"
                                                            />
                                                        </Col>
                                                    </FormGroup>

                                                </Form>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                                <CardBody>
                                    <Button disabled={botonActualizarDisable} color="info" onClick={this.handleClickActualizarPerfil} outline>
                                        Actualizar perfil
                                                        </Button>
                                </CardBody>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <div style={mostrarBotones ? {display:'none'} : {display:'block'}}>
                <Row>
                    <Fragment>
                        <Col lg={3} md={3} sm={12} xs={12}>
                            <a style={style.etiqueta} ><IconWidget style={style.widget}
                                bgColor="primary"
                                inverse={true}
                                icon={MdPerson}
                                title="Usuarios"
                                subtitle='Copropietarios'
                                onClick={this.handleOpenAdministrarUsuariosCopropietariosModal}
                            /></a>
                        </Col>

                        <Col lg={3} md={3} sm={12} xs={12}>
                            <a style={style.etiqueta} ><IconWidget style={style.widget}
                                bgColor="primary"
                                inverse={true}
                                icon={MdPerson}
                                title="Administrar"
                                subtitle='Inquilinos'
                                onClick={this.handleOpenAdministrarInquilinosModal}
                            /></a>
                        </Col>

                        <Col lg={3} md={3} sm={12} xs={12}>
                            <a style={style.etiqueta} ><IconWidget style={style.widget}
                                bgColor="primary"
                                inverse={true}
                                icon={MdSubway}
                                title="Administrar"
                                subtitle='Vehículos'
                                onClick={this.handleClickOpenVehiculosModal}
                            /></a>
                        </Col>

                        <Col lg={3} md={3} sm={12} xs={12}>
                            <a style={style.etiqueta} ><IconWidget style={style.widget}
                                bgColor="primary"
                                inverse={true}
                                icon={MdPets}
                                title="Administrar"
                                subtitle='Mascotas'
                                onClick={this.handleClickOpenMascotaModal}
                            /></a>
                        </Col>
                    </Fragment>
                </Row>
                </div>
                {showMascotasModal &&
                    <MascotasModal
                        open={showMascotasModal}
                        closeModal={() => this.handleCloseMascotasModal()}
                        propiedades={propiedadHorizontal.tblPropiedades} />
                }

                {showVehiculosModal &&
                    <VehiculosModal
                        open={showVehiculosModal}
                        closeModal={() => this.handleCloseVehiculosModal()}
                        propiedades={propiedadHorizontal.tblPropiedades} />
                }

                {showInquilinosModal &&
                    <AdministrarInquilinosModal
                        open={showInquilinosModal}
                        closeModal={() => this.handleCloseAdministrarInquilinosModal()}
                        propiedades={propiedadHorizontal.tblPropiedades} />
                }

                {showCopropietariosModal &&
                    <CrearCopropietariosModal
                        open={showCopropietariosModal}
                        closeModal={() => this.handleCloseCrearInquilinosModal()}
                        propiedades={propiedadHorizontal.tblPropiedades} />
                }
                


            </Page>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        propiedadHorizontal: state.HorizontalProperties.propiedadHorizontal,
        propiedadesHorizontales: state.HorizontalProperties.propiedadesHorizontales,
        userAttributes: state.HorizontalProperties.userAttributes,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setShowSpinner: (item) => dispatch(SetShowSpinner(item)),
    setPropiedadesHorizontales: (item) => dispatch(SetPropiedadesHorizontales(item)),
    setPropiedadHorizontal: (item) => dispatch(SetPropiedadHorizontal(item)),
})


export default connect(mapStateToProps, mapDispatchToProps)(Perfil);
