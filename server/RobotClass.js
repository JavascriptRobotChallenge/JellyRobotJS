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
RobotClass.prototype.fire = function(playerId, theta, strength){

  if ( Date.now() - backendStore.getState().robots[playerId].lastFired > strength * 1000){
    backendStore.dispatch(UpdateLastFired(playerId,Date.now()))
    backendStore.dispatch(FireProjectile(backendStore.getState().robots[playerId], theta, strength))
    counter++
  }
}

RobotClass.prototype.findOpponent = function(playerId){
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

RobotClass.prototype.rotation = function(playerId, degrees) {
  var theta = degrees *.0174533
  backendStore.dispatch(Rotation(playerId, theta))
  backendStore.dispatch(WalkForward(playerId))
  backendStore.dispatch(WalkForward(playerId))
  backendStore.dispatch(WalkForward(playerId))
}

RobotClass.prototype.walkForward = function(id) {
  backendStore.dispatch(WalkForward(id))
}

RobotClass.prototype.walkBackward = function(numTimes, id) {
  backendStore.dispatch(WalkBackward(id))
}

util.inherits(RobotClass, eventEmitter)

module.exports = RobotClass;
