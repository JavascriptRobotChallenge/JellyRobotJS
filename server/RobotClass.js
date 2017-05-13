const backendStore = require('./reducers/backendStore.js')
const { FireProjectile } = require("./reducers/projectileReducer")
const { Rotation, WalkForward, WalkBackward, UpdateLastFired } = require("./reducers/robotReducer")
var util = require('util')
var eventEmitter = require('events').EventEmitter;


function RobotClass() {
  this.health = 100;
  this.direction;
}

var counter = 0
RobotClass.prototype.fire = function(roomName, playerId, theta, strength){
    // better to find their roomName without asking them
  if ( Date.now() - backendStore.getState().robots[playerId].lastFired > strength * 1000){
    backendStore.dispatch(UpdateLastFired(roomName, playerId, Date.now() ) )
    backendStore.dispatch(FireProjectile(roomName, backendStore.getState().robots[playerId], theta, strength))
    counter++
  }
}

RobotClass.prototype.findOpponent = function( playerId){
  const robots = backendStore.getState().robots
  for (var robotID in robots){
    if (robotID!==playerId){
      return [robots[robotID].x,robots[robotID].z]
    }
  }
  return false
}

RobotClass.prototype.getOwnPosition = function(playerId){
  const ownRobot = backendStore.getState().robots[playerId]
  return [ownRobot.x,ownRobot.z]
}

RobotClass.prototype.rotation = function(roomName, playerId, degrees) {
  var theta = degrees *.0174533
  backendStore.dispatch(Rotation(roomName, playerId, theta))
  backendStore.dispatch(WalkForward(roomName, playerId))
  backendStore.dispatch(WalkForward(roomName, playerId))
  backendStore.dispatch(WalkForward(roomName, playerId))
}

RobotClass.prototype.walkForward = function(roomName, id) {
  backendStore.dispatch(WalkForward(roomNAme, id))
}

RobotClass.prototype.walkBackward = function(roomName, numTimes, id) {
  backendStore.dispatch(WalkBackward(roomName, id))
}

util.inherits(RobotClass, eventEmitter)

module.exports = RobotClass;
