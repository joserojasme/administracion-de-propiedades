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
import Mascotas from '../Mascotas';
import { ActualizarMascota,CrearMascota,GetMascotas } from '../../api/api';

const style = {
    cardBody: {
        maxHeight: '350px',
        height: '350px',
        overflowY: 'auto'
    }
}

class MascotasModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mascotas: [],
            nombre: '',
            raza: '',
            genero: '',
            color: '',
            botonActualizarDisable: true,
            mascotaSeleccionada: '',
            propiedad:'',
            visibleModificar:false,
            botonCrearNuevo:false,
        }
        this.handleChangeFiltroPropiedad = this.handleChangeFiltroPropiedad.bind(this);
    }

    handleChange = (event) => {
        let value = event.target.value;
        value = value.toUpperCase();
        this.setState({ [event.target.id]: value }, () => {
            const { nombre, raza, genero, color, } = this.state;
            if (nombre != '' && raza != '' && genero != '' && color != '') {
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
        if (value == 'Seleccione...'){
            this.setState({ mascotas: [],nombre:'',raza:'',color:'',genero:''
            ,visibleModificar:false,botonCrearNuevo:false,mascotaSeleccionada:'',propiedad:'' })
            return;
        } 
        value = value.split("#", 2);
        this.setState({propiedad:value[1], visibleModificar:false,botonCrearNuevo:false});
        let propiedad = await propiedades.filter(item => {
            return item.nomenclatura == value[1];
        })
        GetMascotas(propiedad[0].id, this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    this.setState({ mascotas: result.data,nombre:'',raza:'',color:'',genero:'' })
                    break;
                case 404:
                    this.setState({ mascotas: result.data,nombre:'',raza:'',color:'',genero:'' })
                    this.Notificacion('No se encontraron mascotas', <MdInfo />, 'error', 1000);
                    break;
                default:
                    this.setState({nombre:'',raza:'',color:'',genero:'' })
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                    break;
            }
        })

    }

    handleClickBorrarMascota = async (event) =>{
        let value = event.target.value;
        const { mascotas } = this.state;
        let mascota = mascotas.filter(item => {
            return item.id == value;
        })

        let body = await {
            id: mascota[0].id,
            nombre: mascota[0].nombre,
            raza: mascota[0].raza,
            genero: mascota[0].genero,
            color: mascota[0].color,
            idPropiedad: mascota[0].idPropiedad,
            visible: '0',
            fechaRegistro: mascota[0].fechaRegistro,
        }

        ActualizarMascota(body, this.props.setShowSpinner).then(result => {
            if (result.status == 200) {
                this.Notificacion('La info. mascota se actualizó', <MdInfo />, 'success', 1000);
                GetMascotas(mascota[0].idPropiedad, this.props.setShowSpinner).then(result => {
                    switch (result.status) {
                        case 200:
                            this.setState({ mascotas: result.data,nombre:'',raza:'',color:'',genero:'',visibleModificar:false,botonCrearNuevo:false })
                            break;
                        case 404:
                            this.setState({ mascotas: result.data })
                            this.Notificacion('No se encontraron mascotas', <MdInfo />, 'error', 1000);
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

    handleClickModificarMascota = (event) => {
        let value = event.target.value;
        const { mascotas } = this.state;
        let mascota = mascotas.filter(item => {
            return item.id == value;
        })
        this.setState({
            nombre: mascota[0].nombre,
            raza: mascota[0].raza,
            color: mascota[0].color,
            genero: mascota[0].genero,
            botonActualizarDisable: true,
            mascotaSeleccionada: value,
            visibleModificar:true,
            botonCrearNuevo:false
        })
    }

    handleClickActualizarMascota = async (event) => {
        let value = event.target.value;
        const { mascotas } = this.state;
        let mascota = mascotas.filter(item => {
            return item.id == value;
        })

        const { nombre, raza, genero, color, } = this.state;

        let body = await {
            id: mascota[0].id,
            nombre: nombre,
            raza: raza,
            genero: genero,
            color: color,
            idPropiedad: mascota[0].idPropiedad,
            visible: mascota[0].visible,
            fechaRegistro: mascota[0].fechaRegistro,
        }

        ActualizarMascota(body, this.props.setShowSpinner).then(result => {
            if (result.status == 200) {
                this.Notificacion('La info. mascota se actualizó', <MdInfo />, 'success', 1000);
                GetMascotas(mascota[0].idPropiedad, this.props.setShowSpinner).then(result => {
                    switch (result.status) {
                        case 200:
                                this.setState({ mascotas: result.data,nombre:'',raza:'',color:'',genero:'',visibleModificar:false,botonCrearNuevo:false })
                            break;
                        case 404:
                            this.setState({ mascotas: result.data })
                            this.Notificacion('No se encontraron mascotas', <MdInfo />, 'error', 1000);
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

    handleClickCrearMascota = async (event) => {
        const { nombre, raza, genero, color,propiedad } = this.state;
        const { propiedades } = this.props;
        
        if(propiedad == ''){
            this.Notificacion('Seleccione una propiedad', <MdError />, 'error', 1000);
            return;
        }

        let prop = await propiedades.filter(item => {
            return item.nomenclatura == propiedad
        })

        let body = await {
            nombre: nombre,
            raza: raza,
            genero: genero,
            color: color,
            idPropiedad: prop[0].id
        }

        CrearMascota(body, this.props.setShowSpinner).then(result => {
            if (result.status == 201) {
                this.Notificacion('Mascota agregada', <MdInfo />, 'success', 1000);
                GetMascotas(prop[0].id, this.props.setShowSpinner).then(result => {
                    switch (result.status) {
                        case 200:
                                this.setState({ mascotas: result.data,nombre:'',raza:'',color:'',genero:'',visibleModificar:false,botonCrearNuevo:false })
                            break;
                        case 404:
                            this.setState({ mascotas: result.data })
                            this.Notificacion('No se encontraron mascotas', <MdInfo />, 'error', 1000);
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

    handleClickCrearNueva = () =>{
        this.setState({visibleModificar:true, botonCrearNuevo:true,
        nombre:'',raza:'',color:'',genero:''})
    }

    render() {
        const { open, closeModal, propiedades } = this.props;
        const { mascotas, nombre, raza, genero, color, botonActualizarDisable, 
            mascotaSeleccionada,visibleModificar,botonCrearNuevo } = this.state;
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
                    <ModalHeader toggle={closeModal}><strong>Mascotas</strong></ModalHeader>
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

                            <Col style={visibleModificar ? {display:'block'} : {display:'none'}} className="mb-3" md={12} sm={12} xs={12} lg={12} >
                                <Card className="d-flex justify-content-center align-items-center flex-column">
                                    <CardBody className="w-100">
                                        <Row>
                                            <Col xl={12} lg={12} md={12} sm={12}>
                                                <Card>
                                                    <CardHeader >INFORMACIÓN MASCOTA 
                                                    
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
                                                                <Label sm={5} for="raza" >
                                                                    Raza
                  </Label>
                                                                <Col sm={7} >
                                                                    <Input
                                                                        id='raza'
                                                                        type="text"
                                                                        name='raza'
                                                                        placeholder="Ingrese raza"
                                                                        value={raza}
                                                                        onChange={this.handleChange}
                                                                        autocomplete="off"
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup row>
                                                                <Label sm={5} for="color" >
                                                                    Color
                  </Label>
                                                                <Col sm={7} >
                                                                    <Input
                                                                        id='color'
                                                                        type="text"
                                                                        name='color'
                                                                        placeholder="Ingrese color"
                                                                        value={color}
                                                                        onChange={this.handleChange}
                                                                        autocomplete="off"
                                                                    />
                                                                </Col>
                                                            </FormGroup>

                                                            <FormGroup row>
                                                                <Label sm={5}>
                                                                    Género
                  </Label>
                                                                <Col sm={3.5}>
                                                                    <FormGroup check>
                                                                        <Label check>
                                                                            <Input
                                                                                checked={genero == 'M' ? true : false}
                                                                                type="radio" id="genero" value="M" onChange={this.handleChange} /> Macho
                      </Label>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col sm={3.5}>
                                                                    <FormGroup check>
                                                                        <Label check>
                                                                            <Input type="radio" onChange={this.handleChange}
                                                                                checked={genero == 'F' ? true : false}
                                                                                id="genero" value="F" /> Hembra
                      </Label>
                                                                    </FormGroup>
                                                                </Col>

                                                            </FormGroup>

                                                        </Form>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <CardBody>
                                            <Row>
                                                <Col style={botonCrearNuevo ? {display:'none'} : {display:'block'}} lg={6}>
                                                    <Button disabled={botonActualizarDisable} color="info" value={mascotaSeleccionada} onClick={this.handleClickActualizarMascota} outline>
                                                        Actualizar
                                                        </Button>
                                                </Col>
                                                <Col style={botonCrearNuevo ? {display:'block'} : {display:'none'}} lg={6}>
                                                    <Button disabled={botonActualizarDisable} color="info" value={mascotaSeleccionada} onClick={this.handleClickCrearMascota} outline>
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
                                    <CardHeader>Listado de mascotas
                                    <Button className="ml-1" color="info"  onClick={this.handleClickCrearNueva} outline>
                                                        Crear nueva
                                                        </Button>
                                    </CardHeader>
                                    <CardBody style={style.cardBody}>
                                        <Mascotas
                                            headers={[
                                                'Modificar',
                                                'Nombre',
                                                'Raza',
                                                'Genero',
                                                'Color',
                                                'Borrar',
                                            ]}
                                            usersData={mascotas}
                                            onClick={this.handleClickModificarMascota}
                                            onClickBorrar={this.handleClickBorrarMascota}
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

export default connect(mapStateToProps, mapDispatchToProps)(MascotasModal);
