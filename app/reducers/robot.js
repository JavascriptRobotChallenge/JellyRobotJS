const _ = require('lodash')


var initialState = {
  room: '',
  server: {}
}

const reducer = ( state = initialState, action) => {
  var newState = _.merge({}, state)
  Object.freeze(state)

    switch (action.type) {
        case "AssignRoom":
          newState.room = action.room
          return newState
        case "ServerUpdate":
        console.log("payload",action.payload)
          newState.server = action.payload
          return newState
        default:
          return newState
    }
}

export const AssignRoom = (room) => ({type: "AssignRoom", room})
window.AssignRoom = AssignRoom;
export const ServerUpdate = (payload) => ({type: "ServerUpdate", payload})
window.ServerUpdate = ServerUpdate
export default reducer
