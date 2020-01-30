import News from 'components/News';
import Page from 'components/Page';
import Personal from 'components/Personal';
import { IconWidget } from 'components/Widget';
import React, { Fragment } from 'react';
import { MdCall, MdError, MdInfo, MdPersonPin, MdRateReview, MdPeople } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardHeader, Col, Row, ButtonGroup } from 'reactstrap';
import { GetPqrs, GetPropiedadesTableroControl, NoticiaVista, GetNoticiasVistas, GuardarReinvitar, GetReinvitar, ActualizarReinvitar } from '../api/api';
import EventCalendar from '../components/EventCalendar';
import NoticiasModal from '../components/Modals/NoticiasModal';
import PqrsModal from '../components/Modals/PqrsModal';
import ActualizarPropiedadModal from '../components/Modals/ActualizarPropiedadModal';
import ActualizarPerfilesModal from '../components/Modals/ActualizarPerfilesModal';
import PropertiesModal from '../components/Modals/PropertiesModal';
import ZonasComunesModal from '../components/Modals/ZonasComunesModal';
import Properties from '../components/Properties';
import ZonasComunes from '../components/ZonasComunes';
import { SetShowPropiedadesHorizontalesModal, SetShowSpinner } from '../reducers/actions/HorizontalProperties';
import { NOTIFICATION_SYSTEM_STYLE } from '../utils/constants';
import PrqsAdministrador from '../components/PqrsAdministrador';
import TableroControl from '../components/TableroControl';
import PqrsAdministradorModal from '../components/Modals/PqrsAdministradorModal';
import NoticiasVistasModal from '../components/Modals/NoticiasVistasModal';
import { SignUp } from '../cognito/amplifyMethods';

