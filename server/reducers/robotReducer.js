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
      newState[action.socketId] =
        {x: 0, y: 0, z: 600, theta: 0,
          robotInstance: null, health: 10,lastFired:0, roomName: action.roomName}
      return newState
    case "UpdatePlayer":
      newState[action.socketId] = {x: getRandomInt(-699, 699), y: 0, z: getRandomInt(-699, 699),
        theta: 0, robotInstance: action.robotInstance, health: 10,lastFired:0, roomName: newState.roomName}
      return newState
    case "RemovePlayer":
      delete newState[action.socketId]
      return newState
    case "UpdateLastFired":
      newState[action.socketId].lastFired = action.lastFired
      return newState
    case "Rotation":
      newState[action.socketId].theta = newState[action.socketId].theta + action.theta
      return newState
    case "WalkForward":
      newState[action.socketId].x = newState[action.socketId].x + 5 * Math.sin(newState[action.socketId].theta)
      newState[action.socketId].z = newState[action.socketId].z + 5 * Math.cos(newState[action.socketId].theta)
      return newState
    case "WalkBackward":
      newState[action.socketId].x = newState[action.socketId].x - Math.sin(newState[action.socketId].theta)
      newState[action.socketId].z = newState[action.socketId].z - Math.cos(newState[action.socketId].theta)
      return newState
    case "DecreaseHealth":
      newState[action.socketId].health -= action.strength
    default:
      return newState
  }
}

const UpdateLastFired = (socketId,lastFired) => ({
  type: "UpdateLastFired", socketId, lastFired
})

const AddPlayer = (socketId, roomName) => ({
  type: "AddPlayer", socketId, roomName
})

const UpdatePlayer = (socketId, robotInstance) => ({
  type: "UpdatePlayer", socketId, robotInstance
})

const RemovePlayer = (socketId) => ({
  type: "RemovePlayer", socketId
})

const WalkForward = (socketId) => ({type: "WalkForward", socketId})
const WalkBackward = (socketId) => ({type: "WalkBackward", socketId})

const Rotation = (socketId, theta) =>({
  type: "Rotation", socketId, theta
})

const DecreaseHealth = (socketId, strength)=> ({
  type: "DecreaseHealth", socketId, strength
})


module.exports = { reducer, AddPlayer, RemovePlayer, UpdatePlayer,
  WalkForward, WalkBackward, Rotation, DecreaseHealth, UpdateLastFired }
