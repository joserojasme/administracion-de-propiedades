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
import AdministrarZonasComunesTabla from './AdministrarZonasComunesTabla';
import { GetZonasComunes, BorrarZonasComunes, ActualizarZonasComunes, GuardarZonasComunes, GetZonasComunesInventario } from '../api/api';
import { handleKeyPressDecimal } from '../utils/utilsFunctions';
import AdministrarInventarioZonasComunes from './AdministrarInventarioZonasComunes';

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
        height: '500px',
        overflowY: 'auto'
    }
}

const urlImagenPdf = 'https://s3.us-east-2.amazonaws.com/miinc.com.co/public/pdf.png';
const urlImagenGenerica = 'https://s3.us-east-2.amazonaws.com/miinc.com.co/media/logo_miinc.png';
const urlBucket = 'https://s3.us-east-2.amazonaws.com/miinc.com.co/public/';
const initialState = {
    fileUrl: '',
    textoSubidaArchivo: 'Escoger archivo',
    fileName: '',
    nombre: '',
    descripcion: '',
    botonSubirDisable: true,
    urlImagen: urlImagenGenerica,
    zonasComunes: [],
    isActualizacion: false,
    zonaComun: {},
    valorReserva: '',
    valorDeposito: 0,

    //state 
    administrarInventario: false,
    zonasComunesInventario: [],
    zonaComunInventario: {}
}

