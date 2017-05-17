import axios from 'axios'
const _ = require('lodash')

var initialState = {
  room: '',
  server: {robots:{},projectiles:{}}
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
        default:
          return newState
    }
}

export const AssignRoom = (room) => ({type: "AssignRoom", room})
export const ServerUpdate = (payload) => ({type: "ServerUpdate", payload})
export const SaveRobot = (robotName, code, userId) => dispatch => {
  axios.post(`/api/users/${userId}/robots`, {robotName, code})
  .then(res => res.data)
  .catch(err => console.error(`Saving robot unsuccesful`, err))
}


export default reducer
