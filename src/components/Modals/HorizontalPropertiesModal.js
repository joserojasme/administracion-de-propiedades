import React, { Fragment } from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    FormGroup,
    Form,
    Card,
    CardBody,
    CardImg,
    CardLink,
    CardText,
    CardTitle,
    Col,
    ListGroup,
    ListGroupItem,
    Row,
} from 'reactstrap';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import {
    MdImportantDevices,
    MdError,
    MdInfo
} from 'react-icons/md';
import { connect } from 'react-redux';
import { SetShowPropiedadesHorizontalesModal, SetPropiedadHorizontal, SetShowSpinner, SetReservas } from '../../reducers/actions/HorizontalProperties';
import PropertiesModal from './PropertiesModal';
import { AceptarTerminos, GetReserva } from '../../api/api';

class HorizontalPropertiesModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPropertiesModal: false,
            propertiesArray: [],
            horizontalPropertieNameModal: ''
        }
        this.handleClickShowProperties = this.handleClickShowProperties.bind(this);
        this.handleClickHideProperties = this.handleClickHideProperties.bind(this);
        this.handleClickSetPropiedadHorizontal = this.handleClickSetPropiedadHorizontal.bind(this);
    }

    handleClickShowProperties = (value, horizontalPropertieNameModal) => {
        if (value.length > 0) {
            this.setState({ propertiesArray: value, horizontalPropertieNameModal: horizontalPropertieNameModal, showPropertiesModal: true })
        } else {
            this.Notificacion('Sin propiedades en la unidad', <MdError />, 'error', 500)
        }
    }

    handleClickHideProperties = () => {
        this.setState({ propertiesArray: [], showPropertiesModal: false, horizontalPropertieNameModal: '' })
    }

    handleClickSetPropiedadHorizontal = (value) => {
        let idPropHorizontal = value.target.id;
        const { propiedadesHorizontales } = this.props;

        let result = propiedadesHorizontales.copropietario.tblCopropietarioPropiedadHorizontal.filter(ph => {
            return ph.idPropiedadHorizontal == idPropHorizontal;
        })

        this.props.setPropiedadHorizontal(result[0].idPropiedadHorizontalNavigation);
        localStorage.removeItem("propiedadHorizontal");
        localStorage.setItem("propiedadHorizontal", JSON.stringify(result[0].idPropiedadHorizontalNavigation));
        this.validarTerminosCondiciones(result[0].idPropiedadHorizontalNavigation);
        this.consultarReservas(result[0].idPropiedadHorizontalNavigation.id);
        this.props.setShowPropiedadesHorizontalesModal(false);
    }

    validarTerminosCondiciones = async (data) => {
        if (!data.aceptoTerminos) {
            const { userAttributes } = this.props;
            if (userAttributes.grupo !== undefined) {
                if (userAttributes.grupo[0] === "administradores") {
                    let body = {
                        "idPropiedadHorizontal": data.id,
                        "usuarioAceptoTerminos": userAttributes["custom:custom:userid"]
                    }
                    AceptarTerminos(body, this.props.setShowSpinner);
                }
            }
        }
    }

    consultarReservas = (idPropiedadHorizontal) =>{
        GetReserva(idPropiedadHorizontal, this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    this.props.setReservas(result.data);
                    localStorage.removeItem("reservas");
                    localStorage.setItem("reservas", JSON.stringify(result.data));
                    break;
                case 404:
                    this.Notificacion('No se encontraron eventos para el calendario', <MdInfo />, 'error', 1000);
                    break;
                default:
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

    render() {
        const { propiedadesHorizontalesModal, propiedadesHorizontales } = this.props;
        const { showPropertiesModal, propertiesArray, horizontalPropertieNameModal } = this.state;
        return (
            <Fragment>
                <Modal
                    isOpen={propiedadesHorizontalesModal}
                    className={this.props.className}
                    centered>
                    <ModalHeader>Tus propiedades horizontales</ModalHeader>
                    <Form >
                        <ModalBody>

                            {Object.entries(propiedadesHorizontales).length !== 0 &&
                                propiedadesHorizontales.copropietario.tblCopropietarioPropiedadHorizontal.map(
                                    propiedadHorizontal => (
                                        <Row key={propiedadHorizontal.idPropiedadHorizontalNavigation.id}>
                                            <Col md={12} sm={12} xs={12} className="mb-3">
                                                <Card>
                                                    <CardImg id={propiedadHorizontal.idPropiedadHorizontalNavigation.id} onClick={this.handleClickSetPropiedadHorizontal} top src={propiedadHorizontal.idPropiedadHorizontalNavigation.urlImagen} />
                                                    <CardBody>
                                                        <CardTitle><strong>{propiedadHorizontal.idPropiedadHorizontalNavigation.nombre}</strong></CardTitle>
                                                        <CardText>
                                                            {propiedadHorizontal.idPropiedadHorizontalNavigation.direccion}
                                                        </CardText>
                                                    </CardBody>
                                                    <ListGroup flush>
                                                        <ListGroupItem>
                                                            <strong>Teléfono portería:</strong>&nbsp;<a href={`tel:${propiedadHorizontal.idPropiedadHorizontalNavigation.telefono}`}>{propiedadHorizontal.idPropiedadHorizontalNavigation.telefono}</a>
                                                            <p><strong>Celular:</strong> &nbsp;<a href={`tel:${propiedadHorizontal.idPropiedadHorizontalNavigation.celular}`}>{propiedadHorizontal.idPropiedadHorizontalNavigation.celular}</a></p>
                                                        </ListGroupItem>

                                                    </ListGroup>
                                                    <ListGroup flush>
                                                        <ListGroupItem><strong>Administrador:</strong>&nbsp;{propiedadHorizontal.idPropiedadHorizontalNavigation.nombreAdministrador}
                                                            <p><strong>Teléfono:</strong> &nbsp;<a href={`tel:${propiedadHorizontal.idPropiedadHorizontalNavigation.celularAdministrador}`}>{propiedadHorizontal.idPropiedadHorizontalNavigation.celularAdministrador}</a></p></ListGroupItem>

                                                    </ListGroup>
                                                    <CardBody>
                                                        <Button color="info" outline className="mr-1" onClick={() => this.handleClickShowProperties(propiedadHorizontal.idPropiedadHorizontalNavigation.tblPropiedades, propiedadHorizontal.idPropiedadHorizontalNavigation.nombre)}>
                                                            Ver propiedades
                                                        </Button>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    )
                                )

                            }

                        </ModalBody>
                        <ModalFooter>
                            <FormGroup>

                            </FormGroup>

                        </ModalFooter>
                    </Form>
                </Modal>

                <PropertiesModal open={showPropertiesModal} horizontalPropertieNameModal={horizontalPropertieNameModal} propertiesArray={propertiesArray} onClick={this.handleClickHideProperties} />
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
        propiedadesHorizontalesModal: state.HorizontalProperties.propiedadesHorizontalesModal,
        propiedadesHorizontales: state.HorizontalProperties.propiedadesHorizontales,
        userAttributes: state.HorizontalProperties.userAttributes,
        reservas: state.HorizontalProperties.reservas
    }
}

const mapDispatchToProps = (dispatch) => ({
    setShowPropiedadesHorizontalesModal: (item) => dispatch(SetShowPropiedadesHorizontalesModal(item)),
    setShowSpinner: (item) => dispatch(SetShowSpinner(item)),
    setPropiedadHorizontal: (item) => dispatch(SetPropiedadHorizontal(item)),
    setReservas: (item) => dispatch(SetReservas(item)),
})


export default connect(mapStateToProps, mapDispatchToProps)(HorizontalPropertiesModal);
