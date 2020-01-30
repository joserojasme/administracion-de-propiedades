import Page from 'components/Page';
import React, { Fragment } from 'react';
import { MdError, MdInfo } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { CrearPropiedad } from '../api/api';
import { SetPropiedadesHorizontales, SetPropiedadHorizontal, SetShowSpinner } from '../reducers/actions/HorizontalProperties';
import { NOTIFICATION_SYSTEM_STYLE } from '../utils/constants';
import { handleKeyPressNumeros, handleKeyPressTexto, handleKeyPressTextoEmail, HandleKeyPressTextoNumeros, tieneLetras } from '../utils/utilsFunctions';
import { SignUp } from '../cognito/amplifyMethods';
import Excel from '../assets/img/utils/excel.png';
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import SubirPropiedadesTabla from '../components/SubirPropiedadesTabla';

const initialState = {
    redirect: false,
    chipInmueble: '',
    idPropiedadHorizontal: '',
    idUsuario: '',
    matriculaInmobiliaria: '',
    tipoPropiedad: 'Apartamento',
    urlImagenPropiedad: "https://s3.us-east-2.amazonaws.com/miinc.com.co/media/logo_miinc_completo.png",
    torre: '',
    piso: '',
    nomenclatura: '',
    valorAdministracion: '',
    administracionAlDia: 1,
    nombrePropietario: '',
    identificacionPropietario: '',
    telefonoPropietario: '',
    celularPropietario: '',
    urlImagenPropietario: "https://www.logolynx.com/images/logolynx/03/039b004617d1ef43cf1769aae45d6ea2.png",
    identificacion: '',
    email: '',
    areaPrivada:'',
    propiedad: {},
    propietario: {},
    formControlIsError: false,
    botonSubirDisable: true,
    textoSubidaArchivo: 'Subir excel',
    filasExcel: [],
    tipoCargaExcel: false
}

const regEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const style = {
    manualmenteLabel: { cursor: 'pointer', textDecoration: 'underline' },
    tabla: {
        height: '500px',
        overflowY: 'auto'
    }
};

