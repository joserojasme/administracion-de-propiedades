import React, { Fragment } from 'react';
import { MdError, MdInfo } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardHeader, Col, Form, FormGroup, FormText, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import Avatar from '../../components/Avatar';
import { SetShowSpinner } from '../../reducers/actions/HorizontalProperties';
import { NOTIFICATION_SYSTEM_STYLE } from '../../utils/constants';
import {ActualizarPropiedad} from '../../api/api';

class ActualizarPropiedadModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        const { propiedad } = this.props;
        this.setState({ ...propiedad,botonActualizarDisable:true })
    }

    handleChange = (event) => {
        let value = event.target.value;
        this.setState({ [event.target.id]: value,botonActualizarDisable:false })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        ActualizarPropiedad(this.state, this.props.setShowSpinner).then(result => {
            if (result.status == 200) {
                this.Notificacion('La propiedad se actualizó', <MdInfo />, 'success', 10);
            } else {
                this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
            }
        })
    }

    handleChangeTipoPropiedad = (event) => {
        let value = event.target.value;
        this.setState({ tipoPropiedad: value })
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
        const { open, closeModal, propiedad } = this.props;
        const { administracionAlDia,
            areaPrivada,
            celularArrendatario,
            celularPropietario,
            chipInmueble,
            fechaFinArriendo,
            fechaInicioArriendo,
            fechaRegistro,
            id,
            idPropiedadHorizontal,
            idUsuario,
            identificacionPropietario,
            matriculaInmobiliaria,
            nombreArrendatario,
            nombrePropietario,
            nomenclatura,
            piso,
            telefonoArrendatario,
            telefonoPropietario,
            tipoIdentificacionArrendatario,
            torre,
            urlImagenPropiedad,
            urlImagenPropietario,
            valorAdministracion,botonActualizarDisable } = this.state;
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
                    <ModalHeader toggle={closeModal}>Actualizar propiedad {nomenclatura}</ModalHeader>
                    <Form onSubmit={this.handleSubmit}>
                        <ModalBody className="d-flex justify-content-center align-items-center flex-column" >
                            <Col style={{ display: 'block' }} className="mb-3" md={12} sm={12} xs={12} lg={12} >
                                <Card className="d-flex justify-content-center align-items-center flex-column">
                                    <CardBody className="w-100">
                                        <Row>
                                            <Col xl={12} lg={12} md={12} sm={12}>
                                                <Card>
                                                    <CardHeader >Por favor agregue la información</CardHeader>
                                                    <CardBody>

                                                        <FormGroup row>
                                                            <Label sm={5} for="chipInmueble" >Chip Inmueble *</Label>
                                                            <Col sm={7} >
                                                                <Input
                                                                    required
                                                                    id='chipInmueble'
                                                                    type="text"
                                                                    name='chipInmueble'
                                                                    placeholder="Ingrese chip Inmueble"
                                                                    value={chipInmueble}
                                                                    onChange={this.handleChange}
                                                                    autocomplete="off"
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup row>
                                                            <Label sm={5} for="matriculaInmobiliaria" >Matricula inmobiliaria</Label>
                                                            <Col sm={7} >
                                                                <Input
                                                                    id='matriculaInmobiliaria'
                                                                    type="text"
                                                                    name='matriculaInmobiliaria'
                                                                    placeholder="Ingrese matricula inmobiliaria"
                                                                    value={matriculaInmobiliaria}
                                                                    onChange={this.handleChange}
                                                                    autocomplete="off"
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup row>
                                                            <Label sm={2} for="tipoPropiedad" >Tipo propiedad</Label>
                                                            <Col sm={4} >
                                                                <Input type="select" name="select" onChange={this.handleChangeTipoPropiedad}>
                                                                    {
                                                                        tipoPropiedadList.length > 0 &&
                                                                        tipoPropiedadList.map(tipo => {
                                                                            return (
                                                                                <Fragment>
                                                                                    <option>{tipo}</option>
                                                                                </Fragment>
                                                                            )
                                                                        })
                                                                    }
                                                                </Input>
                                                            </Col>
                                                            <Label sm={2} for="valorAdministracion" >Valor administración</Label>
                                                            <Col sm={4} >
                                                                <Input
                                                                    id='valorAdministracion'
                                                                    type="text"
                                                                    name='valorAdministracion'
                                                                    placeholder="Ingrese el valor mensual administración"
                                                                    value={valorAdministracion}
                                                                    onChange={this.handleChange}
                                                                    autocomplete="off"
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup row>
                                                            <Label sm={2} for="areaPrivada" >Area privada</Label>
                                                            <Col sm={4} >
                                                                <Input
                                                                    id='areaPrivada'
                                                                    type="text"
                                                                    name='areaPrivada'
                                                                    placeholder="Ingrese area privada"
                                                                    value={areaPrivada}
                                                                    onChange={this.handleChange}
                                                                    autocomplete="off"
                                                                />
                                                            </Col>
                                                            <Label sm={2} for="nomenclatura" >Nomenclatura *</Label>
                                                            <Col sm={4} >
                                                                <Input
                                                                    required
                                                                    id='nomenclatura'
                                                                    type="text"
                                                                    name='nomenclatura'
                                                                    placeholder="Ingrese la nomenclatura"
                                                                    value={nomenclatura}
                                                                    onChange={this.handleChange}
                                                                    autocomplete="off"
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup row>
                                                            <Label sm={2} for="torre" >Torre *</Label>
                                                            <Col sm={4} >
                                                                <Input
                                                                    required
                                                                    id='torre'
                                                                    type="text"
                                                                    name='torre'
                                                                    placeholder="Ingrese la torre"
                                                                    value={torre}
                                                                    onChange={this.handleChange}
                                                                    autocomplete="off"
                                                                />
                                                            </Col>
                                                            <Label sm={2} for="piso" >Piso *</Label>
                                                            <Col sm={4} >
                                                                <Input
                                                                    required
                                                                    id='piso'
                                                                    type="text"
                                                                    name='piso'
                                                                    placeholder="Ingrese el piso"
                                                                    value={piso}
                                                                    onChange={this.handleChange}
                                                                    autocomplete="off"
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup row>
                                                            <Label sm={2} for="nombreArrendatario" >Nombre rrendatario</Label>
                                                            <Col sm={4} >
                                                                <Input
                                                                    id='nombreArrendatario'
                                                                    type="text"
                                                                    name='nombreArrendatario'
                                                                    placeholder="Ingrese el nombre del arrendatario"
                                                                    value={nombreArrendatario}
                                                                    onChange={this.handleChange}
                                                                    autocomplete="off"
                                                                />
                                                            </Col>
                                                            <Label sm={2} for="tipoIdentificacionArrendatario" ># Identificacion arrendatario</Label>
                                                            <Col sm={4} >
                                                                <Input
                                                                    id='tipoIdentificacionArrendatario'
                                                                    type="text"
                                                                    name='tipoIdentificacionArrendatario'
                                                                    placeholder="Ingrese el # documento arrendatario"
                                                                    value={tipoIdentificacionArrendatario}
                                                                    onChange={this.handleChange}
                                                                    autocomplete="off"
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup row>
                                                            <Label sm={2} for="celularArrendatario" >Celular arrendatario</Label>
                                                            <Col sm={4} >
                                                                <Input
                                                                    id='celularArrendatario'
                                                                    type="text"
                                                                    name='celularArrendatario'
                                                                    placeholder="Ingrese celular del arrendatario"
                                                                    value={celularArrendatario}
                                                                    onChange={this.handleChange}
                                                                    autocomplete="off"
                                                                />
                                                            </Col>
                                                            <Label sm={2} for="telefonoArrendatario" >Telefono arrendatario</Label>
                                                            <Col sm={4} >
                                                                <Input
                                                                    id='telefonoArrendatario'
                                                                    type="text"
                                                                    name='telefonoArrendatario'
                                                                    placeholder="Ingrese el telefono del arrendatario"
                                                                    value={telefonoArrendatario}
                                                                    onChange={this.handleChange}
                                                                    autocomplete="off"
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
                                                    <Button disabled={botonActualizarDisable} color="info"  outline>
                                                        Actualizar
                                                        </Button>
                                                </Col>
                                            </Row>
                                        </CardBody>
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

let tipoPropiedadList = [
    'Apartamento',
    'Bodega',
    'Casa',
    'Cuarto útil',
    'Local',
    'Oficina',
    'Otros',
    'Parqueadero'
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

export default connect(mapStateToProps, mapDispatchToProps)(ActualizarPropiedadModal);