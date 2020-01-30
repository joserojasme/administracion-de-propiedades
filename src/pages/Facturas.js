import Page from 'components/Page';
import React, { Fragment } from 'react';
import { MdError, MdInfo } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { ActualizarPagos, GetFacturas, GuardarPago } from '../api/api';
import { IniciarTransaccionClickingPay } from '../api/apiClickingPay';
import FacturasTabla from '../components/FacturasTabla';
import { SetPropiedadesHorizontales, SetPropiedadHorizontal, SetShowSpinner } from '../reducers/actions/HorizontalProperties';
import { NOTIFICATION_SYSTEM_STYLE } from '../utils/constants';
import { handleKeyPressNumeros, nombreMes, numberFormat } from '../utils/utilsFunctions';
import ReportarPagoModal from '../components/Modals/ReportarPagoModal';
import PqrsModal from '../components/Modals/PqrsModal';

const style = {
    cardBody: {
        maxHeight: '120px',
        height: '120px',
        overflowY: 'auto'
    },
    etiqueta: {
        textDecoration: 'none',
        cursor: 'pointer'
    },
    widget: {
        cursor: 'pointer'
    }
}

function ccyFormat(num) {
    num = parseFloat(num);
    let value = `${num.toFixed(2)}`;
    return numberFormat(value);
}

const tipoPagoFacturas = "FACTURAS";
const tipoPagoSaldo = "SALDO";
const tipoPagoConSaldo = "PAGO_CON_SALDO";
const estadoSolicitud = "APROBADA";

