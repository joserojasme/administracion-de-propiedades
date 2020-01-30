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
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { HandleKeyPressTextoNumeros } from '../utils/utilsFunctions';
import AdministrarEmpleadosTabla from './AdministrarEmpleadosTabla';
import { GetEmpleados, BorrarEmpleados, ActualizarEmpleados, GuardarEmpleados } from '../api/api';

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
    identificacion: '',
    nombre: '',
    cargo: '',
    fechaCumpleaños: null,
    fechaCumpleañosInput: null,
    horaInicioTurno: '',
    horaFinTurno: '',
    botonSubirDisable: true,
    urlImagen: urlImagenGenerica,
    empleados: [],
    isActualizacion: false,
    empleado: {}
}

class AdministrarEmpleados extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        }
        this.handleClickGuardar = this.handleClickGuardar.bind(this);
    }

    HandleKeyPressTextoNumeros = (event) => {
        if (!HandleKeyPressTextoNumeros(event)) {
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
        this.setState({ [event.target.id]: value }, () => { })
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
        BorrarEmpleados(event.target.value, this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    this.Notificacion('Empleado borrado', <MdInfo />, 'success', 1000);
                    this.handleClickConsultarEmpleados();
                    break;
                case 404:
                    this.Notificacion('No se encontró el empleado', <MdInfo />, 'error', 1000);
                    break;
                default:
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                    break;
            }
        })
    }

    handleClickEditar = (event) => {
        this.setState({ isActualizacion: true })
        const { empleados } = this.state;
        let idEmpleado = event.target.value;
        let empleado = empleados.filter(item => {
            return item.id == idEmpleado;
        })

        this.setState({
            identificacion: empleado[0].identificacion,
            nombre: empleado[0].nombre,
            urlImagen: empleado[0].urlImagen,
            fileUrl: empleado[0].urlImagen,
            cargo: empleado[0].cargo,
            fechaCumpleaños: empleado[0].fechaCumpleaños.substring(0, 10),
            fechaCumpleañosInput: empleado[0].fechaCumpleaños,
            horaInicioTurno: empleado[0].horaInicioTurno,
            horaFinTurno: empleado[0].horaFinTurno,
            empleado: empleado[0]
        })
    }

    handleClickGuardar = (event) => {
        event.preventDefault();
        const { empleado, identificacion, nombre, cargo, fechaCumpleaños, horaInicioTurno, horaFinTurno
            , urlImagen, isActualizacion, botonSubirDisable } = this.state;
        if (!botonSubirDisable) {
            this.Notificacion('Primero debe subir la imagen', <MdError />, 'error', 1000);
            return;
        }

        if (!isActualizacion) {
            const { propiedadHorizontal } = this.props;
            let empleado = {
                identificacion, nombre, "idPropiedadesHorizontales": propiedadHorizontal.id, urlImagen,
                cargo, fechaCumpleaños, horaInicioTurno, horaFinTurno
            }
            GuardarEmpleados(empleado, this.props.setShowSpinner).then(result => {
                switch (result.status) {
                    case 200:
                        this.Notificacion('Empleado guardado', <MdInfo />, 'success', 1000);
                        this.handleClickConsultarEmpleados();
                        break;
                    default:
                        this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                        break;
                }
            })
        } else {
            empleado.identificacion = identificacion;
            empleado.nombre = nombre;
            empleado.urlImagen = urlImagen;
            empleado.cargo = cargo;
            empleado.fechaCumpleaños = fechaCumpleaños;
            empleado.horaInicioTurno = horaInicioTurno;
            empleado.horaFinTurno = horaFinTurno;

            ActualizarEmpleados(empleado, this.props.setShowSpinner).then(result => {
                switch (result.status) {
                    case 200:
                        this.Notificacion('Empleado actualizado', <MdInfo />, 'success', 1000);
                        this.handleClickConsultarEmpleados();
                        break;
                    case 404:
                        this.Notificacion('No se encontró el empleado', <MdInfo />, 'error', 1000);
                        break;
                    default:
                        this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                        break;
                }
            })
        }
    }

    handleFechaCumpleanosChange = (date, fechaCorta) => {
        this.setState({ fechaCumpleañosInput: date, fechaCumpleaños: fechaCorta })
    }

    handleClickConsultarEmpleados = () => {
        this.setState({ ...initialState })
        const { propiedadHorizontal } = this.props;
        GetEmpleados(propiedadHorizontal.id, this.props.setShowSpinner).then(result => {
            switch (result.status) {
                case 200:
                    this.setState({ empleados: result.data, })
                    break;
                case 404:
                    this.setState({ empleados: [] })
                    this.Notificacion('No se encontró el empleado', <MdInfo />, 'error', 1000);
                    break;
                default:
                    this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                    break;
            }
        })
    }

    render() {
        const { fileUrl, textoSubidaArchivo, fileName, identificacion, nombre, cargo, fechaCumpleañosInput
            , horaInicioTurno, horaFinTurno, botonSubirDisable, empleados, isActualizacion } = this.state;
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
                                        <Label sm={4} for="identificacion" >Documento *</Label>
                                        <Col sm={8} >
                                            <Input
                                                required
                                                autoFocus
                                                id='identificacion'
                                                type="text"
                                                name='identificacion'
                                                value={identificacion}
                                                placeholder="Ingrese # de identificación"
                                                onChange={this.handleChange}
                                                autocomplete="off"
                                                onKeyPress={this.HandleKeyPressTextoNumeros}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col xl={6} lg={6} md={12} sm={12}>
                                    <FormGroup row>
                                        <Label sm={4} for="nombre" >Nombre *</Label>
                                        <Col sm={8} >
                                            <Input
                                                required
                                                id='nombre'
                                                type="text"
                                                name='nombre'
                                                value={nombre}
                                                placeholder="Ingrese el nombre"
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
                                        <Label sm={4} for="cargo" >Cargo *</Label>
                                        <Col sm={8} >
                                            <Input
                                                required
                                                id='cargo'
                                                type="text"
                                                name='cargo'
                                                value={cargo}
                                                placeholder="Ingrese el cargo"
                                                onChange={this.handleChange}
                                                autocomplete="off"
                                                onKeyPress={this.HandleKeyPressTextoNumeros}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Col xl={6} lg={6} md={12} sm={12} >
                                        <FormGroup row>
                                            <Label sm={4} for="cargo" >Fecha nacimiento</Label>
                                            <KeyboardDatePicker
                                                sm={8}
                                                margin="none"
                                                id="fechaCumpleañosInput"
                                                label={fechaCumpleañosInput == null ? 'Fecha nacimiento' : ''}
                                                format="yyyy/MM/dd"
                                                value={fechaCumpleañosInput}
                                                onChange={this.handleFechaCumpleanosChange}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                </MuiPickersUtilsProvider>
                            </Row>
                            <Row>
                                <Col xl={6} lg={6} md={12} sm={12}>
                                    <FormGroup row>
                                        <Label sm={5} for="horaInicioTurno" >Hora inicio turno *</Label>
                                        <Col sm={7} >
                                            <Input
                                                required
                                                autoFocus
                                                id='horaInicioTurno'
                                                type="text"
                                                name='horaInicioTurno'
                                                value={horaInicioTurno}
                                                placeholder="Ejemplo: 7 AM"
                                                onChange={this.handleChange}
                                                autocomplete="off"
                                                onKeyPress={this.HandleKeyPressTextoNumeros}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col xl={6} lg={6} md={12} sm={12}>
                                    <FormGroup row>
                                        <Label sm={5} for="horaFinTurno" >Hora fin turno *</Label>
                                        <Col sm={7} >
                                            <Input
                                                required
                                                id='horaFinTurno'
                                                type="text"
                                                name='horaFinTurno'
                                                value={horaFinTurno}
                                                placeholder="Ejemplo: 7 PM"
                                                onChange={this.handleChange}
                                                autocomplete="off"
                                                onKeyPress={this.HandleKeyPressTextoNumeros}
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
                                        <Label sm={4} for="cargo" ></Label>
                                        <Col sm={8} >

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
                                        <Button color="info" onClick={this.handleClickConsultarEmpleados} outline>Consultar</Button>
                                    </FormGroup>
                                </Col>
                                <Col xl={3} lg={3} md={12} sm={12}>
                                    <FormGroup row>
                                        <Button color="info" type="submit" outline>{isActualizacion ? 'Actualizar' : 'Guardar'}</Button>
                                    </FormGroup>
                                </Col>
                            </Row>
                            {empleados.length > 0 &&
                                <Row style={styles.tabla}>
                                    {empleados.length > 0 &&
                                        <AdministrarEmpleadosTabla
                                            rows={empleados}
                                            handleClickBorrar={this.handleClickBorrar}
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


export default connect(mapStateToProps, mapDispatchToProps)(AdministrarEmpleados);
