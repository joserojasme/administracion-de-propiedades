import React, { Fragment } from 'react';
import {
    Form, Modal, ModalBody, ModalHeader, FormGroup,
    Label, Card, CardImg, Col, Input, CardHeader, CardBody, Row, Button
} from 'reactstrap';
import { MdError, MdInfo, MdPersonPin } from 'react-icons/md';
import Avatar from '../../components/Avatar';
import { connect } from 'react-redux';
import {
    SetShowSpinner
} from '../../reducers/actions/HorizontalProperties';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from '../../utils/constants';
import AdministrarInquilinos from '../AdministrarInquilinos';
import { ActualizarInquilino, CrearInquilino, GetInquilinos } from '../../api/api';
import { SignUp } from '../../cognito/amplifyMethods';

const style = {
    cardBody: {
        maxHeight: '350px',
        height: '350px',
        overflowY: 'auto'
    }
}

class AdministrarInquilinosModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inquilinos: [],
            nombre: '',
            documento: '',
            telefono: '',
            celular: '',
            email: '',
            botonActualizarDisable: true,
            inquilinosSeleccionada: '',
            propiedad: '',
            visibleModificar: false,
            botonCrearNuevo: false,
        }
        this.handleChangeFiltroPropiedad = this.handleChangeFiltroPropiedad.bind(this);
    }

    handleChange = (event) => {
        let value = event.target.value;
        value = value.toUpperCase();
        this.setState({ [event.target.id]: value }, () => {
            const { nombre, documento, telefono, celular, } = this.state;
            if (nombre != '' && documento != '' && telefono != '' && celular != '') {
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

    handleChangeFiltroPropiedad = async (event) => {
        const { propiedades } = this.props;
        let value = event.target.value;
        if (value == 'Seleccione...') {
            this.setState({
                inquilinos: [], nombre: '', documento: '', celular: '', telefono: '', email: ''
                , visibleModificar: false, botonCrearNuevo: false, inquilinosSeleccionada: '', propiedad: ''
            })
            return;
        }
        value = value.split("#", 2);
        this.setState({ propiedad: value[1], visibleModificar: false, botonCrearNuevo: false });
        let propiedad = await propiedades.filter(item => {
            return item.nomenclatura == value[1];
        })
        GetInquilinos(propiedad[0].id, this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    this.setState({ inquilinos: result.data, nombre: '', documento: '', celular: '', telefono: '', email: '' })
                    break;
                case 404:
                    this.setState({ inquilinos: result.data, nombre: '', documento: '', celular: '', telefono: '', email: '' })
                    this.Notificacion('No se encontraron inquilinos', <MdInfo />, 'error', 1000);
                    break;
                default:
                    this.setState({ nombre: '', documento: '', celular: '', telefono: '', email: '' })
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                    break;
            }
        })

    }

    handleClickBorrarinquilino = async (event) => {
        let value = event.target.value;
        const { inquilinos } = this.state;
        let inquilino = inquilinos.filter(item => {
            return item.id == value;
        })

        let body = await {
            id: inquilino[0].id,
            nombre: inquilino[0].nombre,
            documento: inquilino[0].documento,
            telefono: inquilino[0].telefono,
            celular: inquilino[0].celular,
            idPropiedad: inquilino[0].idPropiedad,
            visible: '0',
            fechaRegistro: inquilino[0].fechaRegistro,
        }

        ActualizarInquilino(body, this.props.setShowSpinner).then(result => {
            if (result.status == 200) {
                this.Notificacion('La info. inquilino se actualizó', <MdInfo />, 'success', 1000);
                GetInquilinos(inquilino[0].idPropiedad, this.props.setShowSpinner).then(result => {
                    switch (result.status) {
                        case 200:
                            this.setState({
                                inquilinos: result.data, nombre: '', documento: '', celular: '', telefono: '', email: ''
                                , visibleModificar: false, botonCrearNuevo: false
                            })
                            break;
                        case 404:
                            this.setState({ inquilinos: result.data })
                            this.Notificacion('No se encontraron inquilinos', <MdInfo />, 'error', 1000);
                            break;
                        default:
                            this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                            break;
                    }
                })
            } else {
                this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
            }
        })

    }

    handleClickModificarinquilino = (event) => {
        let value = event.target.value;
        const { inquilinos } = this.state;
        let inquilino = inquilinos.filter(item => {
            return item.id == value;
        })
        this.setState({
            nombre: inquilino[0].nombre,
            documento: inquilino[0].documento,
            celular: inquilino[0].celular,
            telefono: inquilino[0].telefono,
            botonActualizarDisable: true,
            inquilinosSeleccionada: value,
            visibleModificar: true,
            botonCrearNuevo: false
        })
    }

    handleClickActualizarInquilino = async (event) => {
        let value = event.target.value;
        const { inquilinos } = this.state;
        let inquilino = inquilinos.filter(item => {
            return item.id == value;
        })

        const { nombre, documento, telefono, celular, } = this.state;

        let body = await {
            id: inquilino[0].id,
            nombre: nombre,
            documento: documento,
            telefono: telefono,
            celular: celular,
            idPropiedad: inquilino[0].idPropiedad,
            visible: inquilino[0].visible,
            fechaRegistro: inquilino[0].fechaRegistro,
        }

        ActualizarInquilino(body, this.props.setShowSpinner).then(result => {
            if (result.status == 200) {
                this.Notificacion('La info. inquilino se actualizó', <MdInfo />, 'success', 1000);
                GetInquilinos(inquilino[0].idPropiedad, this.props.setShowSpinner).then(result => {
                    switch (result.status) {
                        case 200:
                            this.setState({
                                inquilinos: result.data, nombre: '', documento: '', celular: '', telefono: '',
                                visibleModificar: false, botonCrearNuevo: false
                            })
                            break;
                        case 404:
                            this.setState({ inquilinos: result.data })
                            this.Notificacion('No se encontraron inquilinos', <MdInfo />, 'error', 1000);
                            break;
                        default:
                            this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                            break;
                    }
                })
            } else {
                this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
            }
        })
    }

    handleClickCrearInquilino = async (event) => {
        const { nombre, documento, telefono, celular, propiedad, email } = this.state;
        const { propiedades } = this.props;

        if (propiedad == '') {
            this.Notificacion('Seleccione una propiedad', <MdError />, 'error', 1000);
            return;
        }

        if (email == '') {
            this.Notificacion('Debe ingresar un E-mail', <MdError />, 'error', 1000);
            return;
        }

        let prop = await propiedades.filter(item => {
            return item.nomenclatura == propiedad
        })

        let body = await {
            nombre: nombre,
            documento: documento,
            telefono: telefono,
            celular: celular,
            idPropiedad: prop[0].id
        }

        CrearInquilino(body, this.props.setShowSpinner).then(result => {
            if (result.status == 201) {
                this.Notificacion('inquilino agregado', <MdInfo />, 'success', 1000);
                let data = {
                    username: body.documento,
                    password: `miinc${body.documento}`,
                    email: email,
                    userid: body.documento
                }
                SignUp(data)
                GetInquilinos(prop[0].id, this.props.setShowSpinner).then(result => {
                    switch (result.status) {
                        case 200:
                            this.setState({
                                inquilinos: result.data, nombre: '', documento: '', celular: '', telefono: ''
                                , visibleModificar: false, botonCrearNuevo: false
                            })
                            break;
                        case 404:
                            this.setState({ inquilinos: result.data })
                            this.Notificacion('No se encontraron inquilinos', <MdInfo />, 'error', 1000);
                            break;
                        default:
                            this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                            break;
                    }
                })
            } else {
                this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
            }
        })
    }

    handleClickCrearNueva = () => {
        this.setState({
            visibleModificar: true, botonCrearNuevo: true,
            nombre: '', documento: '', celular: '', telefono: ''
        })
    }

    render() {
        const { open, closeModal, propiedades } = this.props;
        const { inquilinos, nombre, documento, telefono, celular, botonActualizarDisable,
            inquilinosSeleccionada, visibleModificar, botonCrearNuevo, email } = this.state;
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
                    <ModalHeader toggle={closeModal}><strong>Inquilinos</strong></ModalHeader>
                    <Form>
                        <ModalBody className="d-flex justify-content-center align-items-center flex-column" >

                            <Col className="mb-3" lg={12} md={12} sm={12} xs={12}>
                                <Label for="exampleSelect" className=" mt-2" >Seleccione una propiedad</Label>
                                <Input type="select" name="select" onChange={this.handleChangeFiltroPropiedad}>
                                    <option selected={true}>Seleccione...</option>
                                    {Object.entries(propiedades).length !== 0 &&
                                        propiedades.map(propiedad => {
                                            return (
                                                <Fragment>
                                                    <option>{`${propiedad.tipoPropiedad} #${propiedad.nomenclatura}`}</option>
                                                </Fragment>
                                            )
                                        })
                                    }
                                </Input>
                            </Col>

                            <Col style={visibleModificar ? { display: 'block' } : { display: 'none' }} className="mb-3" md={12} sm={12} xs={12} lg={12} >
                                <Card className="d-flex justify-content-center align-items-center flex-column">
                                    <CardBody className="w-100">
                                        <Row>
                                            <Col xl={12} lg={12} md={12} sm={12}>
                                                <Card>
                                                    <CardHeader >INFORMACIÓN inquilino

                                                </CardHeader>
                                                    <CardBody>
                                                        <Form>
                                                            <FormGroup row>
                                                                <Label sm={5} for="nombre" >
                                                                    Nombre
                  </Label>
                                                                <Col sm={7} >
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
                                                                <Label sm={5} for="documento" >
                                                                    Documento
                  </Label>
                                                                <Col sm={7} >
                                                                    <Input
                                                                        id='documento'
                                                                        type="text"
                                                                        name='documento'
                                                                        placeholder="Ingrese documento"
                                                                        value={documento}
                                                                        onChange={this.handleChange}
                                                                        autocomplete="off"
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup row>
                                                                <Label sm={5} for="celular" >
                                                                    Celular
                  </Label>
                                                                <Col sm={7} >
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
                                                                <Label sm={5} for="telefono" >
                                                                    teléfono
                  </Label>
                                                                <Col sm={7} >
                                                                    <Input
                                                                        id='telefono'
                                                                        type="text"
                                                                        name='telefono'
                                                                        placeholder="Ingrese telefono"
                                                                        value={telefono}
                                                                        onChange={this.handleChange}
                                                                        autocomplete="off"
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup row>
                                                                <Label style={botonCrearNuevo ? { display: 'block' } : { display: 'none' }} sm={5} for="telefono" >
                                                                    Email
                  </Label>
                                                                <Col style={botonCrearNuevo ? { display: 'block' } : { display: 'none' }} sm={7} >
                                                                    <Input
                                                                        id='email'
                                                                        type="email"
                                                                        name='email'
                                                                        placeholder="Ingrese email"
                                                                        value={email}
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
                                            <Row>
                                                <Col style={botonCrearNuevo ? { display: 'none' } : { display: 'block' }} lg={6}>
                                                    <Button disabled={botonActualizarDisable} color="info" value={inquilinosSeleccionada} onClick={this.handleClickActualizarInquilino} outline>
                                                        Actualizar
                                                        </Button>
                                                </Col>
                                                <Col style={botonCrearNuevo ? { display: 'block' } : { display: 'none' }} lg={6}>
                                                    <Button disabled={botonActualizarDisable} color="info" value={inquilinosSeleccionada} onClick={this.handleClickCrearInquilino} outline>
                                                        Crear
                                                        </Button>
                                                </Col>

                                            </Row>
                                        </CardBody>
                                    </CardBody>
                                </Card>
                            </Col>


                            <Col lg="12" md="12" sm="12" xs="12">
                                <Card>
                                    <CardHeader>Listado de inquilinos
                                    <Button className="ml-1" color="info" onClick={this.handleClickCrearNueva} outline>
                                            Crear nuevo
                                                        </Button>
                                    </CardHeader>
                                    <CardBody style={style.cardBody}>
                                        <AdministrarInquilinos
                                            headers={[
                                                'Modificar',
                                                'Nombre',
                                                'Documento',
                                                'Teléfono',
                                                'Celular',
                                                'Borrar',
                                            ]}
                                            usersData={inquilinos}
                                            onClick={this.handleClickModificarinquilino}
                                            onClickBorrar={this.handleClickBorrarinquilino}
                                        />
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

export default connect(mapStateToProps, mapDispatchToProps)(AdministrarInquilinosModal);
