import axios from 'axios'
const _ = require('lodash')
import socket from '../socket'

var initialState = {
    room: '',
    server: {
        robots: {},
        projectiles: {}
    },
    testRobots: {}
}

const reducer = (state = initialState, action) => {
    var newState = state
    switch (action.type) {
        case "AssignRoom":
            newState.room = action.room
            return newState
        case "ServerUpdate":
            newState.server = action.payload
            return newState
        case "GotTestRobots":
            newState.testRobots = action.testRobots
            return newState
        default:
            return newState
    }
}

export const AssignRoom = (room) => ({
    type: "AssignRoom",
    room
})
export const ServerUpdate = (payload) => ({
    type: "ServerUpdate",
    payload
})
export const GotTestRobots = (testRobots) => ({
    type: "GotTestRobots",
    testRobots
})

export const SaveRobot = (robotName, code, userId) => dispatch => {
    axios.post(`/api/users/${userId}/robots`, {
            robotName,
            code
        })
        .then(res => res.data)
        .catch(err => console.error(`Saving robot unsuccesful`, err))
}

export const GetTestRobots = () => dispatch => {
    axios.get(`/api/robots/testRobots`)
        .then(response => {
            var robots = response.data
            socket.emit('setTestRobot', robots)
            dispatch(GotTestRobots(robots))
        })
        .catch(err => console.error(`Getting test robot was unsuccessful`, err))
}

export default reducer