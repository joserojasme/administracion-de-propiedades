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
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import AdministrarEventosTabla from './AdministrarEventosTabla';
import { GetEventos, BorrarEventos, ActualizarEventos, GuardarEventos } from '../api/api';

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
        height: '400px',
        overflowY: 'auto'
    },
    date:{
        borderBottom:'1px solid #FF6B0B'
    }
    

}

const urlImagenPdf = 'https://s3.us-east-2.amazonaws.com/miinc.com.co/public/pdf.png';
const urlImagenGenerica = 'https://www.colmenaseguros.com/imagenesColmenaARP/contenido/banner-noticias.jpg';
const urlBucket = 'https://s3.us-east-2.amazonaws.com/miinc.com.co/public/';
const initialState = {
    fileUrl: '',
    textoSubidaArchivo: 'Escoger archivo',
    fileName: '',
    nombre: '',
    descripcion: '',
    visible: 0,
    botonSubirDisable: true,
    urlImagen: urlImagenGenerica,
    eventos: [],
    isActualizacion: false,
    evento: {},
    fechaInicio: new Date().toISOString().substring(0, 10),
    fechaFin: new Date().toISOString().substring(0, 10),
    horaInicio: new Date().toLocaleTimeString(),
    horaFin: new Date().toLocaleTimeString(),
    fechaInicioInput: null,
    fechaFinInput: null,
    horaInicioInput: null,
    horaFinInput: null,
    lugar: ''
}

