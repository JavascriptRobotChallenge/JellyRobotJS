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
          newState[action.playerId] = {x: getRandomInt(-699, 699), y: 0, z: 600, theta: 0, robotInstance: action.robotInstance}
          return newState
        case "Rotation":
          newState[action.playerrotation.playerId].theta = newState[action.playerrotation.playerId].theta + action.playerrotation.theta
          return newState
        case "WalkForward":
          newState[action.playerId].x = newState[action.playerId].x + Math.sin(newState[action.playerId].theta)
          newState[action.playerId].z = newState[action.playerId].z + Math.cos(newState[action.playerId].theta)
          return newState
        case "WalkBackward":
          newState[action.playerId].x = newState[action.playerId].x - Math.sin(newState[action.playerId].theta)
          newState[action.playerId].z = newState[action.playerId].z - Math.cos(newState[action.playerId].theta)
          return newState
        default:
          return newState
    }
}

const AddPlayer = (playerId, robotInstance) => ({type: "AddPlayer", playerId, robotInstance})
const WalkForward = (playerId) => ({type: "WalkForward", playerId})
const WalkBackward = (playerId) => ({type: "WalkBackward", playerId})
const Rotation = (playerId, theta) =>{
  return {type: "Rotation",playerrotation:{playerId:playerId,theta:theta}
}}



module.exports = {reducer, AddPlayer, WalkForward, WalkBackward, Rotation}
