const _ = require('lodash')

var initialState = {}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const reducer = ( state = {}, action) => {
  const newState = _.merge({}, state)
  Object.freeze(state)

  switch (action.type) {
    //SW: these should be coming from a constant file
      case "AddPlayer":
        newState[action.playerId] = {x:300, y: 0, z: 300, theta: 1.5*Math.PI, robotInstance: action.robotInstance, health: 10,lastFired:0}
        return newState
      case "UpdateLastFired":
        newState[action.playerId].lastFired = action.lastFired
        return newState
      case "Rotation":
        newState[action.playerId].theta = newState[action.playerId].theta + action.theta
        return newState
      case "WalkForward":
        newState[action.playerId].x = newState[action.playerId].x + 5 * Math.sin(newState[action.playerId].theta)
        newState[action.playerId].z = newState[action.playerId].z + 5 * Math.cos(newState[action.playerId].theta)
        return newState
      case "WalkBackward":
        newState[action.playerId].x = newState[action.playerId].x - Math.sin(newState[action.playerId].theta)
        newState[action.playerId].z = newState[action.playerId].z - Math.cos(newState[action.playerId].theta)
        return newState
      case "DecreaseHealth":
        newState[action.playerId].health -= action.strength
        return newState
      case "Perp":
      newState[action.playerId].theta = action.theta
      return newState
      default:
        return newState
    }
}

const UpdateLastFired = (playerId,lastFired) => ({
  type: "UpdateLastFired", playerId, lastFired
})

const AddPlayer = (playerId, robotInstance) => ({
  type: "AddPlayer", playerId, robotInstance
})

const WalkForward = (playerId) => ({type: "WalkForward", playerId})
const WalkBackward = (playerId) => ({type: "WalkBackward", playerId})

const Rotation = (playerId, theta) =>({
  type: "Rotation", playerId, theta
})

const DecreaseHealth = (playerId, strength)=> ({
  type: "DecreaseHealth", playerId, strength
})

const Perp = (playerId,theta)=>({
  type:"Perp",theta,playerId
})

module.exports = { reducer, AddPlayer, WalkForward, WalkBackward, Rotation, DecreaseHealth, UpdateLastFired, Perp }
