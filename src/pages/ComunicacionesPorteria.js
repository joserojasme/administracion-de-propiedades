import Page from 'components/Page';
import { IconWidget } from 'components/Widget';
import React, { Fragment } from 'react';
import { MdCall, MdRateReview, MdMarkunreadMailbox, MdError, MdPersonPin } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import {
    Button, ButtonGroup, Card, CardBody, CardHeader, CardText, Col, Row, CustomInput,
    Form, FormGroup, Input, Label
} from 'reactstrap';
import { NOTIFICATION_SYSTEM_STYLE } from '../utils/constants';
import { Redirect } from 'react-router';
import {
    SetShowSpinner,
    SetPropiedadesHorizontales,
    SetPropiedadHorizontal,
    SetBuzonInquilinos
} from '../reducers/actions/HorizontalProperties';
import { UpdateBuzon, GetPropiedadesHorizantales, GetBuzonInquilinosPortero } from '../api/api';
import TextBuzonModal from '../components/Modals/TextoBuzonModal';
import InquilinosModal from '../components/Modals/InquilinosModal';
import ComunicacionesApartamentos from '../components/ComunicacionesApartamentos';

const style = {
    cardBody: {
        maxHeight: '500px',
        height: '500px',
        overflowY: 'auto'
    },

}

class ComunicacionesPorteria extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            openTextoBuzonModal: false,
            openInquilinosModal: false,
            tieneBuzon: 0,
            idPropiedad: null,
            idBuzon: null,
            arrayPropiedades: [],
            arrayPropiedadesNoChange: [],
            defaultValueSelect: false,
            torres: [],
            inquilinos: {},
            isTodos: false,
            textoFiltro: ''
        }
        this.handleClickApagarBuzon = this.handleClickApagarBuzon.bind(this);
        this.handleClickEnviarTexto = this.handleClickEnviarTexto.bind(this);
        this.handleClickInquilino = this.handleClickInquilino.bind(this);
        this.handleCheckTodosBuzon = this.handleCheckTodosBuzon.bind(this);
    }

    componentWillMount() {
        const { userAttributes } = this.props;
        if (userAttributes.grupo === undefined) {
            this.setState({ redirect: true });
        }

        let userId = userAttributes["custom:custom:userid"];
        GetBuzonInquilinosPortero(userId, this.props.setShowSpinner).then(result => {
            if (result.status === 200) {
                let dataPropiedades = result.data.copropietario.tblCopropietarioPropiedadHorizontal[0].idPropiedadHorizontalNavigation.tblPropiedades;
                this.setState({ arrayPropiedadesNoChange: dataPropiedades, arrayPropiedades: dataPropiedades }, () => {
                    this.dataFiltroTorre(dataPropiedades).then(() => {
                        this.props.setBuzonInquilinos(result.data);
                    })
                })
            } else {
                this.Notificacion(result.data, <MdError />, 'error', 1000);
            }
        });
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
        let accion = event.target.checked;
        if (accion) {
            this.setState({ isTodos: false, defaultValueSelect: false, tieneBuzon: 1, idPropiedad: event.target.id, idBuzon: event.target.value, openTextoBuzonModal: true });
        } else {
            this.setState({ isTodos: false, defaultValueSelect: false, tieneBuzon: 0, idPropiedad: event.target.id, idBuzon: event.target.value }, () => {
                this.handleClickEnviarTexto('', false);
            });
        }
    }

    handleCheckTodosBuzon = () => {
        this.setState({ isTodos: true, openTextoBuzonModal: true }, () => { })
    }

    handleClickEnviarTextoTodos = (event) => {
        const { arrayPropiedadesNoChange } = this.state;
        let textoBuzon = event.target.value;
        this.setState({ openTextoBuzonModal: false });

        let arrayProps = arrayPropiedadesNoChange;
        let arrayBuzones = arrayProps.map(item => {
            return item.tblBuzon[0];
        })

        arrayBuzones.map(itemBuzon => {
            itemBuzon.descripcion = textoBuzon
            itemBuzon.tieneBuzon = 1
        })

        UpdateBuzon(arrayBuzones, this.props.setShowSpinner).then(result => {
            const { userAttributes } = this.props;
            let userId = userAttributes["custom:custom:userid"];
            if (result.status == 200) {
                GetBuzonInquilinosPortero(userId, this.props.setShowSpinner).then(result => {
                    if (result.status === 200) {
                        let dataPropiedades = result.data.copropietario.tblCopropietarioPropiedadHorizontal[0].idPropiedadHorizontalNavigation.tblPropiedades;
                        this.setState({ arrayPropiedadesNoChange: dataPropiedades, arrayPropiedades: dataPropiedades, defaultValueSelect: true }, () => {
                            this.dataFiltroTorre(dataPropiedades).then(() => {
                                this.props.setBuzonInquilinos(result.data);
                            })
                        })
                    } else {
                        this.Notificacion(result.data, <MdError />, 'error', 1000);
                    }
                });
            }
        })
    }

    handleClickEnviarTexto = (textoBuzon, sw = true) => {
        if (sw) {
            textoBuzon = textoBuzon.target.value;
            this.setState({ openTextoBuzonModal: false });
        }
        const { idPropiedad, idBuzon, tieneBuzon } = this.state;
        let buzon = [{
            "id": idBuzon,
            "tieneBuzon": tieneBuzon,
            "descripcion": textoBuzon,
            "idPropiedad": idPropiedad
        }]

        UpdateBuzon(buzon, this.props.setShowSpinner).then(result => {
            const { userAttributes } = this.props;
            let userId = userAttributes["custom:custom:userid"];
            if (result.status == 200) {
                GetBuzonInquilinosPortero(userId, this.props.setShowSpinner).then(result => {
                    if (result.status === 200) {
                        let dataPropiedades = result.data.copropietario.tblCopropietarioPropiedadHorizontal[0].idPropiedadHorizontalNavigation.tblPropiedades;
                        this.setState({ arrayPropiedadesNoChange: dataPropiedades, arrayPropiedades: dataPropiedades, defaultValueSelect: true }, () => {
                            this.dataFiltroTorre(dataPropiedades).then(() => {
                                this.props.setBuzonInquilinos(result.data);
                            })
                        })
                    } else {
                        this.Notificacion(result.data, <MdError />, 'error', 1000);
                    }
                });
            }
        })
    }

    handleCloseModal = () => {
        this.setState({ openTextoBuzonModal: false });
    }

    handleCloseInquilinosModal = () => {
        this.setState({ openInquilinosModal: false });
    }

    handleChangeFiltroTorre = (event) => {
        let value = event.target.value;
        let newPropiedadesArray = [];
        const { arrayPropiedadesNoChange } = this.state;

        if (value === 'Todas las torres') {
            this.setState({ arrayPropiedades: arrayPropiedadesNoChange, textoFiltro: '' });
            return;
        }

        newPropiedadesArray = arrayPropiedadesNoChange;
        newPropiedadesArray = newPropiedadesArray.filter(item => {
            if (item.torre == value) {
                return item
            }
        }
        );
        this.setState({ arrayPropiedades: newPropiedadesArray, textoFiltro: '' });
    }

    dataFiltroTorre = async (propiedades) => {
        let newTorres = [];
        await propiedades.map(propiedad => {
            if (newTorres.filter(e => e === propiedad.torre).length < 1) {
                newTorres.push(propiedad.torre);
            }
        })
        await this.setState({ torres: newTorres })
    }

    handleClickInquilino = (event) => {
        let inquilinos = [];
        let propietario = {};
        const { arrayPropiedadesNoChange } = this.state;
        const { buzonInquilinos } = this.props;

        inquilinos = arrayPropiedadesNoChange;
        inquilinos = inquilinos.filter(item => {
            if (item.id == event.target.id) {
                return item
            }
        });

        

        propietario = arrayPropiedadesNoChange.filter(item => {
            if (item.id == event.target.value) {
                return item
            }
        });
        this.setState({ inquilinos: { "inquilinos": inquilinos[0], "copropietario": propietario[0] }, openInquilinosModal: true })
    }

    handleChangeTextoFiltro = (event) => {
        let value = event.target.value;
        this.setState({ [event.target.id]: value, defaultValueSelect: true });
        let newPropiedadesArray = [];
        const { arrayPropiedadesNoChange } = this.state;

        if (value === '') {
            this.setState({ arrayPropiedades: arrayPropiedadesNoChange });
            return;
        }

        newPropiedadesArray = arrayPropiedadesNoChange;
        newPropiedadesArray = newPropiedadesArray.filter(item => {
            if (item.nomenclatura.indexOf(value) > -1) {
                return item
            }
        }
        );
        this.setState({ arrayPropiedades: newPropiedadesArray });
    }

    render() {
        const { buzonInquilinos } = this.props;
        const { redirect, openTextoBuzonModal, inquilinos,
            openInquilinosModal, arrayPropiedades,
            defaultValueSelect, torres, isTodos, textoFiltro } = this.state;
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
                <Row className='bg-gradient-theme-left mb-2 rounded '>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <Label for="exampleSelect" className="text-white mt-2" >Filtrar por torre</Label>
                        <Input type="select" name="select" onChange={this.handleChangeFiltroTorre}>
                            <option selected={defaultValueSelect ? "selected" : null} >Todas las torres</option>
                            {Object.entries(buzonInquilinos).length !== 0 &&
                                torres.length > 0 &&
                                torres.map(torre => {
                                    return (
                                        <Fragment>
                                            <option>{torre}</option>
                                        </Fragment>
                                    )
                                })
                            }
                        </Input>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <Label for="exampleSelect" className="text-white mt-2" >Filtrar por apartamento</Label>
                        <Input required id='textoFiltro'
                            onChange={this.handleChangeTextoFiltro}
                            value={textoFiltro}
                            placeholder="Ingrese # apartamento"
                            type='text'
                            autoComplete="off" />
                    </Col>
                </Row>
                <Row>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <Card className="mb-1">
                            <CardHeader color='primary'><MdMarkunreadMailbox /> Buzon apartamentos
                            <hr />
                                <Form>
                                    <FormGroup>
                                        <Row>
                                            <Col lg={6} md={6} sm={6} xs={6}>
                                                <Label for="exampleSelect" >Encender todos</Label>
                                                <ButtonGroup>
                                                    <Button
                                                        color="info"
                                                        outline
                                                        onClick={this.handleCheckTodosBuzon}
                                                    >
                                                        Encender
                  </Button>
                                                </ButtonGroup>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </Form>
                            </CardHeader>
                            <CardBody style={style.cardBody}>
                                <Row>
                                    {Object.entries(buzonInquilinos).length !== 0 &&
                                        arrayPropiedades.length > 0 &&
                                        arrayPropiedades.map(propiedad => {
                                            return (
                                                <Fragment>
                                                    <Col lg={6} md={6} sm={6} xs={6}>
                                                        <CardText>{`${propiedad.tipoPropiedad} - ${propiedad.nomenclatura}`} </CardText>
                                                        <CardText className="text-muted">{propiedad.tblBuzon[0].descripcion} </CardText>
                                                    </Col>
                                                    <Col lg={6} md={6} sm={6} xs={6}>
                                                        <ButtonGroup>
                                                            <CustomInput onChange={this.handleClickApagarBuzon} type="switch" id={propiedad.id} checked={propiedad.tblBuzon[0].tieneBuzon ? true : false} value={propiedad.tblBuzon[0].id} name={propiedad.tblBuzon[0].id} label={propiedad.tblBuzon[0].tieneBuzon ? 'Apagar buzón' : 'Encender buzón'} />
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
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <Card>
                            <CardHeader><MdCall /> Comunicaciones apartamento
                            </CardHeader>
                            <CardBody style={style.cardBody}>
                                {Object.entries(buzonInquilinos).length !== 0 &&
                                    <ComunicacionesApartamentos
                                        headers={[
                                            <MdPersonPin size={25} />,
                                            'Apto.',
                                            'Inquilino',
                                            'Celular'
                                        ]}
                                        usersData={arrayPropiedades}
                                        onClick={this.handleClickInquilino}
                                    />
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Fragment>
                        <Col lg={{ size: 4, offset: 4 }} md={{ size: 4, offset: 4 }} sm={12} xs={12}>
                            <a style={style.etiqueta} ><IconWidget style={style.widget}
                                bgColor="primary"
                                inverse={true}
                                icon={MdRateReview}
                                title="PQR"
                                subtitle='Agregar'
                            /></a>
                        </Col>
                    </Fragment>

                </Row>
                {openTextoBuzonModal &&
                    <TextBuzonModal open={openTextoBuzonModal} closeModal={() => this.handleCloseModal()} handleClickEnviarTexto={isTodos ? this.handleClickEnviarTextoTodos : this.handleClickEnviarTexto} />
                }

                {Object.entries(inquilinos).length !== 0 &&
                    openInquilinosModal &&
                    <InquilinosModal open={openInquilinosModal} inquilinos={inquilinos} closeModal={() => this.handleCloseInquilinosModal()} />
                }
            </Page>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        propiedadHorizontal: state.HorizontalProperties.propiedadHorizontal,
        userAttributes: state.HorizontalProperties.userAttributes,
        buzonInquilinos: state.HorizontalProperties.buzonInquilinos,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setShowSpinner: (item) => dispatch(SetShowSpinner(item)),
    setPropiedadesHorizontales: (item) => dispatch(SetPropiedadesHorizontales(item)),
    setPropiedadHorizontal: (item) => dispatch(SetPropiedadHorizontal(item)),
    setBuzonInquilinos: (item) => dispatch(SetBuzonInquilinos(item)),
})


export default connect(mapStateToProps, mapDispatchToProps)(ComunicacionesPorteria);
