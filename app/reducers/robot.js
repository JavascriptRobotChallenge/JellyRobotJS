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
          console.log(action.room)
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


export default reducer