const style = {
  cardBody: {
    maxHeight: '100%',
    height: '100%',
    overflowY: 'auto',
    overflowX: 'auto'
  },
  etiqueta: {
    textDecoration: 'none'
  },
  widget: {
    cursor: 'pointer'
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPropertiesModal: false,
      showNoticiasModal: false,
      showZonasComunesModal: false,
      showPqrsAdministradorModal: false,
      propertiesArray: [],
      horizontalPropertieNameModal: '',
      noticia: {},
      idZonaComun: '',
      showPqrsModal: false,
      mostrarPQRS: false,
      pqrs: [],
      pqrsGestionar: {},
      mostrarTablero: false,
      propiedadesTableroControl: [],
      openNoticiasVistasModal: false,
      noticiasVistas: [],
      showActualizarPropiedadModal: false,
      propiedadActualizar: {},
      showActualizarPerfilesModal: false
    }
    this.handleClickShowProperties = this.handleClickShowProperties.bind(this);
    this.handleClickNoticia = this.handleClickNoticia.bind(this);
    this.handleClickZonaComun = this.handleClickZonaComun.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({ pqrs: [], mostrarPQRS: false })
  }

  componentDidMount() {
    const { propiedadesHorizontales } = this.props;
    if (Object.entries(propiedadesHorizontales).length !== 0) {
      GuardarReinvitar(propiedadesHorizontales.copropietario.id);
    }
  }



  handleClickShowProperties = (value, horizontalPropertieNameModal) => {
    if (value.length > 0) {
      this.setState({ propertiesArray: value, horizontalPropertieNameModal: horizontalPropertieNameModal, showPropertiesModal: true })
    } else {
      this.Notificacion('Sin propiedades en la unidad', <MdError />, 'error', 500)
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

  handleClickHideProperties = () => {
    this.setState({ propertiesArray: [], showPropertiesModal: false, horizontalPropertieNameModal: '' })
  }

  handleClickNoticia = (event) => {
    let value = event.target.value
    value = value.split("**", 4);

    this.marcarNoticiaVista(value[3]);
    let noticia = {
      titulo: value[1],
      fecha: value[0],
      urlImagen: value[2],
      descripcion: event.target.id
    }
    this.setState({ showNoticiasModal: true, noticia: noticia })
  }

  marcarNoticiaVista = async (idNoticia) => {
    var noticiasVistas = [];
    var noticiaVista = {}
    const { propiedadHorizontal } = this.props;
    if (propiedadHorizontal.tblPropiedades.length > 0) {
      await propiedadHorizontal.tblPropiedades.map(item => {
        noticiaVista = {
          "idPropiedad": item.id,
          "idNoticia": idNoticia
        }
        noticiasVistas.push(noticiaVista);
      })

      await NoticiaVista(noticiasVistas, this.props.setShowSpinner).then(result => {
        switch (result.status) {
          case 200:
            this.Notificacion('Noticia marcada como vista', <MdInfo />, 'success', 500);
            break;
          case 404:
            this.Notificacion('No se encontraron noticias', <MdInfo />, 'error', 500);
            break;
          default:
            this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 500);
            break;
        }
      })
    }

  }

  handleCloseNoticiasVistasModal = () => {
    this.setState({ openNoticiasVistasModal: false });
  }

  handleClickEditarPropiedad = (event) => {
    const { propiedadesTableroControl } = this.state;
    let propiedad = propiedadesTableroControl.filter(item => {
      return item.id == event.target.value
    })

    this.setState({ showActualizarPropiedadModal: true, propiedadActualizar: propiedad[0] })
  }

  handleClickEditarUsuarios = (event) => {
    const { propiedadesTableroControl } = this.state;
    let propiedad = propiedadesTableroControl.filter(item => {
      return item.id == event.target.value
    })

    this.setState({ showActualizarPerfilesModal: true, propiedadActualizar: propiedad[0] })
  }

  handleOpenNoticiasVistasModal = async (event) => {
    const { propiedadHorizontal } = this.props;
    if (propiedadHorizontal.tblNoticias.length < 1) {
      return;
    }

    await GetNoticiasVistas(event.target.value, this.props.setShowSpinner).then(result => {
      switch (result.status) {
        case 200:
          this.setState({ noticiasVistas: result.data, openNoticiasVistasModal: true })
          break;
        case 404:
          this.Notificacion('No se encontraron noticias', <MdInfo />, 'error', 500);
          break;
        default:
          this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 500);
          break;
      }
    })
  }

  handleCloseNoticiasModal = () => {
    this.setState({ showNoticiasModal: false });
  }

  handleClickZonaComun = (event) => {
    let value = event.target.value

    this.setState({ idZonaComun: value, showZonasComunesModal: true, })
  }

  handleCloseZonaComunModal = () => {
    this.setState({ showZonasComunesModal: false });
  }

  handleClosePqrsModal = () => {
    this.setState({ showPqrsModal: false });
  }

  handleCloseActualizarPropiedadModal = () => {
    this.setState({ showActualizarPropiedadModal: false });
    this.handleClickVerTableroDeControl();
  }

  handleCloseActualizarPerfilesModal = () => {
    this.setState({ showActualizarPerfilesModal: false });
    this.handleClickVerTableroDeControl();
  }

  handleOpenPqrsModal = () => {
    this.setState({ showPqrsModal: true });
  }

  handleClosePqrsAdministradorModal = () => {
    this.setState({ showPqrsAdministradorModal: false }, () => {
      this.handleClickVerGestionarPQRS();
    });
  }

  handleOpenPqrsAdministradorModal = () => {
    this.setState({ showPqrsAdministradorModal: true });
  }

  handleClickVerGestionarPQRS = () => {
    const { propiedadHorizontal } = this.props;
    GetPqrs(propiedadHorizontal.id, this.props.setShowSpinner, 'propiedadHorizontal').then(result => {
      switch (result.status) {
        case 200:
          this.setState({ pqrs: result.data, mostrarPQRS: true })
          break;
        case 404:
          this.Notificacion('No se encontraron pqrs', <MdInfo />, 'error', 500);
          break;
        default:
          this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 500);
          break;
      }
    })
  }

  handleClickModificarPqr = async (event) => {
    let value = event.target.value;
    const { pqrs } = this.state;

    let arrayPqrs = [];
    await pqrs.filter(item => {
      item.tblPqrs.filter(data => {
        arrayPqrs.push(data);
      })
    })

    let pqrsGestionar = await arrayPqrs.filter(item => {
      return item.id == value
    })

    this.setState({ pqrsGestionar: pqrsGestionar }, () => {
      this.setState({ showPqrsAdministradorModal: true })
    })
  }

  handleClickVerTableroDeControl = () => {
    const { propiedadHorizontal } = this.props;
    GetPropiedadesTableroControl(propiedadHorizontal.id, this.props.setShowSpinner).then(result => {
      switch (result.status) {
        case 200:
          this.setState({ propiedadesTableroControl: result.data, mostrarTablero: true })
          break;
        case 404:
          this.Notificacion('No se encontraron propiedades', <MdInfo />, 'error', 500);
          break;
        default:
          this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 500);
          break;
      }
    })
  }

  handleClickInvitarTodos = () => {
    const { propiedadHorizontal } = this.props;
    GetReinvitar(propiedadHorizontal.id, this.props.setShowSpinner).then(result => {
      switch (result.status) {
        case 200:
          this.handleClickInvitar(result.data);
          break;
        case 404:
          this.Notificacion('No se pudo obtener las propiedades', <MdInfo />, 'error', 500);
          break;
        default:
          this.Notificacion('No se pudo obtener las propiedades', <MdError />, 'error', 500);
          break;
      }
    })
  }

  handleClickInvitar = (data) => {
    data.map(item=>{
      if (item.copropietariosPropiedades.invitadoApp === 0) {
          this.CrearUsuarioCognito(item.copropietarios.usuarioCognito, item.copropietarios.email, item.copropietariosPropiedades.id);
      }

      if (item.copropietariosPropiedades.invitadoApp === 1) {
          this.Reinvitar(item.copropietariosPropiedades.id);
      }
    })
}