class AdministrarZonasComunes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        }
        this.handleClickGuardar = this.handleClickGuardar.bind(this);
    }

    handleKeyPressDecimal = (event) => {
        if (!handleKeyPressDecimal(event)) {
            event.preventDefault();
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

    handleChange = (event) => {
        let value = event.target.value;
        value = value;
        this.setState({ [event.target.id]: value }, () => {

        })
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

    handleClickBorrar = (event) => {
        BorrarZonasComunes(event.target.value, this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    this.Notificacion('Zona común borrada', <MdInfo />, 'success', 1000);
                    this.handleClickConsultarZonasComunes();
                    break;
                case 404:
                    this.Notificacion('No se encontró la zona común', <MdInfo />, 'error', 1000);
                    break;
                default:
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                    break;
            }
        })
    }

    handleClickInventario = (event) => {
        let idZonaComun = event.target.value;
        const { zonasComunes } = this.state;
        let zonaComun = zonasComunes.filter(item => {
            return item.id == idZonaComun;
        })
        this.setState({ zonaComunInventario: zonaComun }, () => {
            GetZonasComunesInventario(idZonaComun, this.props.setShowSpinner).then(result => {
                switch (result.status) {
                    case 200:
                        this.setState({ zonasComunesInventario: result.data, administrarInventario: true })
                        break;
                    case 404:
                        this.setState({ zonasComunesInventario: [], administrarInventario: true })
                        break;
                    default:
                        this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                        break;
                }
            })
        })
    }

    handleClickEditar = (event) => {
        this.setState({ isActualizacion: true })
        const { zonasComunes } = this.state;
        let idZonaComun = event.target.value;
        let zonaComun = zonasComunes.filter(item => {
            return item.id == idZonaComun;
        })

        this.setState({
            nombre: zonaComun[0].nombre,
            descripcion: zonaComun[0].descripcion,
            urlImagen: zonaComun[0].urlImagen,
            fileUrl: zonaComun[0].urlImagen,
            valorReserva: zonaComun[0].valorReserva,
            valorDeposito: zonaComun[0].valorDeposito,
            zonaComun: zonaComun[0]
        })
    }

    handleClickGuardar = (event) => {
        event.preventDefault();
        const { zonaComun, nombre, descripcion, urlImagen, isActualizacion, botonSubirDisable, valorReserva, valorDeposito } = this.state;
        if (!botonSubirDisable) {
            this.Notificacion('Primero debe subir la imagen', <MdError />, 'error', 1000);
            return;
        }

        if (!isActualizacion) {
            const { propiedadHorizontal } = this.props;
            let zonaComun = {
                nombre, descripcion, "idPropiedadesHorizontales": propiedadHorizontal.id
                , urlImagen, valorReserva, valorDeposito
            }
            GuardarZonasComunes(zonaComun, this.props.setShowSpinner).then(result => {
                switch (result.status) {
                    case 200:
                        this.Notificacion('Zona común guardada', <MdInfo />, 'success', 1000);
                        this.handleClickConsultarZonasComunes();
                        break;
                    default:
                        this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                        break;
                }
            })
        } else {
            zonaComun.nombre = nombre;
            zonaComun.descripcion = descripcion;
            zonaComun.urlImagen = urlImagen;
            zonaComun.valorReserva = valorReserva;
            zonaComun.valorDeposito = valorDeposito;

            ActualizarZonasComunes(zonaComun, this.props.setShowSpinner).then(result => {
                switch (result.status) {
                    case 200:
                        this.Notificacion('Zona común actualizada', <MdInfo />, 'success', 1000);
                        this.handleClickConsultarZonasComunes();
                        break;
                    case 404:
                        this.Notificacion('No se encontró la zona común', <MdInfo />, 'error', 1000);
                        break;
                    default:
                        this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                        break;
                }
            })
        }
    }

    handleClickVolver = () => {
        this.setState({ administrarInventario: false, zonasComunesInventario: [] })
    }

    handleClickConsultarZonasComunes = () => {
        this.setState({ ...initialState })
        const { propiedadHorizontal } = this.props;
        GetZonasComunes(propiedadHorizontal.id, this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    this.setState({ zonasComunes: result.data, })
                    break;
                case 404:
                    this.setState({ zonasComunes: [] })
                    this.Notificacion('No se encontraron zonas comunes', <MdInfo />, 'error', 1000);
                    break;
                default:
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                    break;
            }
        })
    }

    render() {
        const { fileUrl, textoSubidaArchivo, fileName, nombre, descripcion
            , botonSubirDisable, zonasComunes, isActualizacion, valorReserva,
            valorDeposito, administrarInventario, zonasComunesInventario, zonaComunInventario } = this.state;
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
                        {!administrarInventario &&
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
                                            <Label sm={4} for="valorReserva" >Valor reserva*</Label>
                                            <Col sm={8} >
                                                <Input
                                                    required
                                                    id='valorReserva'
                                                    type="text"
                                                    name='valorReserva'
                                                    value={valorReserva}
                                                    placeholder="Ingrese un valor"
                                                    onChange={this.handleChange}
                                                    onKeyPress={this.handleKeyPressDecimal}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col xl={6} lg={6} md={12} sm={12}>
                                        <FormGroup row>
                                            <Label sm={4} for="valorDeposito" >Valor deposito</Label>
                                            <Col sm={8} >
                                                <Input
                                                    id='valorDeposito'
                                                    type="text"
                                                    name='valorDeposito'
                                                    value={valorDeposito}
                                                    placeholder="Ingrese un valor"
                                                    onChange={this.handleChange}
                                                    onKeyPress={this.handleKeyPressDecimal}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xl={8} lg={8} md={12} sm={12}>
                                        <FormGroup row>
                                            <Label sm={4} for="urlImagen">Adjunto</Label>
                                            <Col sm={8} >
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
                                    {fileUrl != '' &&
                                        <Col xl={4} lg={4} md={12} sm={12}>
                                            <FormGroup row>
                                                <Col sm={12} >
                                                    <Label for="urlImagen">{fileName != '' ? fileName.toString().substring(0, 15) : fileName}</Label>
                                                    <Avatar name="urlImagen" id="urlImagen" src={fileUrl} size={130} className="mb-0" />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    }
                                </Row>
                                <Row>
                                    <Col xl={6} lg={6} md={12} sm={12}>
                                        <FormGroup row></FormGroup>
                                    </Col>
                                    <Col xl={3} lg={3} md={12} sm={12}>
                                        <FormGroup row>
                                            <Button color="info" onClick={this.handleClickConsultarZonasComunes} outline>Consultar</Button>
                                        </FormGroup>
                                    </Col>
                                    <Col xl={3} lg={3} md={12} sm={12}>
                                        <FormGroup row>
                                            <Button color="info" type="submit" outline>{isActualizacion ? 'Actualizar' : 'Guardar'}</Button>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                {zonasComunes.length > 0 &&
                                    <Row style={styles.tabla}>
                                        {zonasComunes.length > 0 &&
                                            <AdministrarZonasComunesTabla
                                                rows={zonasComunes}
                                                handleClickBorrar={this.handleClickBorrar}
                                                handleClickInventario={this.handleClickInventario}
                                                handleClickEditar={this.handleClickEditar} />
                                        }
                                    </Row>
                                }
                            </Form>
                        }
                        {administrarInventario &&
                            <AdministrarInventarioZonasComunes
                                zonasComunesInventario={zonasComunesInventario}
                                volver={this.handleClickVolver}
                                zonaComun={zonaComunInventario[0]}
                            />
                        }
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


export default connect(mapStateToProps, mapDispatchToProps)(AdministrarZonasComunes);
