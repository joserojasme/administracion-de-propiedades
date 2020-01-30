import { Storage } from 'aws-amplify';
import React, { Fragment } from 'react';
import { MdError, MdInfo } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardHeader, Col, Form, FormGroup, FormText, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { ActualizarPqrs, CrearPqrs, GetPqrs } from '../../api/api';
import Avatar from '../../components/Avatar';
import { SetShowSpinner } from '../../reducers/actions/HorizontalProperties';
import { NOTIFICATION_SYSTEM_STYLE } from '../../utils/constants';
import Pqrs from '../Pqrs';

const style = {
    cardBody: {
        maxHeight: '350px',
        height: '350px',
        overflowY: 'auto'
    }
}

const urlImagenPdf = 'https://s3.us-east-2.amazonaws.com/miinc.com.co/public/pdf.png';
const urlImagenGenerica = 'https://s3.us-east-2.amazonaws.com/miinc.com.co/public/pqrs.jpg';
const urlBucket = 'https://s3.us-east-2.amazonaws.com/miinc.com.co/public/';

class PqrsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pqrs: [],
            categoria: '',
            titulo: '',
            descripcion: '',
            estado: '',
            urlImagen: '',
            botonActualizarDisable: true,
            pqrSeleccionada: '',
            propiedad: '',
            visibleModificar: false,
            botonCrearNuevo: false,
            fileUrl: urlImagenGenerica,
            file: '',
            fileName: '',
            fileNameS3: '',
            textoSubidaArchivo: 'Escoger archivo',
            botonSubirDisable: true,
            urlImagenRespuesta:''
        }
        this.handleChangeFiltroPropiedad = this.handleChangeFiltroPropiedad.bind(this);
    }

    handleChangeCategoria = async (event) =>{
        let value = event.target.value;
        if (value == 'Seleccione...') {
            this.setState({
                categoria:''
            })
            return;
        }

        this.setState({categoria:value})
    }

    handleChangeImage = (event) => {
        const file = event.target.files[0];
        if (file == undefined) return;
        if (file.type == 'application/pdf' || file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/jpg') {
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
                fileNameS3: ''
            })
        } else {
            this.setState({
                botonSubirDisable: true,
                textoSubidaArchivo: 'Tipo no permitido',
                fileUrl: urlImagenGenerica,
                file: '',
                fileName: '',
                fileNameS3: ''
            })
            return;
        }

    }

    saveFile = () => {
        let fecha = Math.floor(Date.now() / 1000);
        Storage.put(`${fecha}${this.state.fileName}`, this.state.file).then((result) => {
            this.Notificacion('Se cargó el archivo correctamente', <MdInfo />, 'success', 1000);
            this.setState({
                fileNameS3: result.key,
                botonSubirDisable: true,
                textoSubidaArchivo:'Archivo subido'
            })
        }).catch(err => {
            this.Notificacion('Error al cargar el archivo', <MdInfo />, 'success', 1000);
        })
    }

    handleChange = (event) => {
        let value = event.target.value;
        value = value.toUpperCase();
        this.setState({ [event.target.id]: value }, () => {
            const { categoria, titulo, descripcion, estado, } = this.state;
            if (categoria != '' && titulo != '' && descripcion != '') {
                this.setState({ botonActualizarDisable: false })
            } else {
                this.setState({ botonActualizarDisable: true })
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

    handleChangeFiltroPropiedad = async (event) => {
        const { propiedades } = this.props;
        let value = event.target.value;
        if (value == 'Seleccione...') {
            this.setState({
                pqrs: [], categoria: '', titulo: '', estado: '', descripcion: ''
                , visibleModificar: false, botonCrearNuevo: false, pqrSeleccionada: '', propiedad: ''
            })
            return;
        }
        value = value.split("#", 2);
        this.setState({ propiedad: value[1], visibleModificar: false, botonCrearNuevo: false });
        let propiedad = await propiedades.filter(item => {
            return item.nomenclatura == value[1];
        })
        GetPqrs(propiedad[0].id, this.props.setShowSpinner, 'propiedad').then(result => {
            switch (result.status) {
                case 200:
                    this.setState({ pqrs: result.data, categoria: '', titulo: '', estado: '', descripcion: '' })
                    break;
                case 404:
                    this.setState({ pqrs: result.data, categoria: '', titulo: '', estado: '', descripcion: '' })
                    this.Notificacion('No se encontraron pqrs', <MdInfo />, 'error', 1000);
                    break;
                default:
                    this.setState({ categoria: '', titulo: '', estado: '', descripcion: '' })
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                    break;
            }
        })

    }

    handleClickBorrarPqr = async (event) => {
        let value = event.target.value;
        const { pqrs } = this.state;
        let Pqr = pqrs.filter(item => {
            return item.id == value;
        })

        let body = await {
            id: Pqr[0].id,
            categoria: Pqr[0].categoria,
            titulo: Pqr[0].titulo,
            descripcion: Pqr[0].descripcion,
            estado: 'RESUELTO',
            urlImagen: Pqr[0].urlImagen,
            idPropiedad: Pqr[0].idPropiedad,
            idPropiedadHorizontal: Pqr[0].idPropiedadHorizontal,
            fechaRegistro: Pqr[0].fechaRegistro,
        }

        ActualizarPqrs(body, this.props.setShowSpinner).then(result => {
            if (result.status == 200) {
                this.Notificacion('La info. Pqr se actualizó', <MdInfo />, 'success', 1000);
                GetPqrs(Pqr[0].idPropiedad, this.props.setShowSpinner, 'propiedad').then(result => {
                    switch (result.status) {
                        case 200:
                            this.setState({ pqrs: result.data, categoria: '', titulo: '', estado: '', descripcion: '', visibleModificar: false, botonCrearNuevo: false })
                            break;
                        case 404:
                            this.setState({ pqrs: result.data })
                            this.Notificacion('No se encontraron pqrs', <MdInfo />, 'error', 1000);
                            break;
                        default:
                            this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                            break;
                    }
                })
            } else {
                this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
            }
        })

    }

    handleClickModificarPqr = (event) => {
        let value = event.target.value;
        const { pqrs } = this.state;
        let Pqr = pqrs.filter(item => {
            return item.id == value;
        })
        this.setState({
            categoria: Pqr[0].categoria,
            titulo: Pqr[0].titulo,
            estado: Pqr[0].estado,
            descripcion: Pqr[0].descripcion,
            botonActualizarDisable: true,
            pqrSeleccionada: value,
            visibleModificar: true,
            botonCrearNuevo: false,
            urlImagen: Pqr[0].urlImagen,
            respuesta: Pqr[0].respuesta,
            urlImagenRespuesta:Pqr[0].urlImagenRespuesta
        })
    }

    handleClickActualizarPqrs = async (event) => {
        let value = event.target.value;
        const { pqrs } = this.state;
        let Pqr = pqrs.filter(item => {
            return item.id == value;
        })

        const { categoria, titulo, descripcion, estado, } = this.state;

        let body = await {
            id: Pqr[0].id,
            categoria: categoria,
            titulo: titulo,
            descripcion: descripcion,
            estado: estado,
            urlImagen: Pqr[0].urlImagen,
            idPropiedad: Pqr[0].idPropiedad,
            idPropiedadHorizontal: Pqr[0].idPropiedadHorizontal,
            fechaRegistro: Pqr[0].fechaRegistro,
        }

        ActualizarPqrs(body, this.props.setShowSpinner).then(result => {
            if (result.status == 200) {
                this.Notificacion('La info. Pqr se actualizó', <MdInfo />, 'success', 1000);
                GetPqrs(Pqr[0].idPropiedad, this.props.setShowSpinner, 'propiedad').then(result => {
                    switch (result.status) {
                        case 200:
                            this.setState({ pqrs: result.data, categoria: '', titulo: '', estado: '', descripcion: '', visibleModificar: false, botonCrearNuevo: false })
                            break;
                        case 404:
                            this.setState({ pqrs: result.data })
                            this.Notificacion('No se encontraron pqrs', <MdInfo />, 'error', 1000);
                            break;
                        default:
                            this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                            break;
                    }
                })
            } else {
                this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
            }
        })
    }

    handleClickCrearPqrs = async (event) => {
        const { categoria, titulo, descripcion, propiedad, fileNameS3, botonSubirDisable } = this.state;
        const { propiedades, propiedadHorizontal } = this.props;
        let urlImagen;

        if (botonSubirDisable == false) {
            this.Notificacion('Por favor suba el archivo antes de guardar', <MdError />, 'error', 500);
            return;
        }

        if (fileNameS3 == '') {
            urlImagen = urlImagenGenerica;
        } else {
            urlImagen = `${urlBucket}${fileNameS3}`;
        }

        if (propiedad == '') {
            this.Notificacion('Seleccione una propiedad', <MdError />, 'error', 1000);
            return;
        }

        let prop = await propiedades.filter(item => {
            return item.nomenclatura == propiedad
        })

        let body = await {
            categoria: categoria,
            titulo: titulo,
            urlImagen: urlImagen,
            descripcion: descripcion,
            estado: "ACTIVO",
            idPropiedad: prop[0].id,
            idPropiedadHorizontal: propiedadHorizontal.id,
            respuesta: ''
        }

        CrearPqrs(body, this.props.setShowSpinner).then(result => {
            if (result.status == 200) {
                this.Notificacion('Pqr agregada', <MdInfo />, 'success', 1000);
                this.setState({
                    fileUrl: '',
                    file: '',
                    fileName: '',
                    fileNameS3: '',
                    botonSubirDisable: true,
                })

                GetPqrs(prop[0].id, this.props.setShowSpinner, 'propiedad').then(result => {
                    switch (result.status) {
                        case 200:
                            this.setState({ pqrs: result.data, categoria: '', titulo: '', estado: '', descripcion: '', visibleModificar: false, botonCrearNuevo: false })
                            break;
                        case 404:
                            this.setState({ pqrs: result.data })
                            this.Notificacion('No se encontraron pqrs', <MdInfo />, 'error', 1000);
                            break;
                        default:
                            this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                            break;
                    }
                })
            } else {
                this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
            }
        })
    }

    handleClickCrearNueva = () => {
        this.setState({
            visibleModificar: true, botonCrearNuevo: true,
            categoria: '', titulo: '', estado: '', descripcion: '', urlImagen: '', fileUrl: urlImagenGenerica
        })
    }

    render() {
        const { open, closeModal, propiedades } = this.props;
        const { pqrs, categoria, titulo, descripcion, estado, botonActualizarDisable,
            pqrSeleccionada, visibleModificar, botonCrearNuevo, urlImagen,urlImagenRespuesta, respuesta, fileUrl, fileName, textoSubidaArchivo,
            botonSubirDisable } = this.state;
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
                    <ModalHeader toggle={closeModal}><strong>PQRS</strong></ModalHeader>
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

                            <Col style={visibleModificar ? { display: 'block' } : { display: 'none' }} className="mb-3" md={12} sm={12} xs={12} lg={12} >
                                <Card className="d-flex justify-content-center align-items-center flex-column">
                                    <CardBody className="w-100">
                                        <Row>
                                            <Col xl={12} lg={12} md={12} sm={12}>
                                                <Card>
                                                    <CardHeader >INFORMACIÓN PQRS

                                                </CardHeader>
                                                    <CardBody>
                                                        <Form>
                                                        <div style={botonCrearNuevo ? { display: 'none' } : { display: 'block' }}>
                                                            <FormGroup row>
                                                                <Label sm={5} for="categoria" >
                                                                    Categoría
                  </Label>
                                                                    <Col sm={7} >
                                                                        <Input
                                                                            autoFocus
                                                                            id='categoria'
                                                                            type="text"
                                                                            name='categoria'
                                                                            placeholder="Ingrese categoria"
                                                                            value={categoria}
                                                                            onChange={this.handleChange}
                                                                            autocomplete="off"
                                                                            disabled={botonCrearNuevo ? false : true}
                                                                        />
                                                                    </Col>
                                                            </FormGroup>
                                                            </div>
                                                            <div style={botonCrearNuevo ? { display: 'block' } : { display: 'none' }}>
                                                            <FormGroup row>
                                                                <Label sm={5} for="categoria" >
                                                                    Categoría
                  </Label>
                  <Col sm={7}>
                                                                        <Input type="select" name="select" onChange={this.handleChangeCategoria}>
                                                                            <option selected={true}>Seleccione...</option>
                                                                            <option>{`SEGURIDAD`}</option>
                                                                            <option>{`MANTENIMIENTO`}</option>
                                                                            <option>{`FACTURA`}</option>
                                                                        </Input>
                                                                    </Col>
                                                            </FormGroup>
                                                            </div>
                                                            <FormGroup row>
                                                                <Label sm={5} for="titulo" >
                                                                    Título
                  </Label>
                                                                <Col sm={7} >
                                                                    <Input
                                                                        id='titulo'
                                                                        type="text"
                                                                        name='titulo'
                                                                        placeholder="Ingrese titulo"
                                                                        value={titulo}
                                                                        onChange={this.handleChange}
                                                                        autocomplete="off"
                                                                        disabled={botonCrearNuevo ? false : true}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup row>
                                                                <Label sm={5} for="descripcion" >
                                                                    Descripción
                  </Label>
                                                                <Col sm={7} >
                                                                    <Input
                                                                        id='descripcion'
                                                                        type="textarea"
                                                                        name='descripcion'
                                                                        placeholder="Ingrese descripcion"
                                                                        value={descripcion}
                                                                        onChange={this.handleChange}
                                                                        autocomplete="off"
                                                                        disabled={botonCrearNuevo ? false : true}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                            <div style={botonCrearNuevo ? { display: 'none' } : { display: 'block' }}>
                                                                <FormGroup row >
                                                                    <Label sm={5} for="estado" >
                                                                        Estado
                  </Label>
                                                                    <Col sm={7} >
                                                                        <Input
                                                                            id='estado'
                                                                            type="text"
                                                                            name='estado'
                                                                            placeholder="Ingrese estado"
                                                                            value={estado}
                                                                            onChange={this.handleChange}
                                                                            autocomplete="off"
                                                                            disabled={botonCrearNuevo ? false : true}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                            </div>
                                                            <div style={botonCrearNuevo ? { display: 'none' } : { display: 'block' }}>
                                                                <FormGroup row >
                                                                    <Label sm={5} for="respuesta" >
                                                                        Respuesta
                  </Label>
                                                                    <Col sm={7} >
                                                                        <Input
                                                                            id='respuesta'
                                                                            type="textarea"
                                                                            name='respuesta'
                                                                            placeholder="Sin respuesta"
                                                                            value={respuesta}
                                                                            onChange={this.handleChange}
                                                                            autocomplete="off"
                                                                            disabled={botonCrearNuevo ? false : true}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>

                                                            </div>
                                                            <FormGroup style={{ display: 'none' }} row>
                                                                <Label sm={5}>
                                                                    Estado
                  </Label>
                                                                <Col sm={3.5}>
                                                                    <FormGroup check>
                                                                        <Label check>
                                                                            <Input
                                                                                checked={estado == 'ACTIVO' ? true : false}
                                                                                type="radio" id="estado" value="ACTIVO" onChange={this.handleChange} /> Activo
                      </Label>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col sm={3.5}>
                                                                    <FormGroup check>
                                                                        <Label check>
                                                                            <Input type="radio" onChange={this.handleChange}
                                                                                checked={estado == 'RESUELTO' ? true : false}
                                                                                id="estado" value="RESUELTO" /> Resuelto
                      </Label>
                                                                    </FormGroup>
                                                                </Col>

                                                            </FormGroup>
                                                            <div style={botonCrearNuevo ? { display: 'none' } : { display: 'block' }}>
                                                                <FormGroup row>

                                                                    <Col sm={6} >
                                                                        <a href={urlImagen} target="_blank">Ver adjunto</a>
                                                                    </Col>
                                                                    <Col sm={6} >
                                                                        <a href={urlImagenRespuesta} target="_blank">Ver adjunto respuesta</a>
                                                                    </Col>
                                                                </FormGroup>
                                                            </div>
                                                            <FormGroup style={botonCrearNuevo ? { display: 'block' } : { display: 'none' }}>
                                                                <Label for="urlImagen">Adjunto</Label>
                                                                <div class="input-group">
                                                                    <div class="input-group-prepend">
                                                                        <Button disabled={botonSubirDisable} color="info" onClick={this.saveFile} outline>
                                                                            Subir
                                                        </Button>
                                                                    </div>
                                                                    <div class="custom-file">
                                                                        <input accept="application/pdf,image/*" type="file" class="custom-file-input" id="urlImagen"
                                                                            onChange={this.handleChangeImage} />
                                                                        <label class="custom-file-label" for="inputGroupFile01">{textoSubidaArchivo}</label>
                                                                    </div>
                                                                </div>
                                                                <FormText color="muted">
                                                                    Sólo está permitido archivos de imagen y pdf
                  </FormText>
                                                                <Label for="urlImagen">{fileName != '' ? fileName.toString().substring(0, 20) : fileName}</Label>
                                                                <Avatar name="urlImagen" id="urlImagen" src={fileUrl} size={150} className="mb-0" />

                                                            </FormGroup>

                                                        </Form>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <CardBody>
                                            <Row>
                                                <Col style={botonCrearNuevo ? { display: 'none' } : { display: 'none' }} lg={6}>
                                                    <Button disabled={botonActualizarDisable} color="info" value={pqrSeleccionada} onClick={this.handleClickActualizarPqrs} outline>
                                                        Actualizar
                                                        </Button>
                                                </Col>
                                                <Col style={botonCrearNuevo ? { display: 'block' } : { display: 'none' }} lg={6}>
                                                    <Button disabled={botonActualizarDisable} color="info" value={pqrSeleccionada} onClick={this.handleClickCrearPqrs} outline>
                                                        Guardar PQRS
                                                        </Button>
                                                </Col>

                                            </Row>
                                        </CardBody>
                                    </CardBody>
                                </Card>
                            </Col>


                            <Col lg="12" md="12" sm="12" xs="12">
                                <Card>
                                    <CardHeader>Listado de pqrs
                                    <Button className="ml-1" color="info" onClick={this.handleClickCrearNueva} outline>
                                            Crear nueva
                                                        </Button>
                                    </CardHeader>
                                    <CardBody style={style.cardBody}>
                                        <Pqrs
                                            headers={[
                                                'Acción',
                                                'Categoría',
                                                'Título',
                                                'Descripción',
                                                'Estado',

                                            ]}
                                            usersData={pqrs}
                                            onClick={this.handleClickModificarPqr}
                                            onClickBorrar={this.handleClickBorrarPqr}
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </ModalBody>
                    </Form>
                </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(PqrsModal);
