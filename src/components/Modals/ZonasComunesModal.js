import React, { Fragment } from 'react';
import {
    Form, Modal, ModalBody, ModalHeader, FormGroup,
    Label, Card, CardImg, ListGroup, ListGroupItem,
    Row, Col, Input, CardBody, CardText, CardTitle, ButtonGroup, Button
} from 'reactstrap';
import { GetReservasZonaComun, InsertarReservaZonaComun, BorrarReservaZonaComun } from '../../api/api';
import { connect } from 'react-redux';
import { SetShowSpinner } from '../../reducers/actions/HorizontalProperties';
import { MdError, MdImportantDevices, MdInfo } from 'react-icons/md';
import { NOTIFICATION_SYSTEM_STYLE } from '../../utils/constants';
import NotificationSystem from 'react-notification-system';
import { numberFormat } from '../../utils/utilsFunctions';
import InventarioZonaComun from '../InventarioZonaComun';
import EventCalendarZonasComunes from '../EventCalendarZonasComunes';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


function ccyFormat(num) {
    num = parseFloat(num);
    let value = `${num.toFixed(2)}`;
    return numberFormat(value);
}

const styles = {
    img: {
        maxHeight: '400px',
        maxWidth: '400px'
    }
}

class ZonasComunesModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zonasComunes: [],
            fechaInicio: '',
            horaInicio: '',
            fechaFin: '',
            horaFin: '',
            confirmacionFecha: '',
            nombreReserva: '',
            mostrar: true
        }
        this.handleClickReservarZonaComun = this.handleClickReservarZonaComun.bind(this);
    }

    componentWillMount() {
        this.obtenerReservasZonaComun();
    }

    handleClickBorrarReserva = (event) => {
        const { propiedadesHorizontales } = this.props;
        if (event.idUsuario != propiedadesHorizontales.copropietario.id) return;

        this.setState({ mostrar: false }, () => {
            confirmAlert({
                title: 'Confirmar borrado',
                message: `¿Seguro desea borrar la reserva ${event.nombre}?`,
                buttons: [
                    {
                        label: 'Si',
                        onClick: () => this.borrarReserva(event)
                    },
                    {
                        label: 'No',
                        onClick: () => this.setState({ mostrar: true })
                    }
                ]
            });
        })
    }

    borrarReserva = (event) => {
        const { closeModal } = this.props;
        BorrarReservaZonaComun(event.idZonaComun, this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    this.Notificacion('Reserva borrada', <MdInfo />, 'success', 1);
                    closeModal();
                    break;
                case 404:
                    this.Notificacion('No se encontró la reserva', <MdInfo />, 'error', 1000);
                    this.setState({ mostrar: true })
                    break;
                default:
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                    this.setState({ mostrar: true })
                    break;
            }
        })
    }

    obtenerReservasZonaComun = () => {
        const { idZonaComun, setShowSpinner } = this.props;
        GetReservasZonaComun(idZonaComun, setShowSpinner).then(result => {
            if (result.status === 200) {
                this.setState({ zonasComunes: result.data })
            } else {
                this.Notificacion(result.data, <MdError />, 'error', 1000);
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

    handleClickReservarZonaComun = (event) => {
        event.preventDefault();
        const { propiedadesHorizontales, idZonaComun } = this.props;
        const { fechaInicio, fechaFin, horaInicio, horaFin, nombreReserva } = this.state;
        let arregloFechaInicio = fechaInicio.split("-", 3);
        let arregloFechaFin = fechaFin.split("-", 3);
        let arregloHoraInicio = horaInicio.split(":", 2);
        let arregloHoraFin = horaFin.split(":", 2);

        let fullFechaInicio = arregloFechaInicio[0] + arregloFechaInicio[1] + arregloFechaInicio[2];
        let fullFechaFin = arregloFechaFin[0] + arregloFechaFin[1] + arregloFechaFin[2];
        let fullHoraInicio = arregloHoraInicio[0] + arregloHoraInicio[1];
        let fullHoraFin = arregloHoraFin[0] + arregloHoraFin[1];

        if ((fullFechaFin >= fullFechaInicio) && (fullHoraFin > fullHoraInicio)) {
            let reservaZonaComun = {
                "fechaInicio": `${fechaInicio} ${horaInicio}`,
                "fechaFin": `${fechaFin} ${horaFin}`,
                "idUsuario": propiedadesHorizontales.copropietario.id,
                "idZonaComun": idZonaComun,
                "nombre": nombreReserva
            }
            InsertarReservaZonaComun(reservaZonaComun, this.props.setShowSpinner).then(result => {
                if (result.status == 201) {
                    this.setState({
                        fechaInicio: '', fechaFin: '', horaInicio: '', horaFin: '', nombreReserva: ''
                    }, () => {
                        this.Notificacion('Reserva guardada', <MdImportantDevices />, 'success')
                        this.obtenerReservasZonaComun();
                    })
                } else {
                    this.Notificacion('Error guardando la reserva', <MdError />, 'error', 1000);
                }
            })
        } else {
            this.Notificacion('Por favor valide las fechas', <MdError />, 'error', 1000);
        }

    }

    handleChange = (event) => {
        let value = event.target.value;

        if (event.target.id == 'fechaInicio') {
            this.setState({ fechaInicio: value, fechaFin: value });
        }

        this.setState({ [event.target.id]: value }, () => {
            const { fechaInicio, fechaFin, horaInicio, horaFin } = this.state;
            if (fechaInicio != '' && fechaFin != '' && horaInicio != '') {
                this.setState({
                    confirmacionFecha: `Reservar desde el día ${this.state.fechaInicio} 
                a las ${this.state.horaInicio} horas. Hasta ${this.state.fechaFin} a las ${this.state.horaFin}`
                })
            }
        });

    }

    render() {
        const { open, closeModal, } = this.props;
        const { zonasComunes, fechaInicio,
            horaInicio,
            fechaFin,
            horaFin,
            confirmacionFecha, nombreReserva, mostrar } = this.state;

        return (
            <Fragment>
                <NotificationSystem
                    dismissible={false}
                    ref={notificationSystem =>
                        (this.notificationSystem = notificationSystem)
                    }
                    style={NOTIFICATION_SYSTEM_STYLE}
                />
                {mostrar &&
                    <Modal
                        size="xl"
                        isOpen={open}
                        toggle={closeModal}
                        centered>
                        {zonasComunes.length === 0 &&
                            <ModalHeader toggle={closeModal}><strong>Espere...</strong></ModalHeader>
                        }
                        {zonasComunes.length !== 0 &&
                            <Fragment>
                                <ModalHeader toggle={closeModal}><strong>{zonasComunes[0].nombre}</strong></ModalHeader>
                                <Form>
                                    <ModalBody>
                                        <Card className="d-flex justify-content-center align-items-center flex-column">
                                            <CardImg style={styles.img} src={zonasComunes[0].urlImagen} />
                                        </Card>
                                        <Card className="mb-2">
                                            <CardBody>

                                                <CardText> {zonasComunes[0].descripcion}</CardText>
                                                <ListGroupItem>
                                                    <CardTitle><strong>Valor reserva:</strong>&nbsp;${ccyFormat(zonasComunes[0].valorReserva)} &nbsp; <strong>Valor deposito:</strong>&nbsp;${ccyFormat(zonasComunes[0].valorDeposito)}
                                                        <ButtonGroup style={{display:'none'}}>
                                                            <Button
                                                                color={'info'}
                                                                outline
                                                            >
                                                                Pagar valores
                  </Button>
                                                        </ButtonGroup>
                                                    </CardTitle>

                                                </ListGroupItem>
                                                <Row>
                                                    {zonasComunes[0].tblZonasComunesInventario.length !== 0 &&

                                                        <Col md={12} sm={12} xs={12} >
                                                            <Card>
                                                                <ListGroup flush>
                                                                    <ListGroupItem>
                                                                        <Label ><strong>Inventario</strong></Label>
                                                                        <InventarioZonaComun
                                                                            headers={[
                                                                                'Nombre',
                                                                                'Cantidad',
                                                                            ]}
                                                                            usersData={zonasComunes[0].tblZonasComunesInventario}
                                                                        />
                                                                    </ListGroupItem>
                                                                </ListGroup>
                                                            </Card>
                                                        </Col>

                                                    }
                                                </Row>
                                            </CardBody>
                                        </Card>
                                        <Card style={{ display: 'none' }} className="mb-2">
                                            <CardBody>
                                                <Label ><strong>Reservar</strong></Label>
                                                <Form onSubmit={this.handleClickReservarZonaComun}>
                                                    <Row>
                                                        <Col lg={6} md={6} sm={6} xs={6} >
                                                            <Label for="fechaInicio">Fecha inicio</Label>
                                                            <FormGroup>

                                                                <Input
                                                                    type="date"
                                                                    name="fechaInicio"
                                                                    id="fechaInicio"
                                                                    placeholder="ingrese fecha"
                                                                    value={fechaInicio}
                                                                    onChange={this.handleChange}
                                                                    required
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col lg={6} md={6} sm={6} xs={6} >
                                                            <FormGroup>
                                                                <Label for="horaInicio">Hora Inicio</Label>
                                                                <Input
                                                                    type="time"
                                                                    name="horaInicio"
                                                                    id="horaInicio"
                                                                    placeholder="ingrese hora"
                                                                    value={horaInicio}
                                                                    onChange={this.handleChange}
                                                                    required
                                                                />
                                                            </FormGroup>

                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col lg={6} md={6} sm={6} xs={6} >
                                                            <Label for="fechaFin">Fecha fin</Label>
                                                            <FormGroup>

                                                                <Input
                                                                    type="date"
                                                                    name="fechaFin"
                                                                    id="fechaFin"
                                                                    placeholder="ingrese fecha"
                                                                    value={fechaFin}
                                                                    onChange={this.handleChange}
                                                                    required
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col lg={6} md={6} sm={6} xs={6} >
                                                            <FormGroup>
                                                                <Label for="horaFin">Hora fin</Label>
                                                                <Input
                                                                    type="time"
                                                                    name="horaFin"
                                                                    id="horaFin"
                                                                    placeholder="ingrese hora"
                                                                    value={horaFin}
                                                                    onChange={this.handleChange}
                                                                    required
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg={12} md={12} sm={12} xs={12} >
                                                            <FormGroup>
                                                                <Label for="nombreReserva">Dale un nombre a la reserva</Label>
                                                                <Input required
                                                                    onChange={this.handleChange}
                                                                    value={nombreReserva}
                                                                    id="nombreReserva"
                                                                    placeholder="Ingrese el nombre"
                                                                    type='text'
                                                                    autoComplete="off"
                                                                />

                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg={12} md={12} sm={12} xs={12} >
                                                            <CardTitle><strong>{confirmacionFecha}</strong></CardTitle>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg={12} md={12} sm={12} xs={12} >

                                                            <ButtonGroup>
                                                                <Button
                                                                    color={'info'}
                                                                    outline
                                                                >
                                                                    Reservar
                  </Button>
                                                            </ButtonGroup>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </CardBody>
                                        </Card>

                                        <Card>
                                            <Row>
                                                <Col md={12} sm={12} xs={12} >
                                                    <ListGroup flush>
                                                        <ListGroupItem>
                                                            <Label ><strong>Calendario reservas</strong></Label>
                                                            <EventCalendarZonasComunes
                                                                eventos={zonasComunes[0].tblReservasZonaComun}
                                                                zonaComun={zonasComunes[0].id}
                                                                notificacion={this.Notificacion}
                                                                borrarReserva={this.handleClickBorrarReserva.bind(this)}
                                                            />
                                                        </ListGroupItem>
                                                    </ListGroup>

                                                </Col>
                                            </Row>
                                        </Card>

                                    </ModalBody>
                                </Form>
                            </Fragment>
                        }
                    </Modal>
                }

            </Fragment>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        userAttributes: state.HorizontalProperties.userAttributes,
        propiedadesHorizontales: state.HorizontalProperties.propiedadesHorizontales,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setShowSpinner: (item) => dispatch(SetShowSpinner(item)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ZonasComunesModal);
