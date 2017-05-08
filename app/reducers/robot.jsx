const _ = require('lodash')

const reducer = ( state = {}, action) => {
  var newState = _.merge({}, state)
  Object.freeze(state)

    switch (action.type) {
        case "ServerUpdate":
          newState = action.payload
        default:
          return newState
    }
}

export const ServerUpdate = (payload) => ({type: "ServerUpdate", payload})


export default reducer
