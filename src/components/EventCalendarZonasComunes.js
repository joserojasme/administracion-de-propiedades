import React, { Component } from 'react';
import { render } from 'react-dom';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { InsertarReservaZonaComun } from '../api/api';
import { connect } from 'react-redux';
import { MdError, MdImportantDevices } from 'react-icons/md';
import { SetShowSpinner } from '../reducers/actions/HorizontalProperties';

const localizer = momentLocalizer(moment);

class EventCalendarZonasComunes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
        };
    }

    componentWillReceiveProps({ eventos }) {
        if (eventos != this.props.eventos) {
            this.setState({ eventos: [] }, () => {
                let arrayEvents = [];
                if (eventos.length >= 0) {
                    eventos.map(evento => {
                        arrayEvents.push({
                            id: evento.id, title: evento.nombre, start: evento.fechaInicio,
                            end: evento.fechaFin, descripcion: evento.descripcion, imagen: evento.urlImagen, lugar: evento.lugar, visible: evento.visible
                        })
                    })
                    this.setState({ events: arrayEvents })
                }
            })

        }
    }

    componentDidMount() {
        const { eventos } = this.props;
        let arrayEvents = [];
        if (eventos.length >= 0) {
            eventos.map(evento => {
                arrayEvents.push({
                    id: evento.id, title: evento.nombre, start: new Date(evento.fechaInicio),
                    end: new Date(evento.fechaFin), idUsuario:evento.idUsuario
                })
            })
            this.setState({ events: arrayEvents })
        }
    }

    handleSelect = ({ start, end }) => {
        const { propiedadesHorizontales, zonaComun, notificacion } = this.props;
        const title = window.prompt('Ingrese un nombre para el evento')
        if (title)
            this.setState({
                events: [
                    ...this.state.events,
                    {
                        start,
                        end,
                        title,
                    },
                ],
            }, () => {
                let reservaZonaComun = {
                    "fechaInicio": new Date(start-18000000),
                    "fechaFin": new Date(end-18000000),
                    "idUsuario": propiedadesHorizontales.copropietario.id,
                    "idZonaComun": zonaComun,
                    "nombre": title
                }
                InsertarReservaZonaComun(reservaZonaComun, this.props.setShowSpinner).then(result => {
                    if (result.status == 201) {
                        
                        notificacion('Reserva guardada', <MdImportantDevices />, 'success')
                    } else {
                        notificacion('Error guardando la reserva', <MdError />, 'error', 1000);
                    }
                })
            })
    }


    render() {
        const { events } = this.state;
        const {borrarReserva} = this.props;
        return (
            <div style={{ height: '500pt' }}>
                <Calendar
                    selectable
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    defaultDate={moment().toDate()}
                    localizer={localizer}
                    onSelectEvent={event => borrarReserva({idUsuario:event.idUsuario, idZonaComun:event.id, nombre:event.title})}
                    onSelectSlot={this.handleSelect}
                    defaultView={Views.WEEK}
                />
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        userAttributes: state.HorizontalProperties.userAttributes,
        propiedadesHorizontales: state.HorizontalProperties.propiedadesHorizontales,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setShowSpinner: (item) => dispatch(SetShowSpinner(item)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EventCalendarZonasComunes);

// import React from 'react';
// import FullCalendar from 'fullcalendar-reactwrapper';
// import 'fullcalendar-reactwrapper/dist/css/fullcalendar.min.css';

// export default class EventCalendarZonasComunes extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             events: [],
//         }
//     }

//     componentDidMount() {
//         const { eventos } = this.props;
//         let arrayEvents = [];
//         if (eventos.length >= 0) {
//             eventos.map(evento => {
//                 arrayEvents.push({
//                     id: evento.id, title: evento.nombre, start: evento.fechaInicio,
//                     end: evento.fechaFin
//                 })
//             })
//             this.setState({ events: arrayEvents })
//         }
//     }

//     componentWillReceiveProps({ eventos }) {
//         if (eventos != this.props.eventos) {
//             this.setState({ eventos: [] }, () => {
//                 let arrayEvents = [];
//                 if (eventos.length >= 0) {
//                     eventos.map(evento => {
//                         arrayEvents.push({
//                             id: evento.id, title: evento.nombre, start: evento.fechaInicio,
//                             end: evento.fechaFin, descripcion: evento.descripcion, imagen: evento.urlImagen, lugar: evento.lugar, visible: evento.visible
//                         })
//                     })
//                     this.setState({ events: arrayEvents })
//                 }
//             })

//         }
//     }


//     /*header original
//   header = {{
//               left: 'prev,next today myCustomButton',
//               center: 'title',
//               right: 'month,basicWeek,basicDay'
//           }}
//     */

//     render() {
//         let fechaActual = new Date();
//         const { events } = this.state;

//         return (
//             <div id="example-component">
//                 <FullCalendar
//                     header={{
//                         left: 'prev,next today myCustomButton',
//                         center: 'title',
//                         right: 'month,basicWeek,basicDay'
//                     }}
//                     defaultDate={fechaActual}
//                     navLinks={true}
//                     editable={true}
//                     eventLimit={true}
//                     events={events}
//                 />
//             </div>
//         );
//     }
// }