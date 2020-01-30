import Switch from '@material-ui/core/Switch';
import { Storage } from 'aws-amplify';
import Page from 'components/Page';
import React from 'react';
import { MdInfo, MdError } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { Button, Card, CardBody, Col, Form, FormGroup, FormText, Input, Label, Row } from 'reactstrap';
import Avatar from './Avatar';
import { SetPropiedadesHorizontales, SetPropiedadHorizontal, SetShowSpinner } from '../reducers/actions/HorizontalProperties';
import { NOTIFICATION_SYSTEM_STYLE } from '../utils/constants';
import AdministrarInventarioZonasComunesTabla from './AdministrarInventarioZonasComunesTabla';
import {
    GetZonasComunesInventario, BorrarZonasComunesInventario,
    ActualizarZonasComunesInventario, GuardarZonasComunesInventario
} from '../api/api';

const styles = {
    Page: {
        width: '100%',
        overflowY: 'auto',
    },
    cardBody: {
        padding: 1,
        textAlign: 'center',
        color: '#111',
        boxShadow: '0px 0px 9px -6px rgba(0,0,0,0.75)',
    },
    etiqueta: {
        textDecoration: 'none'
    },
    widget: {
        cursor: 'pointer'
    },
    tabla: {
        height: '500px',
        overflowY: 'auto'
    }
}

const urlImagenPdf = 'https://s3.us-east-2.amazonaws.com/miinc.com.co/public/pdf.png';
const urlImagenGenerica = 'https://www.colmenaseguros.com/imagenesColmenaARP/contenido/banner-noticias.jpg';
const urlBucket = 'https://s3.us-east-2.amazonaws.com/miinc.com.co/public/';
const initialState = {
    nombre: '',
    cantidad: '',
    zonasComunesInventario: [],
    isActualizacion: false,
    inventario: {}
}

class AdministrarInventarioZonasComunes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        }
        this.handleClickGuardar = this.handleClickGuardar.bind(this);
    }

    componentWillMount(){
        const { zonasComunesInventario } = this.props;
        this.setState({zonasComunesInventario: zonasComunesInventario})
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

    handleChange = (event) => {
        let value = event.target.value;
        value = value;
        this.setState({ [event.target.id]: value }, () => {

        })
    }

    handleClickBorrar = (event) => {
        BorrarZonasComunesInventario(event.target.value, this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    this.Notificacion('Inventario borrado', <MdInfo />, 'success', 1000);
                    this.handleClickConsultarInventario();
                    break;
                case 404:
                    this.Notificacion('No se encontró el Inventario', <MdInfo />, 'error', 1000);
                    break;
                default:
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                    break;
            }
        })
    }

    handleClickEditar = (event) => {
        this.setState({ isActualizacion: true })
        const { zonasComunesInventario } = this.state;
        let idInventario = event.target.value;
        let inventario = zonasComunesInventario.filter(item => {
            return item.id == idInventario;
        })

        this.setState({
            nombre: inventario[0].nombre,
            cantidad: inventario[0].cantidad,
            inventario: inventario[0]
        })
    }

    handleClickGuardar = (event) => {
        event.preventDefault();
        const { inventario, nombre, cantidad,isActualizacion } = this.state;

        if (!isActualizacion) {
            const { zonaComun } = this.props;
            let inventario = { nombre, cantidad, "idZonaComun": zonaComun.id,}
            GuardarZonasComunesInventario(inventario, this.props.setShowSpinner).then(result => {
                switch (result.status) {
                    case 200:
                        this.Notificacion('Inventario guardado', <MdInfo />, 'success', 1000);
                        this.handleClickConsultarInventario();
                        break;
                    default:
                        this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                        break;
                }
            })
        } else {
            inventario.nombre = nombre;
            inventario.cantidad = cantidad;

            ActualizarZonasComunesInventario(inventario, this.props.setShowSpinner).then(result => {
                switch (result.status) {
                    case 200:
                        this.Notificacion('Inventario actualizado', <MdInfo />, 'success', 1000);
                        this.handleClickConsultarInventario();
                        break;
                    case 404:
                        this.Notificacion('No se encontró el inventario', <MdInfo />, 'error', 1000);
                        break;
                    default:
                        this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                        break;
                }
            })
        }
    }

    handleClickConsultarInventario = () => {
        this.setState({ ...initialState })
        const { zonaComun } = this.props;
        GetZonasComunesInventario(zonaComun.id, this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    this.setState({zonasComunesInventario:result.data})
                    break;
                case 404:
                        this.setState({zonasComunesInventario:[]})
                    this.Notificacion('No se encontraron inventarios', <MdInfo />, 'error', 1000);
                    break;
                default:
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                    break;
            }
        })
    }

    render() {
        const { volver, zonaComun } = this.props;
        const { nombre, cantidad, isActualizacion,zonasComunesInventario } = this.state;
        return (
            <Page style={styles.Page}>
                <NotificationSystem
                    dismissible={false}
                    ref={notificationSystem =>
                        (this.notificationSystem = notificationSystem)
                    }
                    style={NOTIFICATION_SYSTEM_STYLE}
                />

                <Card style={styles.cardBody} className="d-flex justify-content-center align-items-center flex-column">
                    <Button onClick={volver} color="info" outline>Volver a zonas comunes</Button>
                    <Label>{zonaComun.nombre}</Label>
                    <CardBody className="w-100" >
                        <Form onSubmit={this.handleClickGuardar} >
                            <Row>
                                <Col xl={6} lg={6} md={12} sm={12}>
                                    <FormGroup row>
                                        <Label sm={4} for="nombre" >Nombre del item *</Label>
                                        <Col sm={8} >
                                            <Input
                                                required
                                                autoFocus
                                                id='nombre'
                                                type="textarea"
                                                name='nombre'
                                                value={nombre}
                                                placeholder="Ingrese un nombre"
                                                onChange={this.handleChange}
                                                autocomplete="off"
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col xl={6} lg={6} md={12} sm={12}>
                                    <FormGroup row>
                                        <Label sm={4} for="cantidad" >Cantidad *</Label>
                                        <Col sm={8} >
                                            <Input
                                                required
                                                id='cantidad'
                                                type="textarea"
                                                name='cantidad'
                                                value={cantidad}
                                                placeholder="Ingrese la cantidad"
                                                onChange={this.handleChange}
                                                autocomplete="off"
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </Row>
                            
                            <Row>
                                    <Col xl={6} lg={6} md={12} sm={12}>
                                        <FormGroup row>

                                        </FormGroup>
                                    </Col>
                                <Col xl={3} lg={3} md={12} sm={12}>

                                </Col>
                                <Col xl={3} lg={3} md={12} sm={12}>
                                    <FormGroup row>
                                        <Button color="info" type="submit" outline>{isActualizacion ? 'Actualizar' : 'Guardar'}</Button>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row style={styles.tabla}>
                                <AdministrarInventarioZonasComunesTabla
                                    rows={zonasComunesInventario}
                                    handleClickBorrar={this.handleClickBorrar}
                                    handleClickEditar={this.handleClickEditar} />
                            </Row>
                        </Form>
                    </CardBody>
                </Card>

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


export default connect(mapStateToProps, mapDispatchToProps)(AdministrarInventarioZonasComunes);
