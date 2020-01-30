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
import Vehiculos from '../Vehiculos';
import { ActualizarVehiculo,CrearVehiculo,GetVehiculos } from '../../api/api';

const style = {
    cardBody: {
        maxHeight: '350px',
        height: '350px',
        overflowY: 'auto'
    }
}

class VehiculosModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vehiculos: [],
            placa: '',
            marca: '',
            referencia: '',
            modelo: '',
            tipoServicio: '',
            color: '',
            tipoVehiculo: '',
            botonActualizarDisable: true,
            vehiculosSeleccionada: '',
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
            const { placa, marca, referencia, modelo,tipoServicio, color, tipoVehiculo } = this.state;
            if (placa != '' && marca != '' && referencia != '' && modelo != '' && tipoServicio != '' && color != '' && tipoVehiculo != '') {
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
            this.setState({ vehiculos: [],placa:'',marca:'',modelo:'',referencia:'',tipoServicio:'', color:'', tipoVehiculo:''
            ,visibleModificar:false,botonCrearNuevo:false,vehiculosSeleccionada:'',propiedad:'' })
            return;
        } 
        value = value.split("#", 2);
        this.setState({propiedad:value[1], visibleModificar:false,botonCrearNuevo:false});
        let propiedad = await propiedades.filter(item => {
            return item.nomenclatura == value[1];
        })
        GetVehiculos(propiedad[0].id, this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    this.setState({ vehiculos: result.data,placa:'',marca:'',modelo:'',referencia:'', tipoServicio:'', color:'', tipoVehiculo:'' })
                    break;
                case 404:
                    this.setState({ vehiculos: result.data,placa:'',marca:'',modelo:'',referencia:'', tipoServicio:'', color:'', tipoVehiculo:'' })
                    this.Notificacion('No se encontraron vehiculos', <MdInfo />, 'error', 1000);
                    break;
                default:
                        this.setState({ placa:'',marca:'',modelo:'',referencia:'', tipoServicio:'', color:'', tipoVehiculo:'' })
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                    break;
            }
        })

    }

    handleClickBorrarvehiculo = async (event) =>{
        let value = event.target.value;
        const { vehiculos } = this.state;
        let vehiculo = vehiculos.filter(item => {
            return item.id == value;
        })

        let body = await {
            id: vehiculo[0].id,
            placa: vehiculo[0].placa,
            marca: vehiculo[0].marca,
            referencia: vehiculo[0].referencia,
            modelo: vehiculo[0].modelo,
            tipoServicio:vehiculo[0].tipoServicio,
            color:vehiculo[0].color,
            tipoVehiculo:vehiculo[0].tipoVehiculo,
            idPropiedad: vehiculo[0].idPropiedad,
            visible: '0',
            fechaRegistro: vehiculo[0].fechaRegistro,
        }

        ActualizarVehiculo(body, this.props.setShowSpinner).then(result => {
            if (result.status == 200) {
                this.Notificacion('La info. vehiculo se actualizó', <MdInfo />, 'success', 1000);
                GetVehiculos(vehiculo[0].idPropiedad, this.props.setShowSpinner).then(result => {
                    switch (result.status) {
                        case 200:
                            this.setState({ vehiculos: result.data,placa:'',marca:'',modelo:'',referencia:'',tipoServicio:'',color:'',tipoVehiculo:'',visibleModificar:false,botonCrearNuevo:false })
                            break;
                        case 404:
                            this.setState({ vehiculos: result.data })
                            this.Notificacion('No se encontraron vehiculos', <MdInfo />, 'error', 1000);
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

    handleClickModificarvehiculo = (event) => {
        let value = event.target.value;
        const { vehiculos } = this.state;
        let vehiculo = vehiculos.filter(item => {
            return item.id == value;
        })
        this.setState({
            placa: vehiculo[0].placa,
            marca: vehiculo[0].marca,
            modelo: vehiculo[0].modelo,
            referencia: vehiculo[0].referencia,
            tipoServicio:vehiculo[0].tipoServicio,
            color:vehiculo[0].color,
            tipoVehiculo:vehiculo[0].tipoVehiculo,
            botonActualizarDisable: true,
            vehiculosSeleccionada: value,
            visibleModificar:true,
            botonCrearNuevo:false
        })
    }

    handleClickActualizarVehiculo = async (event) => {
        let value = event.target.value;
        const { vehiculos } = this.state;
        let vehiculo = vehiculos.filter(item => {
            return item.id == value;
        })

        const { placa, marca, referencia, modelo,tipoServicio, color, tipoVehiculo } = this.state;

        let body = await {
            id: vehiculo[0].id,
            placa: placa,
            marca: marca,
            referencia: referencia,
            modelo: modelo,
            tipoServicio:tipoServicio,
            color:color,
            tipoVehiculo:tipoVehiculo,
            idPropiedad: vehiculo[0].idPropiedad,
            visible: vehiculo[0].visible,
            fechaRegistro: vehiculo[0].fechaRegistro,
        }

        ActualizarVehiculo(body, this.props.setShowSpinner).then(result => {
            if (result.status == 200) {
                this.Notificacion('La info. vehiculo se actualizó', <MdInfo />, 'success', 1000);
                GetVehiculos(vehiculo[0].idPropiedad, this.props.setShowSpinner).then(result => {
                    switch (result.status) {
                        case 200:
                                this.setState({ vehiculos: result.data,placa:'',marca:'',modelo:'',referencia:'',
                                tipoServicio:'',color:'',tipoVehiculo:'',visibleModificar:false,botonCrearNuevo:false })
                            break;
                        case 404:
                            this.setState({ vehiculos: result.data })
                            this.Notificacion('No se encontraron vehiculos', <MdInfo />, 'error', 1000);
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

    handleClickCrearVehiculo = async (event) => {
        const { placa, marca, referencia, modelo,propiedad,tipoServicio, color,tipoVehiculo } = this.state;
        const { propiedades } = this.props;
        
        if(propiedad == ''){
            this.Notificacion('Seleccione una propiedad', <MdError />, 'error', 1000);
            return;
        }

        let prop = await propiedades.filter(item => {
            return item.nomenclatura == propiedad
        })

        let body = await {
            placa: placa,
            marca: marca,
            referencia: referencia,
            modelo: modelo,
            tipoServicio:tipoServicio,
            color:color,
            tipoVehiculo:tipoVehiculo,
            idPropiedad: prop[0].id
        }

        CrearVehiculo(body, this.props.setShowSpinner).then(result => {
            if (result.status == 201) {
                this.Notificacion('vehiculo agregada', <MdInfo />, 'success', 1000);
                GetVehiculos(prop[0].id, this.props.setShowSpinner).then(result => {
                    switch (result.status) {
                        case 200:
                                this.setState({ vehiculos: result.data,placa:'',marca:'',modelo:'',referencia:'',
                                tipoServicio:'', color:'', tipoVehiculo:''
                                ,visibleModificar:false,botonCrearNuevo:false })
                            break;
                        case 404:
                            this.setState({ vehiculos: result.data })
                            this.Notificacion('No se encontraron vehiculos', <MdInfo />, 'error', 1000);
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
        placa:'',marca:'',modelo:'',referencia:'',tipoServicio:'', color:'', tipoVehiculo:''})
    }

    render() {
        const { open, closeModal, propiedades } = this.props;
        const { vehiculos, placa, marca, referencia, modelo, tipoServicio,color,tipoVehiculo, botonActualizarDisable, 
            vehiculosSeleccionada,visibleModificar,botonCrearNuevo } = this.state;
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
                    <ModalHeader toggle={closeModal}><strong>Vehículos</strong></ModalHeader>
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
                                                    <CardHeader >INFORMACIÓN vehículo 
                                                    
                                                </CardHeader>
                                                    <CardBody>
                                                        <Form>
                                                            <FormGroup row>
                                                                <Label sm={5} for="placa" >
                                                                    Placa
                  </Label>
                                                                <Col sm={7} >
                                                                    <Input
                                                                        autoFocus
                                                                        id='placa'
                                                                        type="text"
                                                                        name='placa'
                                                                        placeholder="Ingrese placa"
                                                                        value={placa}
                                                                        onChange={this.handleChange}
                                                                        autocomplete="off"
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup row>
                                                                <Label sm={5} for="marca" >
                                                                    Marca
                  </Label>
                                                                <Col sm={7} >
                                                                    <Input
                                                                        id='marca'
                                                                        type="text"
                                                                        name='marca'
                                                                        placeholder="Ingrese marca"
                                                                        value={marca}
                                                                        onChange={this.handleChange}
                                                                        autocomplete="off"
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup row>
                                                                <Label sm={5} for="modelo" >
                                                                    Modelo
                  </Label>
                                                                <Col sm={7} >
                                                                    <Input
                                                                        id='modelo'
                                                                        type="text"
                                                                        name='modelo'
                                                                        placeholder="Ingrese modelo"
                                                                        value={modelo}
                                                                        onChange={this.handleChange}
                                                                        autocomplete="off"
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup row>
                                                                <Label sm={5} for="referencia" >
                                                                    Referencia
                  </Label>
                                                                <Col sm={7} >
                                                                    <Input
                                                                        id='referencia'
                                                                        type="text"
                                                                        name='referencia'
                                                                        placeholder="Ingrese referencia"
                                                                        value={referencia}
                                                                        onChange={this.handleChange}
                                                                        autocomplete="off"
                                                                    />
                                                                </Col>
                                                            </FormGroup>

                                                            <FormGroup row>
                                                                <Label sm={5}>
                                                                    Servicio
                  </Label>
                                                                <Col sm={3.5}>
                                                                    <FormGroup check>
                                                                        <Label check>
                                                                            <Input
                                                                                checked={tipoServicio == 'PUBLICO' ? true : false}
                                                                                type="radio" id="tipoServicio" value="PUBLICO" onChange={this.handleChange} /> Publico
                      </Label>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col sm={3.5}>
                                                                    <FormGroup check>
                                                                        <Label check>
                                                                            <Input type="radio" onChange={this.handleChange}
                                                                                checked={tipoServicio == 'PARTICULAR' ? true : false}
                                                                                id="tipoServicio" value="PARTICULAR" /> Particular
                      </Label>
                                                                    </FormGroup>
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
                                                                <Label sm={5} for="tipoVehiculo" >
                                                                    Tipo vehiculo
                  </Label>
                                                                <Col sm={7} >
                                                                    <Input
                                                                        id='tipoVehiculo'
                                                                        type="text"
                                                                        name='tipoVehiculo'
                                                                        placeholder="Ingrese tipo vehiculo"
                                                                        value={tipoVehiculo}
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
                                                <Col style={botonCrearNuevo ? {display:'none'} : {display:'block'}} lg={6}>
                                                    <Button disabled={botonActualizarDisable} color="info" value={vehiculosSeleccionada} onClick={this.handleClickActualizarVehiculo} outline>
                                                        Actualizar
                                                        </Button>
                                                </Col>
                                                <Col style={botonCrearNuevo ? {display:'block'} : {display:'none'}} lg={6}>
                                                    <Button disabled={botonActualizarDisable} color="info" value={vehiculosSeleccionada} onClick={this.handleClickCrearVehiculo} outline>
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
                                    <CardHeader>Listado de vehículos
                                    <Button className="ml-1" color="info"  onClick={this.handleClickCrearNueva} outline>
                                                        Crear nuevo
                                                        </Button>
                                    </CardHeader>
                                    <CardBody style={style.cardBody}>
                                        <Vehiculos
                                            headers={[
                                                'Modificar',
                                                'Placa',
                                                'Marca',
                                                'Referencia',
                                                'Modelo',
                                                'Tipo Servicio',
                                                'modelo',
                                                'Tipo Vehículo',
                                                'Borrar',
                                            ]}
                                            usersData={vehiculos}
                                            onClick={this.handleClickModificarvehiculo}
                                            onClickBorrar={this.handleClickBorrarvehiculo}
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

export default connect(mapStateToProps, mapDispatchToProps)(VehiculosModal);
