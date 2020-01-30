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
import AdministrarInquilinos from '../AdministrarInquilinos';
import { ActualizarInquilino, CrearInquilino, GetInquilinos } from '../../api/api';
import { SignUp } from '../../cognito/amplifyMethods';
import ActualizarPerfilesModal from '../../components/Modals/ActualizarPerfilesModal';

const style = {
    cardBody: {
        maxHeight: '350px',
        height: '350px',
        overflowY: 'auto'
    }
}

class CrearCopropietariosModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inquilinos: [],
            nombre: '',
            documento: '',
            telefono: '',
            celular: '',
            email: '',
            botonActualizarDisable: true,
            inquilinosSeleccionada: '',
            propiedad: '',
            visibleModificar: false,
            botonCrearNuevo: false,
            showActualizarPerfilesModal: false
        }
        this.handleChangeFiltroPropiedad = this.handleChangeFiltroPropiedad.bind(this);
    }

    handleChangeFiltroPropiedad = async (event) => {
        const { propiedades } = this.props;
        let value = event.target.value;
        if (value == 'Seleccione...') {
            return;
        }
        value = value.split("#", 2);
        let idPropiedad = propiedades.filter(item => {
            return item.nomenclatura == value[1]
        })
        this.setState({ propiedad: idPropiedad[0], showActualizarPerfilesModal: true });
    }

    handleCloseActualizarPerfilesModal = () => {
        this.setState({ showActualizarPerfilesModal: false });
    }

    render() {
        const { open, closeModal, propiedades } = this.props;
        const { showActualizarPerfilesModal, propiedad } = this.state;

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
                    <ModalHeader toggle={closeModal}><strong>Administrar usuarios por propiedad</strong></ModalHeader>
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
                        </ModalBody>
                    </Form>
                </Modal>
                {showActualizarPerfilesModal &&
                    <ActualizarPerfilesModal
                        open={showActualizarPerfilesModal}
                        closeModal={() => this.handleCloseActualizarPerfilesModal()}
                        propiedad={propiedad} />
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(CrearCopropietariosModal);
