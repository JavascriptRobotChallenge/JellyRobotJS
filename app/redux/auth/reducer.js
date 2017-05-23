import { initialState } from './initialState'
import { AUTHENTICATED, SOCKET_CONNECT } from './constants'

const reducer = (state = {
    user: {},
    socketID: ''
}, action) => {
    const newState = state

    switch (action.type) {
        case AUTHENTICATED:
            newState.user = action.user
        case SOCKET_CONNECT:
            newState.socketID = action.socketID
    }
    return newState
}

export default reducer
