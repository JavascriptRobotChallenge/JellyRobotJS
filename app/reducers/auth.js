import axios from 'axios'

var initialState = {
    user: {},
    socketID: ''
}

const reducer = (state = initialState, action) => {
    const newState = _.merge({}, state)
    Object.freeze(state)

    switch (action.type) {
        case AUTHENTICATED:
            newState.user = action.user
        case SOCKETCONNECT:
            newState.socketID = action.socketID
    }
    return newState
}

const AUTHENTICATED = 'AUTHENTICATED'
const SOCKETCONNECT = 'SOCKETCONNECT'
export const authenticated = user => ({
    type: AUTHENTICATED,
    user
})

export const SocketConnection = socketID => ({
    type: SOCKETCONNECT,
    socketID
})

export const login = (username, password) =>
    dispatch =>
    axios.post('/api/auth/login/local', {
        username,
        password
    })
    .then(() => dispatch(whoami()))
    .catch(() => dispatch(whoami()))

export const logout = () =>
    dispatch =>
    axios.post('/api/auth/logout')
    .then(() => dispatch(whoami()))
    .catch(() => dispatch(whoami()))

export const whoami = () =>
    dispatch =>
    axios.get('/api/auth/whoami')
    .then(response => {
        const user = response.data
        dispatch(authenticated(user))
    })
    .catch(failed => dispatch(authenticated(null)))

export default reducer