class AdministrarPropiedades extends React.Component {
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
        const { userAttributes } = this.props;
        if (userAttributes.grupo !== undefined) {
            if (userAttributes.grupo[0] === "porteria") {
                this.setState({ redirect: true });
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

    handleClickCrear = (event) => {
        event.preventDefault();
        const { formControlIsError, identificacionPropietario, email, areaPrivada } = this.state;
        const { propiedadHorizontal, propiedadesHorizontales } = this.props;

        if(tieneLetras(areaPrivada)){
            this.Notificacion('Area privada debe ser númerica', <MdError />, 'error', 1000);
            return;
        }

        if (formControlIsError) {
            this.Notificacion('Email con formato inválido', <MdError />, 'error', 1000);
            return;
        }

        if (identificacionPropietario.length < 6) {
            this.Notificacion('El número identificación debe ser al menos de 6 caracteres', <MdError />, 'error', 1000);
            return;
        }

        this.setState({ idPropiedadHorizontal: propiedadHorizontal.id, idUsuario: propiedadesHorizontales.copropietario.id }, () => {
            let identificacion = identificacionPropietario;
            let crearPropiedadObject = new Object({ "propiedad": this.state, "propietario": { "identificacion": identificacion, "email": email } })
            let arrayPropiedad = [];
            arrayPropiedad.push(crearPropiedadObject);

            CrearPropiedad(arrayPropiedad, this.props.setShowSpinner).then(result => {
                switch (result.status) {
                    case 200:
                        this.Notificacion('Propiedad creada...', <MdInfo />, 'success', 1000);
                        // let data = new Object({
                        //     username: identificacion,
                        //     password: identificacion,
                        //     email: email,
                        //     userid: identificacion
                        // });

                        // SignUp(data).then(result => {
                        //     switch (result.code) {
                        //         case 'SUCCESS':
                        //             this.Notificacion('Usuario creado', <MdInfo />, 'success', 1000);
                        //             break;
                        //         case 'InvalidPasswordException':
                        //             this.Notificacion('La contraseña es incorrecta', <MdError />, 'error', 1000);
                        //             break;
                        //         case 'UsernameExistsException':
                        //             this.Notificacion('El usuario ya existe', <MdError />, 'error', 1000);
                        //             break;
                        //         default:
                        //             this.Notificacion('Error desconocido', <MdError />, 'error', 1000);
                        //             break;
                        //     }
                        // })
                        break;
                    case 404:
                        this.Notificacion('No se encontró la propiedad', <MdInfo />, 'error', 1000);
                        break;
                    default:
                        this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 1000);
                        break;
                }
            })
        })

    }

    handleChangeTipoPropiedad = (event) => {
        let value = event.target.value;
        this.setState({ tipoPropiedad: value })
    }

    handleKeyPressTextoEmail = (event) => {
        if (!handleKeyPressTextoEmail(event)) {
            event.preventDefault();
        }
    }

    handleChangeEmail = (event) => {
        this.setState({ email: event.target.value, formControlIsError: false }, () => {
            if (!regEmail.test(this.state.email)) {
                this.setState({ formControlIsError: true });
            }
        });
    }

    handleClickExcel = (event) => {
        const file = event.target.files[0];
        if (file == undefined) return;

        if (file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            this.Notificacion('El formato del archivo es inválido', <MdError />, 'error', 1000);
            this.setState({
                botonSubirDisable: true,
                textoSubidaArchivo: 'Tipo no permitido',
                file: '',
                fileName: '',
            })
            return;
        }

        ExcelRenderer(file, (err, resp) => {
            if (err) {
                this.Notificacion('Error validando el archivo', <MdError />, 'error', 1000);
                this.setState({
                    botonSubirDisable: true,
                    textoSubidaArchivo: 'Subir excel',
                    file: '',
                    fileName: '',
                })
            }
            else {
                let filas = this.validarFilasExcel(this.obtenerFilasExcel(resp));
                this.setState({
                    file,
                    fileName: file.name,
                    textoSubidaArchivo: 'Archivo sin subir',
                    botonSubirDisable: false,
                    filasExcel: filas
                })
            }
        });
    }

    obtenerFilasExcel = (data) => {
        let filas = [];
        data.rows.map((item, i) => {
            if (i > 1) {
                filas.push(item)
            }
        })
        return filas;
    }

    validarFilasExcel = (filas) => {
        let newFilas = new Array();

        const { urlImagenPropiedad, urlImagenPropietario } = this.state;
        const { propiedadHorizontal, propiedadesHorizontales } = this.props;

        filas.map(item => {
            let objectoCreacion = new Object();
            let mensajesError = new Array();
            if (item[0] === '' || item[1] === '' || item[2] === '' || item[5] === '' || item[6] === '' || item[8] === '' || item[9] === '' || item[10] === '' || item[11] === '') {
                mensajesError.push('Faltan campos obligatorios - ');
            }

            if (item[0] === undefined || item[1] === undefined || item[2] === undefined || item[5] === undefined || item[6] === undefined || item[8] === undefined || item[9] === undefined || item[10] === undefined || item[11] === undefined) {
                mensajesError.push('Faltan campos obligatorios - ');
            }

            if(tieneLetras(item[10])){
                mensajesError.push('Valor administración debe ser numérico -');
            }

            if(tieneLetras(item[11])){
                mensajesError.push('Area privada debe ser numérico -');
            }

            if (!regEmail.test(item[9])) {
                mensajesError.push('El email no tiene un formato valido -');
            }

            if (item[6].length < 6) {
                this.Notificacion('El número identificación copropietario debe ser al menos de 6 caracteres', <MdError />, 'error', 1000);
                return;
            }

            let conErrores = false;
            if (mensajesError.length > 0) {
                conErrores = true;
            }

            objectoCreacion.conErrores = conErrores;
            objectoCreacion.mensajes = mensajesError;
            objectoCreacion.chipInmueble = item[1];
            objectoCreacion.idPropiedadHorizontal = propiedadHorizontal.id;
            objectoCreacion.idUsuario = propiedadesHorizontales.copropietario.id;
            objectoCreacion.matriculaInmobiliaria = item[1];
            objectoCreacion.tipoPropiedad = item[0];
            objectoCreacion.urlImagenPropiedad = urlImagenPropiedad;
            objectoCreacion.torre = item[3];
            objectoCreacion.piso = item[4];
            objectoCreacion.nomenclatura = item[2];
            objectoCreacion.valorAdministracion = 0;
            objectoCreacion.administracionAlDia = 1;
            objectoCreacion.nombrePropietario = item[5];
            objectoCreacion.identificacionPropietario = item[6];
            objectoCreacion.telefonoPropietario = item[7];
            objectoCreacion.celularPropietario = item[8];
            objectoCreacion.urlImagenPropietario = urlImagenPropietario;
            objectoCreacion.identificacion = item[6];
            objectoCreacion.email = item[9];
            objectoCreacion.estadoCarga = 'No cargado';
            objectoCreacion.estadoUsuario = 'No creado';
            objectoCreacion.valorAdministracion = item[10];
            objectoCreacion.areaPrivada = item[11];

            newFilas.push(objectoCreacion);
        })

        return newFilas;
    }

    cargarExcel = (event) => {
        event.preventDefault();
        const { filasExcel } = this.state;
        if (filasExcel.length === 0) {
            this.Notificacion('No hay datos a cargar', <MdError />, 'error', 1000);
            return;
        }

        let filasExcelResult = [];
        filasExcel.map(async item => {
            if (!item.conErrores) {
                let filaExcel = new Object(item);
                let crearPropiedadObject = new Object({ "propiedad": item, "propietario": { "identificacion": item.identificacion, "email": item.email } })
                let arrayPropiedad = [];
                arrayPropiedad.push(crearPropiedadObject);

                await CrearPropiedad(arrayPropiedad, this.props.setShowSpinner).then(async result => {
                    switch (result.status) {
                        case 200:
                                filaExcel.estadoCarga = `${result.data.propiedades[0].estado} ${result.data.propiedades[0].descripcionEstado === null ? '' : result.data.propiedades[0].descripcionEstado}`;
                            let data = new Object({
                                username: item.identificacion.toString(),
                                password: item.identificacion.toString(),
                                email: item.email,
                                userid: item.identificacion.toString()
                            });
                            await SignUp(data).then(result => {
                                switch (result.code) {
                                    case 'SUCCESS':
                                            filaExcel.estadoUsuario = 'Usuario creado';
                                        break;
                                    case 'InvalidPasswordException':
                                            filaExcel.estadoUsuario = 'La contraseña es incorrecta';
                                        break;
                                    case 'UsernameExistsException':
                                            filaExcel.estadoUsuario = 'Usuario ya existe';
                                        break;
                                    default:
                                            filaExcel.estadoUsuario = 'Error desconocido';
                                        break;
                                }
                            })
                            break;
                        case 404:
                                filaExcel.estadoCarga = 'Propiedad no encontrada';
                            break;
                        default:
                                filaExcel.estadoCarga = 'Error desconocido';
                            break;
                    }
                })
                filasExcelResult.push(filaExcel);
                this.setState({botonSubirDisable:true, textoSubidaArchivo:'Archivo cargado', filasExcel: filasExcelResult})
            }
            
        })
    }
    render() {
        const { redirect,
            chipInmueble,
            torre,
            piso,
            nomenclatura,
            nombrePropietario,
            identificacionPropietario,
            telefonoPropietario,
            celularPropietario,
            email,
            formControlIsError, botonSubirDisable, textoSubidaArchivo, tipoCargaExcel, filasExcel,valorAdministracion, areaPrivada } = this.state;
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
                            <CardBody className="w-100">
                                <Row>
                                    <Col xl={12} lg={12} md={12} sm={12}>
                                        <Card>
                                            <CardHeader >CREACIÓN DE PROPIEDADES - Descarga el <a style={style.manualmenteLabel} onClick={() => { this.setState({ tipoCargaExcel: true }) }}>excel</a> para subir las propiedades <a onClick={() => { this.setState({ tipoCargaExcel: true }) }} href='https://s3.us-east-2.amazonaws.com/miinc.com.co/media/Cargue%2Bde%2Bpropiedades%2BMIINC.xlsx' target='_blank'>
                                                <img src={Excel} /></a> ó cárguelas <a style={style.manualmenteLabel} onClick={() => { this.setState({ tipoCargaExcel: false }) }}>manualmente</a></CardHeader>
                                            <CardBody>
                                            <Label sm={12}  className="mb-4">Favor tenga en cuenta que el usuario del copropietario se creara con la información ingresada en el campo identificación propietario.</Label>
                                                {tipoCargaExcel === false &&
                                                    <Form onSubmit={this.handleClickCrear}>
                                                        <Row>
                                                            <Col xl={6} lg={6} md={12} sm={12}>
                                                                <FormGroup row>
                                                                    <Label sm={4} for="tipoPropiedad" >Tipo propiedad:</Label>
                                                                    <Col sm={8} >
                                                                        <Input type="select" name="select" onChange={this.handleChangeTipoPropiedad}>
                                                                            {
                                                                                tipoPropiedadList.length > 0 &&
                                                                                tipoPropiedadList.map(tipo => {
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
                                                            <Col xl={6} lg={6} md={12} sm={12}>
                                                                <FormGroup row>
                                                                    <Label sm={3} for="chipInmueble" >Chip inmueble *</Label>
                                                                    <Col sm={9} >
                                                                        <Input
                                                                            required
                                                                            autoFocus
                                                                            id='chipInmueble'
                                                                            type="text"
                                                                            name='chipInmueble'
                                                                            value={chipInmueble}
                                                                            placeholder="Ingrese el chip"
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
                                                                    <Label sm={6} for="nomenclatura" >Nomenclatura de la propiedad *</Label>
                                                                    <Col sm={6} >
                                                                        <Input
                                                                            required
                                                                            id='nomenclatura'
                                                                            type="text"
                                                                            name='nomenclatura'
                                                                            value={nomenclatura}
                                                                            placeholder="Ingrese la nomenclatura"
                                                                            onChange={this.handleChange}
                                                                            autocomplete="off"
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col xl={3} lg={3} md={12} sm={12}>
                                                                <FormGroup row>
                                                                    <Label sm={4} for="torre" >Torre </Label>
                                                                    <Col sm={8} >
                                                                        <Input
                                                                            id='torre'
                                                                            type="text"
                                                                            name='torre'
                                                                            value={torre}
                                                                            placeholder="Ingrese torre"
                                                                            onChange={this.handleChange}
                                                                            autocomplete="off"
                                                                            onKeyPress={this.HandleKeyPressTextoNumeros}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col xl={3} lg={3} md={12} sm={12}>
                                                                <FormGroup row>
                                                                    <Label sm={4} for="piso" >Piso </Label>
                                                                    <Col sm={8} >
                                                                        <Input
                                                                            id='piso'
                                                                            type="text"
                                                                            name='piso'
                                                                            value={piso}
                                                                            placeholder="Ingrese el piso"
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
                                                                    <Label sm={4} for="valorAdministracion" >Valor administración *</Label>
                                                                    <Col sm={8} >
                                                                        <Input
                                                                            required
                                                                            id='valorAdministracion'
                                                                            type="text"
                                                                            name='valorAdministracion'
                                                                            value={valorAdministracion}
                                                                            placeholder="Ingrese el valor"
                                                                            onChange={this.handleChange}
                                                                            autocomplete="off"
                                                                            onKeyPress={this.handleKeyPressNumeros}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col xl={6} lg={6} md={12} sm={12}>
                                                                <FormGroup row>
                                                                    <Label sm={6} for="areaPrivada" >Area privada *</Label>
                                                                    <Col sm={6} >
                                                                        <Input
                                                                            required
                                                                            id='areaPrivada'
                                                                            type="text"
                                                                            name='areaPrivada'
                                                                            value={areaPrivada}
                                                                            placeholder="Ingrese el area"
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
                                                                    <Label sm={4} for="nombrePropietario" >Nombre propietario *</Label>
                                                                    <Col sm={8} >
                                                                        <Input
                                                                            required
                                                                            autoFocus
                                                                            id='nombrePropietario'
                                                                            type="text"
                                                                            name='nombrePropietario'
                                                                            value={nombrePropietario}
                                                                            placeholder="Ingrese el nombre del propietario"
                                                                            onChange={this.handleChange}
                                                                            autocomplete="off"
                                                                            onKeyPress={this.handleKeyPressTexto}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col xl={6} lg={6} md={12} sm={12}>
                                                                <FormGroup row>
                                                                    <Label sm={6} for="identificacionPropietario" ># identificacion propietario *</Label>
                                                                    <Col sm={6} >
                                                                        <Input
                                                                            required
                                                                            autoFocus
                                                                            id='identificacionPropietario'
                                                                            type="text"
                                                                            name='identificacionPropietario'
                                                                            value={identificacionPropietario}
                                                                            placeholder="Ingrese # identificación"
                                                                            onChange={this.handleChange}
                                                                            autocomplete="off"
                                                                            onKeyPress={this.HandleKeyPressTextoNumeros}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col xl={4} lg={4} md={12} sm={12}>
                                                                <FormGroup row>
                                                                    <Label sm={4} for="telefonoPropietario" >Teléfono</Label>
                                                                    <Col sm={8} >
                                                                        <Input
                                                                            id='telefonoPropietario'
                                                                            type="text"
                                                                            name='telefonoPropietario'
                                                                            value={telefonoPropietario}
                                                                            placeholder="Ingrese teléfono propietario"
                                                                            onChange={this.handleChange}
                                                                            autocomplete="off"
                                                                            onKeyPress={this.HandleKeyPressTextoNumeros}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col xl={4} lg={4} md={12} sm={12}>
                                                                <FormGroup row>
                                                                    <Label sm={4} for="celularPropietario" >Celular *</Label>
                                                                    <Col sm={8} >
                                                                        <Input
                                                                            required
                                                                            id='celularPropietario'
                                                                            type="text"
                                                                            name='celularPropietario'
                                                                            value={celularPropietario}
                                                                            placeholder="Ingrese celular administrador"
                                                                            onChange={this.handleChange}
                                                                            autocomplete="off"
                                                                            onKeyPress={this.handleKeyPressNumeros}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col xl={4} lg={4} md={12} sm={12}>
                                                                <FormGroup row>
                                                                    <Label sm={4} for="email" >Email *</Label>
                                                                    <Col sm={8} >
                                                                        <Input
                                                                            required
                                                                            style={formControlIsError ? { border: "2px solid red" } : null}
                                                                            id='email'
                                                                            type="text"
                                                                            name='email'
                                                                            value={email}
                                                                            placeholder="Ingrese el email"
                                                                            onChange={this.handleChangeEmail}
                                                                            autocomplete="off"
                                                                            onKeyPress={this.handleKeyPressTextoEmail}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <CardBody>
                                                            <Row>
                                                                <Col xl={3} lg={3} md={12} sm={12}>
                                                                    <Button color="info" outline>
                                                                        Crear propiedad
                                                        </Button>
                                                                </Col>

                                                            </Row>
                                                        </CardBody>
                                                    </Form>
                                                }
                                                {tipoCargaExcel === true &&
                                                    <Form>

                                                        <Row>
                                                            <Col xl={4} lg={4} md={12} sm={12}>
                                                                <div className="input-group">
                                                                    <div className="input-group-prepend">
                                                                        <Button disabled={botonSubirDisable} color="info" onClick={this.cargarExcel} outline={textoSubidaArchivo == 'Archivo sin subir' ? false : true}>
                                                                            Subir
                                                        </Button>
                                                                    </div>
                                                                    <div className="custom-file">
                                                                        <input accept=".xlsx,.xls" type="file" style={{ "padding": "10px" }} className="custom-file-input" id="urlImagen"
                                                                            onChange={this.handleClickExcel} />
                                                                        <label class="custom-file-label" for="inputGroupFile01">{textoSubidaArchivo}</label>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </Row>

                                                        <Row style={style.tabla}>
                                                            {filasExcel.length > 0 &&
                                                                <SubirPropiedadesTabla
                                                                    rows={filasExcel}
                                                                />
                                                            }
                                                        </Row>

                                                    </Form>
                                                }
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


export default connect(mapStateToProps, mapDispatchToProps)(AdministrarPropiedades);


let tipoPropiedadList = [
    'Apartamento',
    'Bodega',
    'Casa',
    'Cuarto útil',
    'Local',
    'Oficina',
    'Otros',
    'Parqueadero'
]
