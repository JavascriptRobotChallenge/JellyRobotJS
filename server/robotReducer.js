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
        newState[action.playerId] = {x: getRandomInt(-699, 699), y: 0, z: 600, theta: 0, robotInstance: action.robotInstance, health: 10,lastFired:0}
        return newState
      case "UpdateLastFired":
        newState[action.playerId].lastFired = action.lastFired
        console.log("newstate is ",newState)
        return newState
      case "Rotation":
        newState[action.playerRotation.playerId].theta = newState[action.playerRotation.playerId].theta + action.playerRotation.theta
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
      default:
        return newState
    }
}

const UpdateLastFired = (playerId,lastFired) => {
// console.log("lastfiredinaction",lastFired)
  return {playerId:playerId,type:"UpdateLastFired", lastFired}
}
const AddPlayer = (playerId, robotInstance) => ({type: "AddPlayer", playerId, robotInstance})
const WalkForward = (playerId) => ({type: "WalkForward", playerId})
const WalkBackward = (playerId) => ({type: "WalkBackward", playerId})
const Rotation = (playerId, theta) =>{
  return {type: "Rotation", playerRotation:{ playerId: playerId, theta: theta} }
}
const DecreaseHealth = (playerId, strength)=> {
  return { type: "DecreaseHealth",
  playerId: playerId,
  strength: strength }
}

module.exports = { reducer, AddPlayer, WalkForward, WalkBackward, Rotation, DecreaseHealth, UpdateLastFired }
