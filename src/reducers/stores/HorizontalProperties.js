const initialState = {
    propiedadesHorizontales: {},
    userAttributes: {},
    showSpinner:false,
    propiedadesHorizontalesModal:false,
    propiedadHorizontal:{},
    buzonInquilinos:{},
    reservas:{}
}

function HorizontalProperties(state = initialState, action) {
    switch (action.type) {
        case 'SET_PROPIEDADES_HORIZONTALES': {
            return {
                ...state,
                propiedadesHorizontales: action.payload.item
            }
        }
        case 'SET_USER_ATTRIBUTES': {
            return {
                ...state,
                userAttributes: action.payload.item
            }
        }
        case 'SET_SHOW_SPINNER': {
            return {
                ...state,
                showSpinner: action.payload.item
            }
        }
        case 'SET_SHOW_PROPIEDADES_HORIZONTALES_MODAL': {
            return {
                ...state,
                propiedadesHorizontalesModal: action.payload.item
            }
        }
        case 'SET_PROPIEDAD_HORIZONTAL': {
            return {
                ...state,
                propiedadHorizontal: action.payload.item
            }
        }
        case 'SET_BUZON_INQUILINOS': {
            return {
                ...state,
                buzonInquilinos: action.payload.item
            }
        }
        case 'SET_RESERVAS': {
            return {
                ...state,
                reservas: action.payload.item
            }
        }
        case 'LOGOUT': {
            return initialState
        }
        default:
            return state
    }
}

export default HorizontalProperties;