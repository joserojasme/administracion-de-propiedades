import React, { Component } from 'react';
import { render } from 'react-dom';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const localizer = momentLocalizer(moment);

export default class EventCalendar extends Component {
    constructor(props) {
        super(props);
        
        
        this.state = {
            events: [],
        };
    }

    componentDidMount() {
        const { eventos } = this.props;
        let arrayEvents = [];
        if (eventos.eventos.length > 0) {
            eventos.eventos.map(evento => {
                arrayEvents.push({
                    id: evento.id, title: evento.nombre, start: new Date(evento.fechaInicio),
                    end: new Date(evento.fechaFin), descripcion: evento.descripcion, imagen: evento.urlImagen, lugar: evento.lugar, visible: evento.visible
                })
            })
        }

        if (eventos.zonaComun.length > 0) {
            eventos.zonaComun.map(evento => {
                arrayEvents.push({
                    id: evento.id, title: `Reserva zona común: ${evento.idZonaComunNavigation.nombre}`, start: new Date(evento.fechaInicio),
                    end: new Date(evento.fechaFin), descripcion: evento.nombre, imagen: evento.urlImagen, lugar: evento.lugar, visible: evento.visible
                })
            })
        }

        this.setState({ events: arrayEvents })
    }

    handleSelect = ({ start, end }) => {
        const title = window.prompt('Ingrese el nombre para el evento')
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
            })
    }

    handleClickVer = (event) =>{
        confirmAlert({
            title: event.nombre,
            message: event.descripcion,
            buttons: [
                {
                    label: 'Cerrar',
                    onClick: () => null
                }
            ]
        });
    }

    render() {
        const { events, culture } = this.state;
        return (
            <div style={{ height: '500pt' }}>
                <Calendar
                    selectable
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    defaultDate={moment().toDate()}
                    localizer={localizer}
                    onSelectEvent={event => this.handleClickVer({descripcion:event.descripcion, nombre:event.title})}
                    
                    defaultView={Views.WEEK}

                />
            </div>
        );
    }
}



// import React from 'react';
// import FullCalendar from 'fullcalendar-reactwrapper';
// import 'fullcalendar-reactwrapper/dist/css/fullcalendar.min.css';

// export default class EventCalendar extends React.Component {
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
//                     end: evento.fechaFin, descripcion: evento.descripcion, imagen: evento.urlImagen, lugar: evento.lugar, visible: evento.visible
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