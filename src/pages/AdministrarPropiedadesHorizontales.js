import Page from 'components/Page';
import React, { Fragment } from 'react';
import { Storage } from 'aws-amplify';
import { MdError, MdInfo } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Label, Row, FormText } from 'reactstrap';
import { GetPropiedadHorizantal, ActualizarPropiedadHorizantal } from '../api/api';
import Avatar from '../components/Avatar';
import { SetPropiedadesHorizontales, SetPropiedadHorizontal, SetShowSpinner } from '../reducers/actions/HorizontalProperties';
import { NOTIFICATION_SYSTEM_STYLE } from '../utils/constants';
import { handleKeyPressTexto, HandleKeyPressTextoNumeros, handleKeyPressNumeros } from '../utils/utilsFunctions';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const urlImagenPdf = 'https://s3.us-east-2.amazonaws.com/miinc.com.co/public/pdf.png';
const urlImagenGenerica = 'https://www.colmenaseguros.com/imagenesColmenaARP/contenido/banner-noticias.jpg';
const urlBucket = 'https://s3.us-east-2.amazonaws.com/miinc.com.co/public/';
const initialState = {
    redirect: false,
    fileUrl: '',
    textoSubidaArchivo: 'Escoger archivo',
    fileName: '',
    id: '',
    identificacion: '',
    nombre: '',
    direccion: '',
    telefono: '',
    celular: '',
    urlImagen: '',
    identificacionAdministrador: '',
    nombreAdministrador: '',
    celularAdministrador: '',
    tokenClickingPay: '',
    tipoPropiedadHorizontal: 'Edificio de vivienda',
    nombreEmpresaAdministracion: '',
    identificacionEmpresaAdministracion: '',
    nombreRepresentanteLegalEmpresa: '',
    cargoRepresentanteLegalEmpresa: '',
    correoRepresentanteLegalEmpresa: '',
    telefonoRepresentanteLegalEmpresa: '',
    fechaRegistro: null,
    fechaCambioAdministrador: null,
    aceptoTerminos: null,
    usuarioAceptoTerminos: null,
    fechaAceptaTerminos: null,
    botonSubirDisable: true,
    propiedadHorizontal: {}

}

const styles = {
    tab: {
        marginBottom: '20px'
    },
    heading: {
        fontSize: '15px',
        flexBasis: '33.33%',
        flexShrink: 0,
        fontWeight: 'bold'
    },
    secondaryHeading: {
        fontSize: '13px',
        color: '#111',
    },
}