Reinvitar = (idCopropietarioPropiedad) => {
    ActualizarReinvitar(idCopropietarioPropiedad, this.props.setShowSpinner).then(result => {
        switch (result.status) {
            case 200:
                break;
            case 404:
                this.Notificacion('No se encontró el usuario', <MdInfo />, 'error', 10);
                break;
            default:
                this.Notificacion('Ha ocurrido un error', <MdError />, 'error', 10);
                break;
        }
    })
}

CrearUsuarioCognito = (usuarioCognito, email, idCopropietarioPropiedad) => {
    let data = new Object({
        username: usuarioCognito,
        password: usuarioCognito,
        email: email,
        userid: usuarioCognito
    });
  
    SignUp(data).then(result => {
        switch (result.code) {
            case 'SUCCESS':
                this.Reinvitar(idCopropietarioPropiedad);
                this.Notificacion(`${usuarioCognito} creado e invitado`, <MdInfo />, 'success', 1000);
                break;
            case 'InvalidPasswordException':
                this.Notificacion('La contraseña es incorrecta', <MdError />, 'error', 1000);
                break;
            case 'UsernameExistsException':
                this.Reinvitar(idCopropietarioPropiedad);
                this.Notificacion(`${usuarioCognito} ya existe y fue notificado`, <MdError />, 'success', 1000);
                break;
            default:
                this.Notificacion(`${usuarioCognito} No creado`, <MdError />, 'error', 1000);
                break;
        }
    })
}

  render() {
    const { propiedadHorizontal, userAttributes, reservas } = this.props;
    const { showPropertiesModal, propertiesArray,
      horizontalPropertieNameModal, showNoticiasModal,
      noticia, showZonasComunesModal, idZonaComun, showPqrsModal, mostrarPQRS,
      pqrs, showPqrsAdministradorModal, pqrsGestionar, mostrarTablero, propiedadesTableroControl
      , openNoticiasVistasModal, noticiasVistas, showActualizarPropiedadModal, propiedadActualizar, showActualizarPerfilesModal } = this.state;
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
        <PropertiesModal open={showPropertiesModal} horizontalPropertieNameModal={horizontalPropertieNameModal} propertiesArray={propertiesArray} onClick={this.handleClickHideProperties} />
        {Object.entries(noticia).length !== 0 &&
          showNoticiasModal &&
          <NoticiasModal open={showNoticiasModal} noticia={noticia} closeModal={() => this.handleCloseNoticiasModal()} />
        }

        {Object.entries(noticiasVistas).length !== 0 &&
          openNoticiasVistasModal &&
          <NoticiasVistasModal open={openNoticiasVistasModal} noticiasVistas={noticiasVistas} closeModal={() => this.handleCloseNoticiasVistasModal()} />
        }


        <Row>

          {showZonasComunesModal &&
            <ZonasComunesModal open={showZonasComunesModal} idZonaComun={idZonaComun} closeModal={() => this.handleCloseZonaComunModal()} />
          }

          {showPqrsAdministradorModal &&
            <PqrsAdministradorModal open={showPqrsAdministradorModal} pqrs={pqrsGestionar} closeModal={() => this.handleClosePqrsAdministradorModal()} />
          }

          {userAttributes.grupo === undefined &&
            <Fragment>
              <Col lg={6} md={6} sm={12} xs={12}>
                <a style={style.etiqueta} href={`tel:${propiedadHorizontal.telefono}`}><IconWidget style={style.widget}
                  bgColor="primary"
                  inverse={true}
                  icon={MdCall}
                  title="Llamar al administrador"
                  subtitle={propiedadHorizontal.nombreAdministrador}
                /></a>
              </Col>

              <Col lg={6} md={6} sm={12} xs={12}>
                <IconWidget style={style.widget}
                  bgColor="primary"
                  inverse={true}
                  icon={MdRateReview}
                  title="Ver o crear PQR"
                  subtitle={`Unidad ${propiedadHorizontal.nombre}`}
                  onClick={this.handleOpenPqrsModal}
                />
              </Col>
            </Fragment>
          }

          {userAttributes.grupo !== undefined &&
            userAttributes.grupo[0] == "porteria" &&
            <Fragment>
              <Col lg={4} md={4} sm={12} xs={12}>
                <a style={style.etiqueta} href={`tel:${propiedadHorizontal.telefono}`}><IconWidget style={style.widget}
                  bgColor="primary"
                  inverse={true}
                  icon={MdCall}
                  title="Llamar al administrador"
                  subtitle={propiedadHorizontal.nombreAdministrador}
                /></a>
              </Col>

              <Col lg={4} md={4} sm={12} xs={12}>
                <a style={style.etiqueta} href={`tel:123`}><IconWidget style={style.widget}
                  bgColor="success"
                  inverse={true}
                  icon={MdCall}
                  title="Policia"
                  subtitle='Llamar'
                /></a>
              </Col>

              <Col lg={4} md={4} sm={12} xs={12}>
                <a style={style.etiqueta} href={`tel:123`}><IconWidget style={style.widget}
                  bgColor="danger"
                  inverse={true}
                  icon={MdCall}
                  title="Bomberos"
                  subtitle='Llamar'
                /></a>
              </Col>
            </Fragment>
          }

          {userAttributes.grupo !== undefined &&
            userAttributes.grupo[0] == "administradores" &&
            <Fragment>
              <Col lg={4} md={4} sm={12} xs={12}>
                <IconWidget style={style.widget}
                  bgColor="primary"
                  inverse={true}
                  icon={MdRateReview}
                  title="PQRS"
                  onClick={this.handleClickVerGestionarPQRS}
                  subtitle='Ver y gestionar'
                />
              </Col>

              <Col lg={4} md={4} sm={12} xs={12}>
                <IconWidget style={style.widget}
                  bgColor="primary"
                  inverse={true}
                  icon={MdPeople}
                  title="TABLERO DE CONTROL"
                  onClick={this.handleClickVerTableroDeControl}
                  subtitle='Ver'
                />
              </Col>

              <Col lg={4} md={4} sm={12} xs={12}>
                <a style={style.etiqueta} href={`tel:123`}><IconWidget style={style.widget}
                  bgColor="danger"
                  inverse={true}
                  icon={MdCall}
                  title="Bomberos"
                  subtitle='Llamar'
                /></a>
              </Col>
            </Fragment>
          }

        </Row>

        <Row style={mostrarTablero ? { display: 'block' } : { display: 'none' }}>
          <Col lg="12" md="12" sm="12" xs="12">
            <Card>
              <CardHeader>TABLERO DE CONTROL 
              <ButtonGroup>
                  <Button
                    color={'info'}
                    outline
                    onClick={this.handleClickInvitarTodos}
                  >
                    Invitar a todos
                  </Button>
                </ButtonGroup>
              </CardHeader>

              <CardBody style={style.cardBody}>
                <TableroControl
                  headers={[
                    'Administración Al Dia',
                    'Nomenclatura',
                    'Chip inmueble',
                    'Tipo Propiedad',
                    'Perfiles',
                    'Notificaciones',
                    'EditarPropiedad'
                  ]}
                  usersData={propiedadesTableroControl}
                  onClick={this.handleOpenNoticiasVistasModal}
                  onClickEditarPropiedad={this.handleClickEditarPropiedad}
                  onClickEditarUsuarios={this.handleClickEditarUsuarios}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row style={mostrarPQRS ? { display: 'block' } : { display: 'none' }}>
          <Col lg="12" md="12" sm="12" xs="12">
            <Card>
              <CardHeader>PQRS</CardHeader>
              <CardBody style={style.cardBody}>
                <PrqsAdministrador
                  headers={[
                    'Acción',
                    'Propiedad',
                    'Categoría',
                    'Título',
                    'Descripción',
                    'Estado',
                    'Fecha',
                    'Respuesta',
                    'Fecha Respuesta'
                  ]}
                  usersData={pqrs}
                  onClick={this.handleClickModificarPqr}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>



        <Row>
          {userAttributes.grupo === undefined &&
            <Col lg="6" md="6" sm="12" xs="12">
              <Card>
                <CardHeader>
                  <Button onClick={() => this.handleClickShowProperties(propiedadHorizontal.tblPropiedades, propiedadHorizontal.nombre)} color="info" outline className="mr-1" >
                    Propiedades
                                                        </Button>
                </CardHeader>
                <CardBody style={style.cardBody}>
                  {Object.entries(propiedadHorizontal).length !== 0 &&
                    propiedadHorizontal.tblPropiedades.map(propiedad => {
                      return (
                        <Fragment>
                          <Properties
                            key={propiedad.id}
                            image={propiedad.urlImagenPropiedad}
                            title={`${propiedad.tipoPropiedad} ${propiedad.nomenclatura}`}
                            description={propiedad.administracionAlDia}
                            right={propiedad.valorAdministracion}
                          />
                          <hr />
                        </Fragment>
                      )
                    })
                  }
                </CardBody>
              </Card>
            </Col>
          }

          {userAttributes.grupo !== undefined &&
            <Col lg="6" md="6" sm="12" xs="12">
              <Card>
                <CardHeader>Personal</CardHeader>
                <CardBody style={style.cardBody}>
                  <Personal
                    headers={[
                      <MdPersonPin size={25} />,
                      'Nombre',
                      'Cargo',
                      'Cumpleaños',
                      'Turno',
                    ]}
                    usersData={propiedadHorizontal.tblPersonal}
                  />
                </CardBody>
              </Card>
            </Col>
          }
          <Col lg="6" md="6" sm="12" xs="12">
            <Card >
              <CardHeader>
                <Button color="info" outline className="mr-1" >
                  Noticias
                                                        </Button>
              </CardHeader>
              <CardBody style={style.cardBody}>
                {Object.entries(propiedadHorizontal).length !== 0 &&
                  propiedadHorizontal.tblNoticias.map(noticia => (
                    noticia.visible ?
                      <Fragment>

                        <News
                          key={noticia.id}
                          image={''}
                          title={noticia.titulo}
                          description={noticia.descripcion}
                          urlImagen={noticia.urlImagen}
                          id={noticia.id}
                          right={noticia.fechaPublicacion}
                          onClick={this.handleClickNoticia}
                        />

                        <hr />
                      </Fragment>
                      : null
                  ),
                  )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="12" md="12" sm="12" xs="12">
            <Card>
              <CardHeader>Eventos y reservas zonas comunes</CardHeader>
              <CardBody>
                {Object.entries(reservas).length !== 0 &&
                  <EventCalendar eventos={reservas} />
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
        {userAttributes.grupo === undefined &&
          <Row>
            <Col lg="6" md="6" sm="12" xs="12">
              <Card>
                <CardHeader>Personal</CardHeader>
                <CardBody style={style.cardBody}>
                  <Personal
                    headers={[
                      <MdPersonPin size={25} />,
                      'Nombre',
                      'Cargo',
                      'Cumpleaños',
                      'Turno',
                    ]}
                    usersData={propiedadHorizontal.tblPersonal}
                  />
                </CardBody>
              </Card>
            </Col>
            <Col lg="6" md="6" sm="12" xs="12">
              <Card>
                <CardHeader>Zonas comunes</CardHeader>
                <CardBody style={style.cardBody}>
                  <ZonasComunes
                    headers={[
                      <MdPersonPin size={25} />,
                      'Reservar',
                      'Nombre',
                      'Descripción',
                    ]}
                    usersData={propiedadHorizontal.tblZonasComunes}
                    onClick={this.handleClickZonaComun}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        }

        {showPqrsModal &&
          <PqrsModal
            open={showPqrsModal}
            closeModal={() => this.handleClosePqrsModal()}
            propiedades={propiedadHorizontal.tblPropiedades} />
        }

        {showActualizarPropiedadModal &&
          <ActualizarPropiedadModal
            open={showActualizarPropiedadModal}
            closeModal={() => this.handleCloseActualizarPropiedadModal()}
            propiedad={propiedadActualizar} />
        }

        {showActualizarPerfilesModal &&
          <ActualizarPerfilesModal
            open={showActualizarPerfilesModal}
            closeModal={() => this.handleCloseActualizarPerfilesModal()}
            propiedad={propiedadActualizar} />
        }
      </Page>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    propiedadesHorizontales: state.HorizontalProperties.propiedadesHorizontales,
    propiedadHorizontal: state.HorizontalProperties.propiedadHorizontal,
    userAttributes: state.HorizontalProperties.userAttributes,
    reservas: state.HorizontalProperties.reservas
  }
}

const mapDispatchToProps = (dispatch) => ({
  setShowPropiedadesHorizontalesModal: (item) => dispatch(SetShowPropiedadesHorizontalesModal(item)),
  setShowSpinner: (item) => dispatch(SetShowSpinner(item)),
})


export default connect(mapStateToProps, mapDispatchToProps)(Home);


