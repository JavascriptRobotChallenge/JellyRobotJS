import axios from 'axios'
import { SOCKET_CONNECT, AUTHENTICATED } from './constants'

export const authenticated = user => ({
    type: AUTHENTICATED,
    user
})

export const socketConnect = socketID => ({
    type: SOCKET_CONNECT,
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
