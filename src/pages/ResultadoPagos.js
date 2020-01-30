import Page from 'components/Page';
import { IconWidget } from 'components/Widget';
import React, { Fragment } from 'react';
import { MdCall, MdRateReview, MdMarkunreadMailbox, MdError, MdPets, MdPerson, MdSubway, MdInfo } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import {
    Button, ButtonGroup, Card, CardBody, CardHeader,
    CardText, Col, Row, CardImg, CardTitle,
    ListGroup, ListGroupItem, Form, FormGroup, Label, Input, FormText
} from 'reactstrap';
import { NOTIFICATION_SYSTEM_STYLE } from '../utils/constants';
import { Redirect } from 'react-router';
import {
    SetShowSpinner,
    SetPropiedadesHorizontales,
    SetPropiedadHorizontal
} from '../reducers/actions/HorizontalProperties';
import { ActualizarPagos } from '../api/api';
import { ConsultarEstadoTransaccion } from '../api/apiClickingPay';
import Avatar from '../components/Avatar';
import MascotasModal from '../components/Modals/MascotasModal';
import VehiculosModal from '../components/Modals/VehiculosModal';
import AdministrarInquilinosModal from '../components/Modals/AdministrarInquilinosModal';
import { numberFormat } from '../utils/utilsFunctions';

function ccyFormat(num) {
    num = parseFloat(num);
    let value = `${num.toFixed(2)}`;
    return numberFormat(value);
}

class ResultadoPagos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idSolicitud: '',
            redirect: false,
            valor: 0,
            estadoTransaccion: '',
        }
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

 componentDidMount() {
        const idSolicitud =  new URLSearchParams(window.location.search).get('idSolicitud');
        if (idSolicitud == null || idSolicitud == '') {
            this.setState({ redirect: true })
        } else {
            const { propiedadHorizontal } =  this.props;
            ConsultarEstadoTransaccion(idSolicitud, this.props.setShowSpinner, propiedadHorizontal.tokenClickingPay).then(result => {
                if (result.status == 200) {
                    let bodyActualizacion = {
                        "tblPagos": {
                            "idSolicitud": idSolicitud,
                            "estado": result.data.estado,
                            "urlImagenComprobante": ''
                        }
                    }
                    this.setState({ estadoTransaccion: result.data.estado, valor: result.data.valor }, () => {
                        ActualizarPagos(bodyActualizacion, this.props.setShowSpinner).then(result => {
                            if (result.status == 200) {
                                this.Notificacion('Pagos actualizadas', <MdInfo />, 'success', 500);
                            } else {
                                if (result.status == 404) {
                                    this.Notificacion("Pago ya se procesó o no existe", <MdError />, 'error', 500);
                                }else{
                                    this.Notificacion('Error actualizando los pagos', <MdError />, 'error', 500);
                                }
                            }
                        })
                    })

                } else {
                    this.Notificacion('Error consultando el estado de la recarga', <MdError />, 'error', 1000);
                }
            })
        }
    }

    render() {
        const { redirect, estadoTransaccion, valor } = this.state;
        if (redirect) return <Redirect to={{ pathname: '/app' }} />
        const { classes } = this.props;
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

                            <CardBody className="w-100">
                                <Row>
                                    <Col xl={12} lg={12} md={12} sm={12}>
                                        <Card>
                                            <CardHeader >RESULTADO DE LA TRANSACCIÓN</CardHeader>
                                            <CardBody>
                                                <Form>
                                                    <FormGroup row>
                                                        <Label sm={2} for="estadoTransaccion" >
                                                            Estado transacción
                  </Label>
                                                        <Col sm={10} >
                                                            <Input
                                                                autoFocus
                                                                id='estadoTransaccion'
                                                                type="text"
                                                                name='estadoTransaccion'
                                                                value={estadoTransaccion}
                                                                onChange={this.handleChange}
                                                                autocomplete="off"
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Label sm={2} for="valor" >
                                                            Valor
                  </Label>
                                                        <Col sm={10} >
                                                            <strong>{`$ ${ccyFormat(valor)}`}</strong>
                                                        </Col>
                                                    </FormGroup>


                                                </Form>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>

                            </CardBody>
                        </Card>
                    </Col>
                </Row>


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


export default connect(mapStateToProps, mapDispatchToProps)(ResultadoPagos);
