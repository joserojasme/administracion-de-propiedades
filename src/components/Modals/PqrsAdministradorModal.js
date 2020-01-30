import { Storage } from 'aws-amplify';
import React, { Fragment } from 'react';
import { MdError, MdInfo } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardHeader, Col, Form, FormGroup, FormText, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { ActualizarPqrs } from '../../api/api';
import Avatar from '../../components/Avatar';
import { SetShowSpinner } from '../../reducers/actions/HorizontalProperties';
import { NOTIFICATION_SYSTEM_STYLE } from '../../utils/constants';

const urlImagenPdf = 'https://s3.us-east-2.amazonaws.com/miinc.com.co/public/pdf.png';
const urlImagenGenerica = 'https://s3.us-east-2.amazonaws.com/miinc.com.co/public/pqrs.jpg';
const urlBucket = 'https://s3.us-east-2.amazonaws.com/miinc.com.co/public/';

class PqrsAdministradorModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoria: '',
            titulo: '',
            descripcion: '',
            estado: '',
            urlImagen: '',
            urlImagenRespuesta: '',
            respuesta: '',
            botonActualizarDisable: true,
            fileUrl: urlImagenGenerica,
            file: '',
            fileName: '',
            fileNameS3: '',
            textoSubidaArchivo: 'Escoger archivo',
            botonSubirDisable: true,
        }
    }

    componentWillMount() {
        const { pqrs } = this.props;
        this.setState({
            categoria: pqrs[0].categoria,
            titulo: pqrs[0].titulo,
            descripcion: pqrs[0].descripcion,
            estado: pqrs[0].estado,
            urlImagen: pqrs[0].urlImagen,
            urlImagenRespuesta: pqrs[0].urlImagenRespuesta,
            respuesta: pqrs[0].respuesta,
        })
    }

    handleChange = (event) => {
        let value = event.target.value;
        value = value.toUpperCase();
        this.setState({ [event.target.id]: value }, () => {
            const { estado, respuesta } = this.state;
            const { pqrs } = this.props;
            if (estado != pqrs[0].estado || respuesta != '') {
                this.setState({ botonActualizarDisable: false })
            } else {
                this.setState({ botonActualizarDisable: true })
            }
        })
    }

    Notificacion =  (message, icon, level, time) => {
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
                textoSubidaArchivo: 'Archivo subido'
            })
        }).catch(err => {
            this.Notificacion('Error al cargar el archivo', <MdInfo />, 'success', 1000);
        })
    }

    handleClickActualizarPqrs = async () => {
        const { estado, respuesta, fileNameS3, botonSubirDisable } = this.state;
        const { pqrs,closeModal } = this.props;
        let urlImagenRespuesta;

        if (botonSubirDisable == false) {
            this.Notificacion('Por favor suba el archivo antes de guardar', <MdError />, 'error', 500);
            return;
        }

        if (fileNameS3 == '') {
            urlImagenRespuesta = pqrs[0].urlImagenRespuesta;
        } else {
            urlImagenRespuesta = `${urlBucket}${fileNameS3}`;
        }
        
        let body = await {
            id: pqrs[0].id,
            categoria: pqrs[0].categoria,
            titulo: pqrs[0].titulo,
            descripcion: pqrs[0].descripcion,
            estado: estado,
            urlImagen: pqrs[0].urlImagen,
            idPropiedad: pqrs[0].idPropiedad,
            idPropiedadHorizontal: pqrs[0].idPropiedadHorizontal,
            fechaRegistro: pqrs[0].fechaRegistro,
            respuesta:respuesta,
            urlImagenRespuesta:urlImagenRespuesta,
            fechaRespuesta: this.fechaRespuesta(estado)
        }
        

        ActualizarPqrs(body, this.props.setShowSpinner).then(result => {
            if (result.status == 200) {
                this.Notificacion('La info. Pqr se actualizó', <MdInfo />, 'success', 10);
                closeModal();
            } else {
                this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 500);
            }
        })
    }

    fechaRespuesta = (estado) =>{
        if(estado != 'RESUELTO'){
            return null;
        }

        var d = new Date();
        d = new Date(d.getTime() - 3000000);
        var fechaRespuesta = d.getFullYear().toString() + "-" + ((d.getMonth() + 1).toString().length == 2 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1).toString()) + "-" + (d.getDate().toString().length == 2 ? d.getDate().toString() : "0" + d.getDate().toString()) + " " + (d.getHours().toString().length == 2 ? d.getHours().toString() : "0" + d.getHours().toString()) + ":" + ((parseInt(d.getMinutes() / 5) * 5).toString().length == 2 ? (parseInt(d.getMinutes() / 5) * 5).toString() : "0" + (parseInt(d.getMinutes() / 5) * 5).toString()) + ":00";
        return fechaRespuesta;
    }

    render() {
        const { open, closeModal } = this.props;
        const {
            categoria,
            titulo,
            descripcion,
            estado,
            urlImagen,
            urlImagenRespuesta,
            botonActualizarDisable,
            respuesta,
            botonSubirDisable,
            file,
            fileName,
            fileNameS3,
            textoSubidaArchivo,
            fileUrl
        } = this.state;
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
                    <ModalHeader toggle={closeModal}><strong>Ver y gestionar PQRS</strong></ModalHeader>
                    <Form>
                        <ModalBody className="d-flex justify-content-center align-items-center flex-column" >
                            <Col md={12} sm={12} xs={12} lg={12} >
                                <Card className="d-flex justify-content-center align-items-center flex-column">
                                    <CardBody className="w-100">
                                        <Row>
                                            <Col xl={12} lg={12} md={12} sm={12}>
                                                <Card>
                                                    <CardHeader >INFORMACIÓN PQR

                                                </CardHeader>
                                                    <CardBody>
                                                        <Form>
                                                            <FormGroup row>
                                                                <Label sm={5} for="categoria" >
                                                                    Categoria
                  </Label>
                                                                <Col sm={7} >
                                                                    <Input
                                                                        id='categoria'
                                                                        type="text"
                                                                        disabled={true}
                                                                        name='categoria'
                                                                        placeholder="Ingrese categoria"
                                                                        value={categoria}
                                                                        autocomplete="off"
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup row>
                                                                <Label sm={5} for="titulo" >
                                                                    Titulo
                  </Label>
                                                                <Col sm={7} >
                                                                    <Input
                                                                        id='titulo'
                                                                        type="textarea"
                                                                        disabled={true}
                                                                        name='titulo'
                                                                        placeholder="Ingrese titulo"
                                                                        value={titulo}
                                                                        autocomplete="off"
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup row>
                                                                <Label sm={5} for="descripcion" >
                                                                    Descripcion
                  </Label>
                                                                <Col sm={7} >
                                                                    <Input
                                                                        id='descripcion'
                                                                        type="textarea"
                                                                        disabled={true}
                                                                        name='descripcion'
                                                                        placeholder="Ingrese descripcion"
                                                                        value={descripcion}
                                                                        autocomplete="off"
                                                                    />
                                                                </Col>
                                                            </FormGroup>

                                                            <FormGroup row>

                                                                <Col sm={6} >
                                                                    <a href={urlImagen} target="_blank">Ver adjunto</a>
                                                                </Col>
                                                                <Col sm={6} >
                                                                    <a href={urlImagenRespuesta} target="_blank">Ver adjunto respuesta</a>
                                                                </Col>
                                                            </FormGroup>

                                                            <FormGroup row>
                                                                <Label sm={5}>Estado</Label>
                                                                <Col sm={3.5}>
                                                                    <FormGroup check>
                                                                        <Label check>
                                                                            <Input
                                                                                checked={estado == 'ACTIVO' ? true : false}
                                                                                type="radio" id="estado" value="ACTIVO" onChange={this.handleChange} /> ACTIVO
                      </Label>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col sm={3.5}>
                                                                    <FormGroup check>
                                                                        <Label check>
                                                                            <Input type="radio" onChange={this.handleChange}
                                                                                checked={estado == 'RESUELTO' ? true : false}
                                                                                id="estado" value="RESUELTO" /> RESUELTO
                      </Label>
                                                                    </FormGroup>
                                                                </Col>

                                                            </FormGroup>

                                                            <FormGroup row>
                                                                <Label sm={5} for="respuesta" >
                                                                    Respuesta
                  </Label>
                                                                <Col sm={7} >
                                                                    <Input
                                                                        id='respuesta'
                                                                        type="textarea"
                                                                        name='respuesta'
                                                                        placeholder="Ingrese respuesta"
                                                                        value={respuesta}
                                                                        onChange={this.handleChange}
                                                                        autocomplete="off"
                                                                    />
                                                                </Col>
                                                            </FormGroup>

                                                            <FormGroup>
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
                                                <Col lg={6}>
                                                    <Button disabled={botonActualizarDisable} color="info" onClick={this.handleClickActualizarPqrs} outline>
                                                        Actualizar
                                                        </Button>
                                                </Col>
                                            </Row>
                                        </CardBody>
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

export default connect(mapStateToProps, mapDispatchToProps)(PqrsAdministradorModal);