class AdministrarEventos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        }
        this.handleClickGuardar = this.handleClickGuardar.bind(this);
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

    handleChangeVisible = (event) => {
        let visible = 1;
        if (!event.target.checked) {
            visible = 0;
        }
        this.setState({ visible: visible })
    }

    handleClickBorrar = (event) => {
        BorrarEventos(event.target.value, this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    this.Notificacion('Evento borrado', <MdInfo />, 'success', 1000);
                    this.handleClickConsultarEventos();
                    break;
                case 404:
                    this.Notificacion('No se encontró el evento', <MdInfo />, 'error', 1000);
                    break;
                default:
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                    break;
            }
        })
    }

    handleClickNotificar = (event) => {
        const { eventos } = this.state;
        let idEvento = event.target.value;
        let evento = eventos.filter(item => {
            return item.id == idEvento;
        })
        evento[0].visible = 1;

        ActualizarEventos(evento[0], this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    this.Notificacion('Evento notificado', <MdInfo />, 'success', 1000);
                    this.handleClickConsultarEventos();
                    break;
                case 404:
                    this.Notificacion('No se encontró el evento', <MdInfo />, 'error', 1000);
                    break;
                default:
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                    break;
            }
        })
    }

    handleClickEditar = (event) => {
        this.setState({ isActualizacion: true })
        const { eventos } = this.state;
        let idEvento = event.target.value;
        let evento = eventos.filter(item => {
            return item.id == idEvento;
        })

        this.setState({
            nombre: evento[0].nombre,
            descripcion: evento[0].descripcion,
            urlImagen: evento[0].urlImagen,
            fileUrl: evento[0].urlImagen,
            visible: evento[0].visible,
            fechaInicio: evento[0].fechaInicio.substring(0, 10),
            fechaFin: evento[0].fechaFin.substring(0, 10),
            horaInicio: new Date(evento[0].fechaInicio).toLocaleTimeString(),
            horaFin: new Date(evento[0].fechaFin).toLocaleTimeString(),
            fechaInicioInput: evento[0].fechaInicio,
            fechaFinInput: evento[0].fechaFin,
            horaInicioInput: evento[0].fechaInicio,
            horaFinInput: evento[0].fechaFin,
            lugar: evento[0].lugar,
            evento: evento[0]
        })
    }

    handleClickGuardar = (event) => {
        event.preventDefault();
        const { evento, nombre, descripcion, urlImagen, visible, isActualizacion, botonSubirDisable,
        fechaInicio, fechaFin, horaInicio, horaFin,lugar } = this.state;

        if (!isActualizacion) {
            const { propiedadHorizontal } = this.props;
            let evento = { nombre, descripcion, "idPropiedadesHorizontales": propiedadHorizontal.id,
             urlImagen, "visible": visible, fechaInicio:`${fechaInicio} ${horaInicio}`
             ,fechaFin:`${fechaFin} ${horaFin}`,lugar}
            GuardarEventos(evento, this.props.setShowSpinner).then(result => {
                switch (result.status) {
                    case 200:
                        this.Notificacion('Evento guardado', <MdInfo />, 'success', 1000);
                        this.handleClickConsultarEventos();
                        break;
                    default:
                        this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                        break;
                }
            })
        } else {
            evento.nombre = nombre;
            evento.descripcion = descripcion;
            evento.urlImagen = urlImagen;
            evento.visible = visible;
            evento.visible = visible;
            evento.fechaInicio = `${fechaInicio} ${horaInicio}`;
            evento.fechaFin = `${fechaFin} ${horaFin}`;
            evento.lugar = lugar;

            ActualizarEventos(evento, this.props.setShowSpinner).then(result => {
                switch (result.status) {
                    case 200:
                        this.Notificacion('Evento actualizado', <MdInfo />, 'success', 1000);
                        this.handleClickConsultarEventos();
                        break;
                    case 404:
                        this.Notificacion('No se encontró el evento', <MdInfo />, 'error', 1000);
                        break;
                    default:
                        this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                        break;
                }
            })
        }
    }

    handleClickConsultarEventos = () => {
        this.setState({ ...initialState })
        const { propiedadHorizontal } = this.props;
        GetEventos(propiedadHorizontal.id, this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    this.setState({ eventos: result.data, })
                    break;
                case 404:
                    this.setState({ eventos: [] })
                    this.Notificacion('No se encontraron eventos', <MdInfo />, 'error', 1000);
                    break;
                default:
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                    break;
            }
        })
    }

    handleFechaInicioChange = (date, fechaCorta) => {
        this.setState({ fechaInicioInput: date, fechaInicio: fechaCorta })
    }

    handleHoraInicioChange = (date, fechaCorta) => {
        this.setState({ horaInicioInput: date, horaInicio: fechaCorta.substring(0,5) })
    }

    handleFechaFinChange = (date, fechaCorta) => {
        this.setState({ fechaFinInput: date, fechaFin: fechaCorta })
    }

    handleHoraFinChange = (date, fechaCorta) => {
        this.setState({ horaFinInput: date, horaFin: fechaCorta.substring(0,5) })
    }

    render() {
        const { propiedadHorizontal, propiedadesHorizontales, userAttributes } = this.props;
        const { fileUrl, textoSubidaArchivo, fileName, nombre, descripcion, visible
            , botonSubirDisable, eventos, isActualizacion, fechaInicioInput, fechaFinInput
            , horaInicioInput, horaFinInput,lugar } = this.state;
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
                    <CardBody className="w-100" >
                        <Form onSubmit={this.handleClickGuardar} >
                            <Row>
                                <Col xl={6} lg={6} md={12} sm={12}>
                                    <FormGroup row>
                                        <Label sm={4} for="nombre" >Título *</Label>
                                        <Col sm={8} >
                                            <Input
                                                required
                                                autoFocus
                                                id='nombre'
                                                type="textarea"
                                                name='nombre'
                                                value={nombre}
                                                placeholder="Ingrese un título"
                                                onChange={this.handleChange}
                                                autocomplete="off"
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col xl={6} lg={6} md={12} sm={12}>
                                    <FormGroup row>
                                        <Label sm={4} for="descripcion" >Descripción *</Label>
                                        <Col sm={8} >
                                            <Input
                                                required
                                                id='descripcion'
                                                type="textarea"
                                                name='descripcion'
                                                value={descripcion}
                                                placeholder="Ingrese una descripción"
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
                                    <Label sm={4} for="lugar" >Lugar *</Label>
                                        <Col sm={8} >
                                            <Input
                                                required
                                                id='lugar'
                                                type="textarea"
                                                name='lugar'
                                                value={lugar}
                                                placeholder="Ingrese el lugar"
                                                onChange={this.handleChange}
                                                autocomplete="off"
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col xl={4} lg={4} md={12} sm={12}>
                                    <FormGroup row>
                                        <Label sm={4} for="descripcion" >Visible</Label>
                                        <Col sm={8} >
                                            <Switch
                                                checked={visible}
                                                onChange={this.handleChangeVisible}
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Row>
                                    <Col xl={3} lg={3} md={12} sm={12}>
                                        <FormGroup  row>
                                            <Label for="fechaInicio" className="text-muted" >Fecha inicio</Label>
                                            <KeyboardDatePicker
                                                required
                                                margin="none"
                                                id="fechaInicio"
                                                label={fechaInicioInput == null ? 'Ingrese fecha' : ''}
                                                format="yyyy/MM/dd"
                                                value={fechaInicioInput}
                                                onChange={this.handleFechaInicioChange}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date'
                                                }}
                                                style={styles.date}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xl={3} lg={3} md={12} sm={12}>
                                        <FormGroup row>
                                            <Label for="horaInicio" className="text-muted" >Hora inicio</Label>
                                            <KeyboardTimePicker
                                                required
                                                margin="none"
                                                id="horaInicio"
                                                label={horaInicioInput == null ? 'Hora inicio' : null}
                                                value={horaInicioInput}
                                                onChange={this.handleHoraInicioChange}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change time',
                                                }}
                                                ampm={false}
                                                style={styles.date}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xl={3} lg={3} md={12} sm={12}>
                                        <FormGroup row>
                                            <Label for="fechaFin" className="text-muted" >Fecha fin</Label>
                                            <KeyboardDatePicker
                                                required
                                                margin="none"
                                                id="fechaFin"
                                                label={fechaFinInput == null ? 'Fecha fin' : ''}
                                                format="yyyy/MM/dd"
                                                value={fechaFinInput}
                                                onChange={this.handleFechaFinChange}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                                style={styles.date}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xl={3} lg={3} md={12} sm={12}>
                                        <FormGroup row>
                                            <Label for="horaFin" className="text-muted" >Hora fin</Label>
                                            <KeyboardTimePicker
                                                required
                                                margin="none"
                                                id="horaFin"
                                                label={horaFinInput == null ? 'Hora fin' : ''}
                                                value={horaFinInput}
                                                onChange={this.handleHoraFinChange}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change time',
                                                }}
                                                ampm={false}
                                                style={styles.date}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </MuiPickersUtilsProvider>
                            <Row>
                                <Col xl={6} lg={6} md={12} sm={12}>
                                    
                                </Col>

                                <Col xl={3} lg={3} md={12} sm={12}>
                                    <FormGroup row>
                                        <Button color="info" onClick={this.handleClickConsultarEventos} outline>Consultar</Button>
                                    </FormGroup>
                                </Col>
                                <Col xl={3} lg={3} md={12} sm={12}>
                                    <FormGroup row>
                                        <Button color="info" type="submit" outline>{isActualizacion ? 'Actualizar' : 'Guardar'}</Button>
                                    </FormGroup>
                                </Col>
                            </Row>
                            {eventos.length > 0 &&
                                <Row style={styles.tabla}>
                                    {eventos.length > 0 &&
                                        <AdministrarEventosTabla
                                            rows={eventos}
                                            handleClickBorrar={this.handleClickBorrar}
                                            handleClickNotificar={this.handleClickNotificar}
                                            handleClickEditar={this.handleClickEditar} />
                                    }
                                </Row>
                            }
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


export default connect(mapStateToProps, mapDispatchToProps)(AdministrarEventos);
