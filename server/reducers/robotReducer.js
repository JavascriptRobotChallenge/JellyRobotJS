const _ = require('lodash')

function getRandomInt(min, max) {
  var min = Math.ceil(min);
  var max = Math.floor(max);
  var rand = Math.floor(Math.random() * (max - min)) + min;
  while (rand > -140 && rand < 340) {
    rand = Math.floor(Math.random() * (max - min)) + min;
  }
  return rand
}

var initialState = {
  'Blueberry': {},
  'Cherry': {},
  'Strawberry': {},
  'Watermelon': {},
  'Banana': {},
  'Mango': {}
}

const reducer = ( state = initialState, action) => {
  const newState = _.merge({}, state)
  Object.freeze(state)

  switch (action.type) {
    case "AddOrUpdatePlayer":
      if(!action.roomName){
        return newState
      } else {
        newState[action.roomName][action.socketId] = { x: getRandomInt(-699, 699), y: 0, z: getRandomInt(-699, 699),
          theta: 0, robotInstance: action.robotInstance, health: 10, fireTime:0, walkTime:0,
          color: (action.robotInstance) ? action.robotInstance.color : 'red' }
          // console.log('newstate in adding player', newState)
        return newState
      }
    case "RemovePlayer":
      for (var room in newState){
        for (var robot in newState[room]){
          if (robot === action.socketId){
            delete newState[room][robot]
          }
        }
      }
      // console.log('newstate after delete', newState)
      return newState
    case "UpdateWalkTime":
      newState[action.roomName][action.socketId].walkTime = Date.now() + 29
      return newState
    case "UpdateFireTime":
      newState[action.roomName][action.socketId].fireTime = action.fireTime
      return newState
    case "AddRotation":
      newState[action.roomName][action.socketId].theta = newState[action.roomName][action.socketId].theta + action.theta
      return newState
    case "WalkAwayFromWall":
      newState[action.roomName][action.socketId].x = newState[action.roomName][action.socketId].x + 10 * Math.sin(newState[action.roomName][action.socketId].theta)
      newState[action.roomName][action.socketId].z = newState[action.roomName][action.socketId].z + 10 * Math.cos(newState[action.roomName][action.socketId].theta)
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
      return newState
    case "SetRotation":
      newState[action.roomName][action.socketId].theta = action.theta
      return newState
    case "WalkFollowSpeed":
      newState[action.roomName][action.socketId].x = newState[action.roomName][action.socketId].x + 3 * Math.sin(newState[action.roomName][action.socketId].theta)
      newState[action.roomName][action.socketId].z = newState[action.roomName][action.socketId].z + 3 * Math.cos(newState[action.roomName][action.socketId].theta)
      return newState
    default:
      return newState
  }
}
const WalkFollowSpeed = (roomName, socketId) => ({type: "WalkFollowSpeed", socketId, roomName})
const AddOrUpdatePlayer = (roomName, socketId, robotInstance) => ({type: "AddOrUpdatePlayer", socketId, roomName, robotInstance})
const RemovePlayer = (socketId) => ({type: "RemovePlayer", socketId})
const UpdateFireTime = (roomName, socketId, fireTime) => ({type: "UpdateFireTime", socketId, fireTime, roomName})
const UpdateWalkTime = (roomName, socketId) => ({type: "UpdateWalkTime", socketId, roomName})
const WalkAwayFromWall = (roomName, socketId) => ({type: "WalkAwayFromWall", socketId, roomName})
const WalkForward = (roomName, socketId) => ({type: "WalkForward", socketId, roomName})
const WalkBackward = (roomName, socketId) => ({type: "WalkBackward", socketId, roomName})
const AddRotation = (roomName, socketId, theta) => ({  type: "AddRotation", socketId, theta, roomName})
const DecreaseHealth = (roomName, socketId, strength) => ({type: "DecreaseHealth", socketId, strength, roomName})
const SetRotation = (roomName, socketId, theta) => ({type:"SetRotation",theta, socketId, roomName})

module.exports = { reducer, AddOrUpdatePlayer, RemovePlayer, WalkForward,
WalkBackward, AddRotation, DecreaseHealth, UpdateFireTime, UpdateWalkTime, SetRotation, WalkAwayFromWall, WalkFollowSpeed }
