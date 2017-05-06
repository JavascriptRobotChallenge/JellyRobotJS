const _ = require('lodash')

// theta
var initialPosition = {
    x: -250,
    y: 0,
    z: 0,
    theta: 0
}

var initialState = {}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const reducer = ( state = initialState, action) => {
  const newState = _.merge({}, state)
  Object.freeze(state)

    switch (action.type) {
        case "AddPlayer":
          newState[action.playerId] = {x: getRandomInt(-699, 699), y: 0, z: getRandomInt(-699, 699)}
          return newState
        case "Rotation":
          newState[action.playerId][theta] = newState[action.playerId][theta] + action.theta
          return newState
        case "WalkForward":
          newState[action.playerId][x] = newState[action.playerId][x] + Math.sin(newState[action.playerId].theta)
          newState[action.playerId][z] = newState[action.playerId][z] + Math.cos(newState[action.playerId].theta)
          return newState
        default:
          return newState
    }
}

const AddPlayer = (playerId, location) => ({type: "AddPlayer", playerId})
const WalkForward = () => ({type: "WalkForward"})
const Rotation = (playerId, theta) => ({type: "Rotation", playerId, theta})


module.exports = {reducer, AddPlayer, WalkForward, Rotation}
