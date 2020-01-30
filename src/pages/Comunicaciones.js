import Page from 'components/Page';
import { IconWidget } from 'components/Widget';
import React, { Fragment } from 'react';
import { MdCall, MdRateReview, MdMarkunreadMailbox, MdError } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { Button, ButtonGroup, Card, CardBody, CardHeader, CardText, Col, Row } from 'reactstrap';
import { NOTIFICATION_SYSTEM_STYLE } from '../utils/constants';
import { Redirect } from 'react-router';
import {
    SetShowSpinner,
    SetPropiedadesHorizontales,
    SetPropiedadHorizontal
} from '../reducers/actions/HorizontalProperties';
import { UpdateBuzon, GetPropiedadesHorizantales, } from '../api/api';
import PqrsModal from '../components/Modals/PqrsModal';

const style = {
    cardBody: {
        maxHeight: '350px',
        height: '350px',
        overflowY: 'auto'
    },
    etiqueta: {
        textDecoration: 'none'
    },
    widget: {
        cursor: 'pointer'
    }
}

class Comunicaciones extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            showPqrsModal:false
        }
        this.handleClickApagarBuzon = this.handleClickApagarBuzon.bind(this);
    }

    componentWillMount() {
        const { propiedadHorizontal, userAttributes } = this.props;
        if (userAttributes.grupo !== undefined) {
            this.setState({ redirect: true });
        }
        if (Object.entries(propiedadHorizontal).length < 1) {
            this.setState({ redirect: true });
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

    handleClickApagarBuzon = (event) => {
        let buzon = [{
            "id": event.target.value,
            "tieneBuzon": 0,
            "descripcion": "",
            "idPropiedad": event.target.id
        }]

        UpdateBuzon(buzon, this.props.setShowSpinner).then(result => {
            const { userAttributes } = this.props;
            let userId = userAttributes["custom:custom:userid"];
            if (result.status == 200) {
                GetPropiedadesHorizantales(userId, this.props.setShowSpinner).then(result => {
                    if (result.status === 200) {
                        this.props.setPropiedadesHorizontales(result.data);
                        let propiedad = JSON.parse(localStorage.getItem("propiedadHorizontal"));
                        propiedad = propiedad.id;
                        let actualPropiedad = result.data.copropietario.tblCopropietarioPropiedadHorizontal.filter(ph => {
                            return ph.idPropiedadHorizontalNavigation.id == propiedad
                        })

                        localStorage.removeItem("propiedadesHorizontales");
                        localStorage.setItem("propiedadesHorizontales", JSON.stringify(result.data));
                        localStorage.removeItem("propiedadHorizontal");
                        localStorage.setItem("propiedadHorizontal", JSON.stringify(actualPropiedad[0].idPropiedadHorizontalNavigation));
                        this.props.setPropiedadHorizontal(JSON.parse(localStorage.getItem("propiedadHorizontal")));

                    } else {
                        this.Notificacion(result.data, <MdError />, 'error', 1000);
                    }
                });
            }
        })
    }

    handleClosePqrsModal = () => {
        this.setState({ showPqrsModal: false });
    }

    handleOpenPqrsModal = () => {
        this.setState({ showPqrsModal: true });
    }

    render() {
        const { propiedadHorizontal } = this.props;
        const { redirect,showPqrsModal} = this.state;
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
                    <Fragment>
                        <Col lg={4} md={4} sm={12} xs={12}>
                            <a style={style.etiqueta} href={`tel:${propiedadHorizontal.celularAdministrador}`}><IconWidget style={style.widget}
                                bgColor="primary"
                                inverse={true}
                                icon={MdCall}
                                title="Administrador"
                                subtitle='Llamar'
                            /></a>
                        </Col>

                        <Col lg={4} md={4} sm={12} xs={12}>
                            <a style={style.etiqueta} href={`tel:${propiedadHorizontal.celular}`}><IconWidget style={style.widget}
                                bgColor="primary"
                                inverse={true}
                                icon={MdCall}
                                title="Portería"
                                subtitle='Llamar'
                            /></a>
                        </Col>

                        <Col lg={4} md={4} sm={12} xs={12}>
                            <a style={style.etiqueta} ><IconWidget style={style.widget}
                                bgColor="primary"
                                inverse={true}
                                icon={MdRateReview}
                                title="PQR"
                                subtitle='Agregar'
                                onClick={this.handleOpenPqrsModal}
                            /></a>
                        </Col>
                    </Fragment>


                </Row>
                <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Card className="mb-1">
                            <CardHeader color='primary'><MdMarkunreadMailbox /> Buzon portería</CardHeader>
                            <CardBody>
                                <Row>
                                    {propiedadHorizontal.tblPropiedades.length > 0 &&
                                        propiedadHorizontal.tblPropiedades.map(propiedad => {
                                            return (
                                                <Fragment>
                                                    <Col lg={3} md={3} sm={6} xs={6}>
                                                        <CardText>{`${propiedad.tipoPropiedad} - ${propiedad.nomenclatura}`} </CardText>
                                                        <CardText className="text-muted">{propiedad.tblBuzon[0].descripcion} </CardText>
                                                    </Col>
                                                    <Col lg={3} md={3} sm={6} xs={6}>
                                                        <ButtonGroup>
                                                            <Button
                                                                color={propiedad.tblBuzon[0].tieneBuzon ? 'success' : 'danger'}
                                                                onClick={this.handleClickApagarBuzon}
                                                                disabled={!propiedad.tblBuzon[0].tieneBuzon}
                                                                value={propiedad.tblBuzon[0].id}
                                                                id={propiedad.id}
                                                            >
                                                                {propiedad.tblBuzon[0].tieneBuzon ? 'Apagar buzón' : 'Sin pendientes'}
                                                            </Button>
                                                        </ButtonGroup>
                                                    </Col>
                                                </Fragment>
                                            )
                                        })
                                    }
                                </Row>

                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                {showPqrsModal &&
                    <PqrsModal
                        open={showPqrsModal}
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
        userAttributes: state.HorizontalProperties.userAttributes,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setShowSpinner: (item) => dispatch(SetShowSpinner(item)),
    setPropiedadesHorizontales: (item) => dispatch(SetPropiedadesHorizontales(item)),
    setPropiedadHorizontal: (item) => dispatch(SetPropiedadHorizontal(item)),
})


export default connect(mapStateToProps, mapDispatchToProps)(Comunicaciones);