class Factura extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            propiedad: '',
            propiedadId: '',
            facturas: [],
            estadoCuenta: 0,
            totalPagar: 0,
            facturasPagar: [],
            saldoFavor: {},
            pagoVoluntario: false,
            enviarSoporte: false,
            saldoValor: '',
            bodyClickingPay: {},
            openModalReportarPago: false,
            openModalPqrs: false
        }
        this.handleChangeFiltroPropiedad = this.handleChangeFiltroPropiedad.bind(this);
        this.handleClickPagar = this.handleClickPagar.bind(this);
    }

    componentWillMount() {
        const { userAttributes } = this.props;
        if (userAttributes.grupo !== undefined) {
            if (userAttributes.grupo[0] === "porteria" || userAttributes.grupo[0] === "administradores") {
                this.setState({ redirect: true });
            }
        }
    }

    handleChangeFiltroPropiedad = async (event) => {
        const { propiedadHorizontal } = this.props;
        let value = event.target.value;
        if (value == 'Seleccione...') {
            return;
        }
        value = value.split("#", 2);
        this.setState({ propiedad: value[1], totalPagar: 0, saldoValor: '' });
        let propiedad = await propiedadHorizontal.tblPropiedades.filter(item => {
            return item.nomenclatura == value[1];
        })
        this.setState({ propiedadId: propiedad[0].id });
        GetFacturas(propiedad[0].id, this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    let facturasSaldoFavor = result.data;
                    facturasSaldoFavor.facturas.sort(function (a, b) {
                        return (a.mes - b.mes)
                    })
                    this.setState({
                        facturas: facturasSaldoFavor.facturas,
                        estadoCuenta: propiedad[0].administracionAlDia,
                        saldoFavor: facturasSaldoFavor.saldoFavor
                    })
                    break;
                case 404:
                    this.setState({ propiedad: '', facturas: [] })
                    this.Notificacion('No se encontraron facturas', <MdInfo />, 'error', 1000);
                    break;
                default:
                    this.setState({ propiedad: '', facturas: [] })
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                    break;
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

    handleClickPagoVoluntario = () => {
        this.setState({
            pagoVoluntario: true,
            enviarSoporte: false,
        })
    }

    handleKeyPressNumeros = (event) => {
        if (!handleKeyPressNumeros(event)) {
            event.preventDefault();
        }
    }

    handleClickPagar = async (event) => {
        const { facturas, totalPagar, facturasPagar } = this.state;
        const checked = event.target.checked;
        this.setState({
            pagoVoluntario: false, saldoValor: '', enviarSoporte: false,
        })
        const value = event.target.value;
        let factura = await facturas.filter(item => {
            return item.id == value;
        })

        let newValueTotalPagar = totalPagar;
        let newFacturasPagar = facturasPagar;

        if (checked) {
            newValueTotalPagar += await factura[0].valorTotal;
            newFacturasPagar.push({ "idFactura": factura[0].id, "valorPagado": factura[0].valorTotal })
        } else {
            newValueTotalPagar -= await factura[0].valorTotal;
            newFacturasPagar = await facturasPagar.filter(item => {
                return item.idFactura != value;
            })
        }
        this.setState({ totalPagar: newValueTotalPagar, facturasPagar: newFacturasPagar })
    }

    handleChange = (event) => {
        let value = event.target.value;
        this.setState({ [event.target.id]: value });
    }

    handleClickBotonPagar = (event) => {
        const { totalPagar, saldoFavor } = this.state;
        if (event.target.value === tipoPagoFacturas) {
            if (totalPagar <= 0) {
                this.Notificacion('El valor debe ser mayor a cero', <MdError />, 'error', 1000);
                return;
            }
            if (saldoFavor.valorSaldo >= totalPagar) {
                this.RegistrarPagoConSaldoFavor(totalPagar);
            } else {
                this.BodyClickingPay(totalPagar, tipoPagoFacturas);
            }
        }
    }

    handleClickBotonPagarSaldo = (event) => {
        const { saldoValor } = this.state;
        if (event.target.value === tipoPagoSaldo) {
            if (saldoValor <= 0) {
                this.Notificacion('El valor debe ser mayor a cero', <MdError />, 'error', 1000);
                return;
            }
            this.BodyClickingPay(saldoValor, tipoPagoSaldo);
        }
    }

    BodyClickingPay = async (totalPagar, tipoPago) => {
        const { propiedadesHorizontales, propiedadHorizontal } = this.props;
        const { facturasPagar, propiedadId } = this.state;
        this.setState({
            bodyClickingPay: {
                "cdConsecutivo": Math.floor(Date.now()),
                "valor": totalPagar,
                "usuario": {
                    "dsNombres": `${propiedadesHorizontales.copropietario.nombre}`,
                    "dsDireccion": propiedadHorizontal.direccion,
                    "dsTelefono": propiedadesHorizontales.copropietario.celular,
                    "dsEmail": propiedadesHorizontales.copropietario.email,
                    "cdTipoDocumento": {
                        "tipoDocumentoSiglas": propiedadesHorizontales.copropietario.tipoIdentificacion
                    },
                    "dsIdentificacion": propiedadesHorizontales.copropietario.identificacion
                }
            }
        }, () => {
            IniciarTransaccionClickingPay(this.state.bodyClickingPay, this.props.setShowSpinner, propiedadHorizontal.tokenClickingPay).then(result => {
                if (result.status != 200) {
                    this.Notificacion('Error redireccionando a la pasarela de pago', <MdError />, 'error', 1000);
                } else {
                    let bodyGuardarPago = {
                        "tblPagos": {
                            "idSolicitud": `${result.data.codigoConsulta}`,
                            "valorPagado": `${totalPagar}`,
                            "tipoPago": `${tipoPago}`,
                            "idPropiedad": `${propiedadId}`
                        },
                        "FacturasPago": facturasPagar
                    }
                    this.RegistrarPago(bodyGuardarPago, result.data.urlToRedirect);
                }
            })
        })
    }

    RegistrarPago = (body, urlToRedirect) => {
        GuardarPago(body, this.props.setShowSpinner).then(result => {
            if (result.status == 200) {
                window.location.href = urlToRedirect;
            } else {
                this.Notificacion('Error guardando la solicitud de la pasarela de pagos', <MdError />, 'error', 1000);
            }
        });
    }

    RegistrarPagoConSaldoFavor = (totalPagar) => {
        const { facturasPagar, propiedadId } = this.state;
        let idSolicitud = Math.floor(Date.now());
        let bodyGuardarPago = {
            "tblPagos": {
                "idSolicitud": idSolicitud,
                "valorPagado": `${totalPagar}`,
                "tipoPago": `${tipoPagoConSaldo}`,
                "idPropiedad": `${propiedadId}`
            },
            "FacturasPago": facturasPagar
        }

        GuardarPago(bodyGuardarPago, this.props.setShowSpinner).then(result => {
            if (result.status == 200) {
                this.ActualizarPagoConSaldo(idSolicitud, propiedadId);
            } else {
                this.Notificacion('Error guardando la solicitud de pago', <MdError />, 'error', 1000);
            }
        });
    }

    ActualizarPagoConSaldo = (idSolicitud, propiedadId) => {
        let bodyActualizacion = {
            "tblPagos": {
                "idSolicitud": idSolicitud,
                "estado": estadoSolicitud,
                "urlImagenComprobante": ''
            }
        }

        ActualizarPagos(bodyActualizacion, this.props.setShowSpinner).then(result => {
            if (result.status == 200) {
                this.Notificacion('Pagos actualizadas', <MdInfo />, 'success', 500);
                this.obtenerFacturas();
            } else {
                if (result.status == 404) {
                    this.Notificacion("Pago ya se procesó, no existe o no tiene saldo", <MdError />, 'error', 500);
                    this.obtenerFacturas();
                } else {
                    this.Notificacion('Error actualizando los pagos', <MdError />, 'error', 500);
                }
            }
        })
    }

    obtenerFacturas = () =>{
        const {propiedadId} = this.state;
        this.setState({
            facturas: [],
        },()=>{
            GetFacturas(propiedadId, this.props.setShowSpinner).then(result => {
                switch (result.status) {
                    case 200:
                        let facturasSaldoFavor = result.data;
                        facturasSaldoFavor.facturas.sort(function (a, b) {
                            return (a.mes - b.mes)
                        })
                        this.setState({
                            facturas: facturasSaldoFavor.facturas,
                            saldoFavor: facturasSaldoFavor.saldoFavor,
                            totalPagar: 0,
                            facturasPagar:[]
                        })
                        break;
                    default:
                        this.setState({ propiedad: '', facturas: [] })
                        break;
                }
            })
        })
        
    }
    handleCloseModal = () => {
        this.setState({ openModalReportarPago: false })
        this.obtenerFacturas();
    }

    handleClosePqrsModal = () => {
        this.setState({ openModalPqrs: false });
    }

    handleClickReportarPagoModal = () => {
        this.setState({ openModalReportarPago: true })
    }

    handleClickPqrsModal = () => {
        this.setState({ openModalPqrs: true })
    }

    render() {
        const { redirect, facturas, estadoCuenta, totalPagar, saldoFavor, pagoVoluntario,
            saldoValor, openModalReportarPago, propiedadId, openModalPqrs } = this.state;
        const { propiedadHorizontal } = this.props;
        var fecha = new Date();
        var year = fecha.getFullYear();
        var mes = fecha.getMonth() + 1;
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
                    <Col className="bg-gradient-theme-left rounded  mb-3" lg={6} md={6} sm={12} xs={12}>
                        <Label for="exampleSelect" className="text-white mb-3" >Seleccione una propiedad</Label>
                        <Input className="mb-3" type="select" name="select" onChange={this.handleChangeFiltroPropiedad}>
                            <option selected={true}>Seleccione...</option>
                            {Object.entries(propiedadHorizontal.tblPropiedades).length !== 0 &&
                                propiedadHorizontal.tblPropiedades.map(propiedad => {
                                    return (
                                        <Fragment>
                                            <option>{`${propiedad.tipoPropiedad} #${propiedad.nomenclatura}`}</option>
                                        </Fragment>
                                    )
                                })
                            }
                        </Input>
                    </Col>
                    <Col lg="3" md="3" sm="12" xs="12"><strong>Total a pagar:&nbsp;&nbsp; </strong>$ {ccyFormat(totalPagar)}</Col>
                    <Col lg="3" md="3" sm="12" xs="12">
                        <Button color="info" value={tipoPagoFacturas} onClick={this.handleClickBotonPagar} outline>
                            Pagar $ {ccyFormat(totalPagar)}
                        </Button>
                    </Col>
                </Row>
                {facturas.length > 0 &&
                    <Fragment>
                        <Row>
                            <Col lg="6" md="6" sm="12" xs="12">
                                <Card>
                                    <CardHeader>Estado de cuenta</CardHeader>
                                    <CardBody style={style.cardBody}>
                                        <CardTitle><strong> Año y mes actual:&nbsp;&nbsp; </strong>{year} - {nombreMes(mes)}</CardTitle>
                                        <CardTitle><strong> Estado:&nbsp;&nbsp; </strong>{estadoCuenta ?
                                            <Badge color="success" className="mr-1" >Al día</Badge>
                                            :
                                            <Badge color="danger" className="mr-1" >Pago pendiente</Badge>
                                        }</CardTitle>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg="6" md="6" sm="12" xs="12">
                                <Card>
                                    <CardHeader><strong> Saldo a favor:&nbsp;&nbsp; </strong> $ {ccyFormat(saldoFavor.valorSaldo)}</CardHeader>
                                    <CardBody style={style.cardBody}>
                                    {pagoVoluntario &&
                                            <Fragment>
                                                <Row>
                                                    <Col lg="12" md="12" sm="12" xs="12">
                                                        <FormGroup row>
                                                            <Col sm={6} for="saldoValor" >
                                                                <Input
                                                                    id='saldoValor'
                                                                    type="text"
                                                                    onKeyPress={this.handleKeyPressNumeros}
                                                                    name='saldoValor'
                                                                    placeholder="Ingrese el valor"
                                                                    value={saldoValor}
                                                                    onChange={this.handleChange}
                                                                    autocomplete="off"
                                                                />
                                                            </Col>
                                                            <Col sm={6} >
                                                                <Button color="info" value={tipoPagoSaldo} onClick={this.handleClickBotonPagarSaldo} outline>
                                                                    Pagar $ {saldoValor == '' ? 0 : ccyFormat(saldoValor)}
                                                                </Button>
                                                            </Col>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </Fragment>
                                        }
                                        <Row>
                                            <Col lg="4" md="4" sm="12" xs="12"><a onClick={this.handleClickPagoVoluntario} style={style.etiqueta}>Hacer pago voluntario</a></Col>
                                            <Col lg="4" md="4" sm="12" xs="12"><a onClick={this.handleClickReportarPagoModal} style={style.etiqueta}>
                                                Reportar pago en línea
                                            </a></Col>
                                            <Col lg="4" md="4" sm="12" xs="12"><a onClick={this.handleClickPqrsModal} style={style.etiqueta}>
                                                Reportar pago por otro medio
                                            </a></Col>
                                        </Row>

                                        
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                    </Fragment>
                }



                {facturas.length > 0 &&
                    <FacturasTabla rows={facturas} onChangePagarTodo={this.handleClickPagar} />
                }
                
                {openModalReportarPago &&
                <ReportarPagoModal open={openModalReportarPago} closeModal={() => this.handleCloseModal()} propiedadId={propiedadId} />
                }

                {openModalPqrs &&
                <PqrsModal
                    open={openModalPqrs}
                    closeModal={() => this.handleClosePqrsModal()}
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

export default connect(mapStateToProps, mapDispatchToProps)(Factura);
