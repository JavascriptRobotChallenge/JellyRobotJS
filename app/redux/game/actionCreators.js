import socket from '../../socket'
import axios from 'axios'
import { ASSIGN_ROOM, SERVER_UPDATE, GOT_TEST_ROBOTS } from './constants'

export const assignRoom = (room) => ({
    type: ASSIGN_ROOM,
    room
})
export const serverUpdate = (payload) => ({
    type: SERVER_UPDATE,
    payload
})
export const gotTestRobots = (testRobots) => ({
    type: GOT_TEST_ROBOTS,
    testRobots
})

export const saveRobot = (robotName, code, userId) => dispatch => {
    axios.post(`/api/users/${userId}/robots`, {
            robotName,
            code
        })
        .then(res => res.data)
        .catch(err => console.error(`Saving robot unsuccesful`, err))
}

export const getTestRobots = () => dispatch => {
    axios.get(`/api/robots/testRobots`)
        .then(response => {
            var robots = response.data
            socket.emit('setTestRobot', robots)
            dispatch(gotTestRobots(robots))
        })
        .catch(err => console.error(`Getting test robot was unsuccessful`, err))
}