class AdministrarPropiedadesHorizontales extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        }
    }

    handleChange = (event) => {
        let value = event.target.value;
        this.setState({ [event.target.id]: value })
    }

    componentWillMount() {
        const { userAttributes, propiedadHorizontal } = this.props;
        if (userAttributes.grupo !== undefined) {
            if (userAttributes.grupo[0] === "porteria") {
                this.setState({ redirect: true });
            } else {
                GetPropiedadHorizantal(propiedadHorizontal.id, this.props.setShowSpinner).then(result => {
                    switch (result.status) {
                        case 200:
                            this.setState({ ...result.data, })
                            break;
                        case 404:
                            this.setState({ propiedadHorizontal: {} })
                            this.Notificacion('No se encontró la propiedad horizontal', <MdInfo />, 'error', 1000);
                            break;
                        default:
                            this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                            break;
                    }
                })
            }
        } else {
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

    handleChangeImage = (event) => {
        const file = event.target.files[0];
        if (file == undefined) return;
        if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/jpg') {
            let fileUrl = URL.createObjectURL(file);
            if (file.type == 'application/pdf') {
                fileUrl = urlImagenPdf;
            }
            this.setState({
                fileUrl: fileUrl,
                file,
                fileName: file.name,
                textoSubidaArchivo: 'Archivo sin subir',
                botonSubirDisable: false,
                urlImagen: ''
            })
        } else {
            this.setState({
                botonSubirDisable: true,
                textoSubidaArchivo: 'Tipo no permitido',
                fileUrl: urlImagenGenerica,
                file: '',
                fileName: '',
                urlImagen: ''
            })
            return;
        }
    }

    saveFile = () => {
        let fecha = Math.floor(Date.now() / 1000);
        Storage.put(`${fecha}${this.state.fileName}`, this.state.file).then((result) => {
            this.Notificacion('Se cargó el archivo correctamente', <MdInfo />, 'success', 1000);
            this.setState({
                urlImagen: `${urlBucket}${result.key}`,
                botonSubirDisable: true,
                textoSubidaArchivo: 'Archivo subido'
            })
        }).catch(err => {
            this.Notificacion('Error al cargar el archivo', <MdInfo />, 'success', 1000);
        })
    }

    HandleKeyPressTextoNumeros = (event) => {
        if (!HandleKeyPressTextoNumeros(event)) {
            event.preventDefault();
        }
    }

    handleKeyPressTexto = (event) => {
        if (!handleKeyPressTexto(event)) {
            event.preventDefault();
        }
    }

    handleKeyPressNumeros = (event) => {
        if (!handleKeyPressNumeros(event)) {
            event.preventDefault();
        }
    }

    handleClickActualizar = (event) => {
        event.preventDefault();
        const { botonSubirDisable } = this.state;
        if (!botonSubirDisable) {
            this.Notificacion('Primero debe subir la imagen', <MdInfo />, 'error', 1000);
            return;
        }

        ActualizarPropiedadHorizantal(this.state, this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    this.Notificacion('Propiedad horizontal actualizada', <MdInfo />, 'success', 1000);
                    break;
                case 404:
                    this.Notificacion('No se encontró la propiedad horizontal', <MdInfo />, 'error', 1000);
                    break;
                default:
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                    break;
            }
        })
    }

    handleChangeTipoCopropiedad = (event) => {
        let value = event.target.value;
        this.setState({tipoPropiedadHorizontal: value})
    }

    render() {
        const { identificacion,
            nombre,
            direccion,
            telefono,
            celular,
            urlImagen,
            identificacionAdministrador,
            nombreAdministrador,
            celularAdministrador,
            tokenClickingPay,
            botonSubirDisable, textoSubidaArchivo,
            nombreEmpresaAdministracion,
            identificacionEmpresaAdministracion,
            nombreRepresentanteLegalEmpresa,
            cargoRepresentanteLegalEmpresa,
            correoRepresentanteLegalEmpresa,
            telefonoRepresentanteLegalEmpresa, } = this.state;
        const { redirect } = this.state;
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
                    <Col md={12} sm={12} xs={12} lg={12} >
                        <Card className="d-flex justify-content-center align-items-center flex-column">
                            <Avatar
                                size={150}
                                className="mt-1"
                                src={urlImagen}
                            />
                            <CardBody className="w-100">
                                <Row>
                                    <Col xl={12} lg={12} md={12} sm={12}>
                                        <Card>
                                            <CardHeader >INFORMACIÓN COPROPIEDAD</CardHeader>
                                            <CardBody>
                                                <Form onSubmit={this.handleClickActualizar}>
                                                    <Row>
                                                        <Col xl={4} lg={4} md={12} sm={12}>
                                                        <FormGroup row>
                                                        <Label sm={4} for="identificacion" >Tipo:</Label>
                                                        <Col sm={8} >
                                                            <Input type="select" name="select" onChange={this.handleChangeTipoCopropiedad}>
                                                                {
                                                                    tipoPropiedadHorizontal.length > 0 &&
                                                                    tipoPropiedadHorizontal.map(tipo => {
                                                                        return (
                                                                            <Fragment>
                                                                                <option>{tipo}</option>
                                                                            </Fragment>
                                                                        )
                                                                    })
                                                                }
                                                            </Input>
                                                            </Col>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col xl={4} lg={4} md={12} sm={12}>
                                                            <FormGroup row>
                                                                <Label sm={4} for="nombre" >Nombre *</Label>
                                                                <Col sm={8} >
                                                                    <Input
                                                                        required
                                                                        id='nombre'
                                                                        type="text"
                                                                        name='nombre'
                                                                        value={nombre}
                                                                        placeholder="Nombre de la copropiedad"
                                                                        onChange={this.handleChange}
                                                                        autocomplete="off"
                                                                        onKeyPress={this.HandleKeyPressTextoNumeros}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col xl={4} lg={4} md={12} sm={12}>
                                                            <FormGroup row>
                                                                <Label sm={5} for="identificacion" ># Identificación *</Label>
                                                                <Col sm={7} >
                                                                    <Input
                                                                        required
                                                                        autoFocus
                                                                        id='identificacion'
                                                                        type="text"
                                                                        maxLength={20}
                                                                        name='identificacion'
                                                                        value={identificacion}
                                                                        placeholder="Número de identificación"
                                                                        onChange={this.handleChange}
                                                                        autocomplete="off"
                                                                        onKeyPress={this.HandleKeyPressTextoNumeros}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                        
                                                    </Row>

                                                    <Row>
                                                        <Col xl={6} lg={6} md={12} sm={12}>
                                                            <FormGroup row>
                                                                <Label sm={4} for="direccion" >Dirección *</Label>
                                                                <Col sm={8} >
                                                                    <Input
                                                                        required
                                                                        id='direccion'
                                                                        type="textarea"
                                                                        name='direccion'
                                                                        value={direccion}
                                                                        placeholder="Dirección de la copropiedad"
                                                                        onChange={this.handleChange}
                                                                        autocomplete="off"
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col xl={6} lg={6} md={12} sm={12}>
                                                            <FormGroup row>
                                                                <Label sm={4} for="telefono" >Teléfono unidad *</Label>
                                                                <Col sm={8} >
                                                                    <Input
                                                                        required
                                                                        id='telefono'
                                                                        type="text"
                                                                        name='telefono'
                                                                        value={telefono}
                                                                        placeholder="Teléfono de la copropiedad"
                                                                        onChange={this.handleChange}
                                                                        autocomplete="off"
                                                                        onKeyPress={this.HandleKeyPressTextoNumeros}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xl={6} lg={6} md={12} sm={12}>
                                                            <FormGroup row>
                                                                <Label sm={4} for="celular" >Celular</Label>
                                                                <Col sm={8} >
                                                                    <Input
                                                                        autoFocus
                                                                        id='celular'
                                                                        type="text"
                                                                        name='celular'
                                                                        value={celular}
                                                                        placeholder="Celular de la copropiedad"
                                                                        onChange={this.handleChange}
                                                                        autocomplete="off"
                                                                        onKeyPress={this.handleKeyPressNumeros}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col xl={6} lg={6} md={12} sm={12}>
                                                            <FormGroup row>
                                                                <Label sm={4} for="identificacionAdministrador" ># Identificación Administrador *</Label>
                                                                <Col sm={8} >
                                                                    <Input
                                                                        required
                                                                        autoFocus
                                                                        id='identificacionAdministrador'
                                                                        type="text"
                                                                        maxLength={20}
                                                                        name='identificacionAdministrador'
                                                                        value={identificacionAdministrador}
                                                                        placeholder="Ingrese la identificación "
                                                                        onChange={this.handleChange}
                                                                        autocomplete="off"
                                                                        onKeyPress={this.HandleKeyPressTextoNumeros}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xl={6} lg={6} md={12} sm={12}>
                                                            <FormGroup row>
                                                                <Label sm={4} for="nombreAdministrador" >Nombre administrador *</Label>
                                                                <Col sm={8} >
                                                                    <Input
                                                                        required
                                                                        id='nombreAdministrador'
                                                                        type="text"
                                                                        name='nombreAdministrador'
                                                                        value={nombreAdministrador}
                                                                        placeholder="Nombre del administrador"
                                                                        onChange={this.handleChange}
                                                                        autocomplete="off"
                                                                        onKeyPress={this.handleKeyPressTexto}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col xl={6} lg={6} md={12} sm={12}>
                                                            <FormGroup row>
                                                                <Label sm={4} for="celularAdministrador" >Celular administrador *</Label>
                                                                <Col sm={8} >
                                                                    <Input
                                                                        required
                                                                        id='celularAdministrador'
                                                                        type="text"
                                                                        maxLength={20}
                                                                        name='celularAdministrador'
                                                                        value={celularAdministrador}
                                                                        placeholder="Celular administrador"
                                                                        onChange={this.handleChange}
                                                                        autocomplete="off"
                                                                        onKeyPress={this.handleKeyPressNumeros}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xl={6} lg={6} md={12} sm={12}>
                                                            <FormGroup row>
                                                                <Label sm={5} for="urlImagen">Imagen copropiedad</Label>
                                                                <Col sm={7} >
                                                                    <div className="input-group">
                                                                        <div className="input-group-prepend">
                                                                            <Button disabled={botonSubirDisable} color="info" onClick={this.saveFile} outline={textoSubidaArchivo == 'Archivo sin subir' ? false : true}>
                                                                                Subir
                                                        </Button>
                                                                        </div>
                                                                        <div className="custom-file">
                                                                            <input accept="application/image/*" type="file" className="custom-file-input" id="urlImagen"
                                                                                onChange={this.handleChangeImage} />
                                                                            <label class="custom-file-label" for="inputGroupFile01">{textoSubidaArchivo}</label>
                                                                        </div>
                                                                    </div>
                                                                    <FormText color="muted">Sólo está permitido archivos de imagen</FormText>
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col xl={6} lg={6} md={12} sm={12}>
                                                            <FormGroup row>
                                                                <Label sm={4} for="tokenClickingPay" >Token Clicking Pay </Label>
                                                                <Col sm={8} >
                                                                    <Input
                                                                        id='tokenClickingPay'
                                                                        type="textarea"
                                                                        name='tokenClickingPay'
                                                                        value={tokenClickingPay}
                                                                        placeholder="Ingrese el token"
                                                                        onChange={this.handleChange}
                                                                        autocomplete="off"
                                                                        onKeyPress={this.HandleKeyPressTextoNumeros}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xl={12} lg={12} md={12} sm={12}>
                                                            <ExpansionPanel style={styles.tab}>
                                                                <ExpansionPanelSummary
                                                                    expandIcon={<ExpandMoreIcon />}
                                                                    aria-controls="panel1bh-content"
                                                                    id="panel1bh-header"
                                                                >
                                                                    <Typography style={styles.heading}>Si la unidad es administrada por una empresa</Typography>
                                                                    <Typography style={styles.secondaryHeading}>Llene la siguiente información</Typography>
                                                                </ExpansionPanelSummary>
                                                                <ExpansionPanelDetails >
                                                                    <div>
                                                                        <Row>
                                                                            <Col xl={6} lg={6} md={12} sm={12}>
                                                                                <FormGroup row>
                                                                                    <Label sm={4} for="nombreEmpresaAdministracion" >Nombre empresa administración</Label>
                                                                                    <Col sm={8} >
                                                                                        <Input
                                                                                            id='nombreEmpresaAdministracion'
                                                                                            type="text"
                                                                                            name='nombreEmpresaAdministracion'
                                                                                            value={nombreEmpresaAdministracion}
                                                                                            placeholder="Ingrese el nombre"
                                                                                            onChange={this.handleChange}
                                                                                            autocomplete="off"
                                                                                            onKeyPress={this.HandleKeyPressTextoNumeros}
                                                                                        />
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </Col>
                                                                            <Col xl={6} lg={6} md={12} sm={12}>
                                                                                <FormGroup row>
                                                                                    <Label sm={4} for="identificacionEmpresaAdministracion" >Identificación empresa administración</Label>
                                                                                    <Col sm={8} >
                                                                                        <Input
                                                                                            id='identificacionEmpresaAdministracion'
                                                                                            type="text"
                                                                                            maxLength={20}
                                                                                            name='identificacionEmpresaAdministracion'
                                                                                            value={identificacionEmpresaAdministracion}
                                                                                            placeholder="Identificación empresa administración"
                                                                                            onChange={this.handleChange}
                                                                                            autocomplete="off"
                                                                                            onKeyPress={this.HandleKeyPressTextoNumeros}
                                                                                        />
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col xl={6} lg={6} md={12} sm={12}>
                                                                                <FormGroup row>
                                                                                    <Label sm={4} for="nombreRepresentanteLegalEmpresa" >Nombre representante legal empresa</Label>
                                                                                    <Col sm={8} >
                                                                                        <Input
                                                                                            id='nombreRepresentanteLegalEmpresa'
                                                                                            type="text"
                                                                                            name='nombreRepresentanteLegalEmpresa'
                                                                                            value={nombreRepresentanteLegalEmpresa}
                                                                                            placeholder="Nombre representante legal empresa"
                                                                                            onChange={this.handleChange}
                                                                                            autocomplete="off"
                                                                                            onKeyPress={this.HandleKeyPressTextoNumeros}
                                                                                        />
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </Col>
                                                                            <Col xl={6} lg={6} md={12} sm={12}>
                                                                                <FormGroup row>
                                                                                    <Label sm={4} for="cargoRepresentanteLegalEmpresa" >Cargo representante legal empresa</Label>
                                                                                    <Col sm={8} >
                                                                                        <Input
                                                                                            id='cargoRepresentanteLegalEmpresa'
                                                                                            type="text"
                                                                                            name='cargoRepresentanteLegalEmpresa'
                                                                                            value={cargoRepresentanteLegalEmpresa}
                                                                                            placeholder="Cargo representante legal empresa"
                                                                                            onChange={this.handleChange}
                                                                                            autocomplete="off"
                                                                                            onKeyPress={this.HandleKeyPressTextoNumeros}
                                                                                        />
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col xl={6} lg={6} md={12} sm={12}>
                                                                                <FormGroup row>
                                                                                    <Label sm={4} for="correoRepresentanteLegalEmpresa" >Correo representante legal empresa</Label>
                                                                                    <Col sm={8} >
                                                                                        <Input
                                                                                            id='correoRepresentanteLegalEmpresa'
                                                                                            type="text"
                                                                                            name='correoRepresentanteLegalEmpresa'
                                                                                            value={correoRepresentanteLegalEmpresa}
                                                                                            placeholder="Correo representante legal empresa"
                                                                                            onChange={this.handleChange}
                                                                                            autocomplete="off"
                                                                                        />
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </Col>
                                                                            <Col xl={6} lg={6} md={12} sm={12}>
                                                                                <FormGroup row>
                                                                                    <Label sm={4} for="telefonoRepresentanteLegalEmpresa" >Teléfono representante legal empresa</Label>
                                                                                    <Col sm={8} >
                                                                                        <Input
                                                                                            id='telefonoRepresentanteLegalEmpresa'
                                                                                            type="text"
                                                                                            name='telefonoRepresentanteLegalEmpresa'
                                                                                            value={telefonoRepresentanteLegalEmpresa}
                                                                                            placeholder="Teléfono representante legal empresa"
                                                                                            onChange={this.handleChange}
                                                                                            autocomplete="off"
                                                                                            onKeyPress={this.HandleKeyPressTextoNumeros}
                                                                                        />
                                                                                    </Col>
                                                                                </FormGroup>
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                </ExpansionPanelDetails>
                                                            </ExpansionPanel>
                                                        </Col>
                                                    </Row>

                                                    <CardBody>
                                                        <Button color="info" outline>
                                                            Actualizar copropiedad
                                                        </Button>
                                                    </CardBody>
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


export default connect(mapStateToProps, mapDispatchToProps)(AdministrarPropiedadesHorizontales);


let tipoPropiedadHorizontal = [
    'Edificio de vivienda',
    'Edificio de uso mixto',
    'Edificio corporativo (Oficinas)',
    'Hotel',
    'Autoalmacenamiento',
    'lote',
    'Casa',
    'Apartamento',
    'Oficina.',
    'Local',
    'Bodega',
    'Parque logistico',
    'otros',
]
