import React, { Fragment } from 'react';
import { MdError, MdInfo } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { Form, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import { ActualizarPagos, GetPagos } from '../../api/api';
import { ConsultarEstadoTransaccion } from '../../api/apiClickingPay';
import { SetShowSpinner } from '../../reducers/actions/HorizontalProperties';
import PagosPendientesTabla from '../PagosPendientesTabla';


class ReportarPagoModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            facturas: [],
            consultado: false
        }
        this.handleClickValidarPago = this.handleClickValidarPago.bind(this);
    }

    ObtenerPagos = (propiedadId) => {
        GetPagos(propiedadId, this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    let pagos = result.data;
                    pagos.sort(function (a, b) {
                        return (a.fechaSolicitud - b.fechaSolicitud)
                    })
                    this.setState({
                        facturas: pagos,
                        consultado: true,
                    })
                    break;
                case 404:
                    this.setState({ consultado: true, facturas: [] })
                    this.Notificacion(result.data, <MdInfo />, 'error', 1000);
                    break;
                default:
                    this.setState({ consultado: true, facturas: [] })
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                    break;
            }
        })
    }

    handleClickValidarPago = (event) => {
        const idSolicitud = event.target.value;
        if (idSolicitud == null || idSolicitud == '') {
            this.Notificacion("Error obteniendo la solicitud", <MdError />, 'error', 500);
        } else {
            const { propiedadHorizontal,propiedadId } = this.props;
            ConsultarEstadoTransaccion(idSolicitud, this.props.setShowSpinner, propiedadHorizontal.tokenClickingPay).then(result => {
                let data = result.data;
                if (result.status == 200) {
                    let bodyActualizacion = {
                        "tblPagos": {
                            "idSolicitud": idSolicitud,
                            "estado": result.data.estado,
                            "urlImagenComprobante": ''
                        }
                    }
                    ActualizarPagos(bodyActualizacion, this.props.setShowSpinner).then(result => {
                        if (result.status == 200) {
                            this.Notificacion(`Pago actualizado: ${data.estado}`, <MdInfo />, 'success', 500);
                            this.ObtenerPagos(propiedadId);
                        } else {
                            if (result.status == 404) {
                                this.Notificacion("Pago ya se procesó o no existe", <MdError />, 'error', 500);
                            } else {
                                this.Notificacion('Error actualizando los pagos', <MdError />, 'error', 500);
                            }
                        }
                    })
                } else {
                    this.Notificacion('Error consultando el estado de la recarga', <MdError />, 'error', 1000);
                }
            })
        }
    }

    Notificacion = (message, icon, level) => {
        this.setState({ spinnerVisible: false, verificationCodeUser: '' }, () => {
            setTimeout(() => {
                if (!this.notificationSystem) {
                    return;
                }

                this.notificationSystem.addNotification({
                    title: icon,
                    message: message,
                    level: level,
                });
            }, 100);
        })
    }

    render() {
        const { open, closeModal, propiedadId } = this.props;
        const { facturas, consultado } = this.state;

        if (!consultado) {
            this.ObtenerPagos(propiedadId);
        }

        return (
            <Fragment>
                <Modal
                    size="xl"
                    isOpen={open}
                    toggle={closeModal}
                    className={this.props.className}
                    centered>
                    <ModalHeader toggle={closeModal}>Reportar pago hecho en línea</ModalHeader>
                    <Form >
                        <ModalBody>
                            Seleccione la solicitud de pago del listado a continuación. Nosotros confirmaremos si la solicitud fue aprobada y reportaremos el pago.
                        <hr />

                            <FormGroup>
                                {facturas.length > 0 &&
                                    <PagosPendientesTabla rows={facturas} onChangeValidarPago={this.handleClickValidarPago} />
                                }

                            </FormGroup>

                        </ModalBody>
                        <ModalFooter>


                        </ModalFooter>
                    </Form>
                </Modal>
                <NotificationSystem
                    dismissible={false}
                    ref={notificationSystem =>
                        (this.notificationSystem = notificationSystem)
                    }
                    style={NOTIFICATION_SYSTEM_STYLE}
                />
            </Fragment>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        propiedadHorizontal: state.HorizontalProperties.propiedadHorizontal,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setShowSpinner: (item) => dispatch(SetShowSpinner(item)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ReportarPagoModal);
