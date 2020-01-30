import Switch from '@material-ui/core/Switch';
import { Storage } from 'aws-amplify';
import Page from 'components/Page';
import React from 'react';
import { MdInfo, MdError } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { Button, Card, CardBody, Col, Form, FormGroup, FormText, Input, Label, Row } from 'reactstrap';
import Avatar from '../components/Avatar';
import { SetPropiedadesHorizontales, SetPropiedadHorizontal, SetShowSpinner } from '../reducers/actions/HorizontalProperties';
import { NOTIFICATION_SYSTEM_STYLE } from '../utils/constants';
import AdministrarNoticiasTabla from './AdministrarNoticiasTabla';
import { GetNoticias, BorrarNoticias, ActualizarNoticias, GuardarNoticias } from '../api/api';

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
const urlImagenGenerica = 'https://www.colmenaseguros.com/imagenesColmenaARP/contenido/banner-noticias.jpg';
const urlBucket = 'https://s3.us-east-2.amazonaws.com/miinc.com.co/public/';
const initialState = {
    fileUrl: '',
    textoSubidaArchivo: 'Escoger archivo',
    fileName: '',
    titulo: '',
    descripcion: '',
    visible: 0,
    botonSubirDisable: true,
    urlImagen: urlImagenGenerica,
    noticias: [],
    isActualizacion: false,
    noticia: {}
}

class AdministrarNoticias extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        }
        this.handleClickGuardar = this.handleClickGuardar.bind(this);
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
        this.setState({ [event.target.id]: value })
    }

    handleChangeVisible = (event) => {
        let visible = 1;
        if(!event.target.checked){
            visible=0;
        }
        this.setState({ visible: visible })
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
        BorrarNoticias(event.target.value, this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    this.Notificacion('Noticia borrada', <MdInfo />, 'success', 1000);
                    this.handleClickConsultarNoticias();
                    break;
                case 404:
                    this.Notificacion('No se encontró la noticia', <MdInfo />, 'error', 1000);
                    break;
                default:
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                    break;
            }
        })
    }

    handleClickNotificar = (event) => {
        const { noticias } = this.state;
        let idNoticia = event.target.value;
        let noticia = noticias.filter(item => {
            return item.id == idNoticia;
        })
        noticia[0].visible = 1;

        ActualizarNoticias(noticia[0], this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    this.Notificacion('Noticia notificada', <MdInfo />, 'success', 1000);
                    this.handleClickConsultarNoticias();
                    break;
                case 404:
                    this.Notificacion('No se encontró la noticia', <MdInfo />, 'error', 1000);
                    break;
                default:
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                    break;
            }
        })
    }

    handleClickEditar = (event) => {
        this.setState({ isActualizacion: true })
        const { noticias } = this.state;
        let idNoticia = event.target.value;
        let noticia = noticias.filter(item => {
            return item.id == idNoticia;
        })

        this.setState({
            titulo: noticia[0].titulo,
            descripcion: noticia[0].descripcion,
            urlImagen: noticia[0].urlImagen,
            fileUrl: noticia[0].urlImagen,
            visible: noticia[0].visible,
            noticia: noticia[0]
        })
    }

    handleClickGuardar = (event) => {
        event.preventDefault();
        const { noticia, titulo, descripcion, urlImagen, visible, isActualizacion, botonSubirDisable } = this.state;
        if(!botonSubirDisable){
            this.Notificacion('Primero debe subir la imagen', <MdError />, 'error', 1000);
            return;
        }
        
        if (!isActualizacion) {
            const { propiedadHorizontal } = this.props;
            let noticia = { titulo, descripcion, "idPropiedadesHorizontales": propiedadHorizontal.id, urlImagen, "visible":visible }
            GuardarNoticias(noticia, this.props.setShowSpinner).then(result => {
                switch (result.status) {
                    case 200:
                        this.Notificacion('Noticia guardada', <MdInfo />, 'success', 1000);
                        this.handleClickConsultarNoticias();
                        break;
                    default:
                        this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                        break;
                }
            })
        } else {
            noticia.titulo = titulo;
            noticia.descripcion = descripcion;
            noticia.urlImagen = urlImagen;
            noticia.visible = visible;

            ActualizarNoticias(noticia, this.props.setShowSpinner).then(result => {
                switch (result.status) {
                    case 200:
                        this.Notificacion('Noticia actualizada', <MdInfo />, 'success', 1000);
                        this.handleClickConsultarNoticias();
                        break;
                    case 404:
                        this.Notificacion('No se encontró la noticia', <MdInfo />, 'error', 1000);
                        break;
                    default:
                        this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                        break;
                }
            })
        }
    }

    handleClickConsultarNoticias = () => {
        this.setState({ ...initialState })
        const { propiedadHorizontal } = this.props;
        GetNoticias(propiedadHorizontal.id, this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    this.setState({ noticias: result.data, })
                    break;
                case 404:
                    this.setState({ noticias: [] })
                    this.Notificacion('No se encontraron noticias', <MdInfo />, 'error', 1000);
                    break;
                default:
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                    break;
            }
        })
    }

    render() {
        const { propiedadHorizontal, propiedadesHorizontales, userAttributes } = this.props;
        const { fileUrl, textoSubidaArchivo, fileName, titulo, descripcion, visible
            , botonSubirDisable, noticias, isActualizacion } = this.state;
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
                        <Form onSubmit={this.handleClickGuardar} >
                            <Row>
                                <Col xl={6} lg={6} md={12} sm={12}>
                                    <FormGroup row>
                                        <Label sm={4} for="titulo" >Título *</Label>
                                        <Col sm={8} >
                                            <Input
                                                required
                                                autoFocus
                                                id='titulo'
                                                type="textarea"
                                                name='titulo'
                                                value={titulo}
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
                                <Col xl={4} lg={4} md={12} sm={12}>
                                    <FormGroup row>
                                        <Label sm={4} for="descripcion" >Visible</Label>
                                        <Col sm={8} >
                                            <Switch
                                                checked={visible}
                                                onChange={this.handleChangeVisible}
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                {fileUrl != '' &&
                                    <Col xl={6} lg={6} md={12} sm={12}>
                                        <FormGroup row>
                                            <Col sm={12} >
                                                <Label for="urlImagen">{fileName != '' ? fileName.toString().substring(0, 15) : fileName}</Label>
                                                <Avatar name="urlImagen" id="urlImagen" src={fileUrl} size={130} className="mb-0" />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                }
                                {fileUrl == '' &&
                                    <Col xl={6} lg={6} md={12} sm={12}>
                                        <FormGroup row>

                                        </FormGroup>
                                    </Col>
                                }
                                <Col xl={3} lg={3} md={12} sm={12}>
                                    <FormGroup row>
                                        <Button color="info" onClick={this.handleClickConsultarNoticias} outline>Consultar</Button>
                                    </FormGroup>
                                </Col>
                                <Col xl={3} lg={3} md={12} sm={12}>
                                    <FormGroup row>
                                        <Button color="info" type="submit" outline>{isActualizacion ? 'Actualizar' : 'Guardar'}</Button>
                                    </FormGroup>
                                </Col>
                            </Row>
                            {noticias.length > 0 &&
                                <Row style={styles.tabla}>
                                    {noticias.length > 0 &&
                                        <AdministrarNoticiasTabla
                                            rows={noticias}
                                            handleClickBorrar={this.handleClickBorrar}
                                            handleClickNotificar={this.handleClickNotificar}
                                            handleClickEditar={this.handleClickEditar} />
                                    }
                                </Row>
                            }
                        </Form>
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


export default connect(mapStateToProps, mapDispatchToProps)(AdministrarNoticias);
