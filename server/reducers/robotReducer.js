const _ = require('lodash')



function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var initialState = {
  'Blueberry': {},
  'Cherry': {},
  'Strawberry': {},
  'Watermelon': {}
}

const reducer = ( state = initialState, action) => {
  const newState = _.merge({}, state)
  Object.freeze(state)

  switch (action.type) {
    //SW: these should be coming from a constant file
    case "AddOrUpdatePlayer":
      newState[action.roomName][action.socketId] = { x: getRandomInt(-699, 699), y: 0, z: getRandomInt(-699, 699), theta: 0, robotInstance: action.robotInstance, health: 10,lastFired:0}
      return newState

    case "RemovePlayer":
      delete newState[action.roomName][action.socketId]
      return newState
    case "UpdateLastFired":
      newState[action.roomName][action.socketId].lastFired = action.lastFired
      return newState
    case "Rotation":
      newState[action.roomName][action.socketId].theta = newState[action.roomName][action.socketId].theta + action.theta
      return newState
    case "WalkForward":
      newState[action.roomName][action.socketId].x = newState[action.roomName][action.socketId].x + 5 * Math.sin(newState[action.roomName][action.socketId].theta)
      newState[action.roomName][action.socketId].z = newState[action.roomName][action.socketId].z + 5 * Math.cos(newState[action.roomName][action.socketId].theta)
      return newState
    case "WalkBackward":
      newState[action.roomName][action.socketId].x = newState[action.roomName][action.socketId].x - Math.sin(newState[action.roomName][action.socketId].theta)
      newState[action.roomName][action.socketId].z = newState[action.roomName][action.socketId].z - Math.cos(newState[action.roomName][action.socketId].theta)
      return newState
    case "DecreaseHealth":
      newState[action.roomName][action.socketId].health -= action.strength
    default:
      return newState
  }
}

const UpdateLastFired = (roomName, socketId,lastFired) => ({
  type: "UpdateLastFired", socketId, lastFired, roomName
})

const AddOrUpdatePlayer = (roomName, socketId, robotInstance) => ({
  type: "AddOrUpdatePlayer", socketId, roomName, robotInstance
})

const RemovePlayer = (roomName, socketId) => ({
  type: "RemovePlayer", socketId, roomName
})

const WalkForward = (roomName, socketId) => ({type: "WalkForward", socketId})

const WalkBackward = (roomName, socketId) => ({type: "WalkBackward", socketId})

const Rotation = (roomName, socketId, theta) =>({
  type: "Rotation", socketId, theta, roomName
})

const DecreaseHealth = (roomName, socketId, strength)=> ({
  type: "DecreaseHealth", socketId, strength, roomName
})


module.exports = { reducer, AddOrUpdatePlayer, RemovePlayer,
  WalkForward, WalkBackward, Rotation, DecreaseHealth, UpdateLastFired }
