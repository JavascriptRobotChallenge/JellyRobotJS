import axios from 'axios'
const _ = require('lodash')

var initialState = {
  room: '',
  server: {robots:{},projectiles:{}},
  testRobots: {}
}

const reducer = ( state = initialState, action) => {
  var newState = _.merge({}, state)
  Object.freeze(state)

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

export const AssignRoom = (room) => ({type: "AssignRoom", room})
export const ServerUpdate = (payload) => ({type: "ServerUpdate", payload})
export const GotTestRobots = (testRobots) => ({type: "GotTestRobots", testRobots})

export const SaveRobot = (robotName, code, userId) => dispatch => {
  axios.post(`/api/users/${userId}/robots`, {robotName, code})
  .then(res => res.data)
  .catch(err => console.error(`Saving robot unsuccesful`, err))
}

export const GetTestRobots = (robotName) => dispatch => {
  axios.get(`/api/users/1/robots/`, {
    params: { robotName: robotName }
  })
  .then(response => {
    var robots = response.data
    dispatch(GotTestRobots(robots))
  })
  .catch(err => console.error(`Getting test robot was unsuccessful`, err))
}

export default reducer
