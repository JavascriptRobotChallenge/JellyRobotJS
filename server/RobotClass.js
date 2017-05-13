const backendStore = require('./reducers/backendStore.js')
const { FireProjectile } = require("./reducers/projectileReducer")
const { Rotation, WalkForward, WalkBackward, UpdateGoodTime, Perp } = require("./reducers/robotReducer")
var util = require('util')
var eventEmitter = require('events').EventEmitter;

function RobotClass() {
  this.health = 100;
  this.direction;
}

var counter = 0
RobotClass.prototype.fire = function(roomName, playerId, theta, strength, reloadTime){
  if ( Date.now() > backendStore.getState().robots[roomName][playerId].goodTime ) {
    backendStore.dispatch(FireProjectile(roomName, backendStore.getState().robots[roomName][playerId], playerId, theta, strength))
    backendStore.dispatch(UpdateGoodTime(roomName, playerId, Date.now() + reloadTime * 1000))
    counter++
  }
}

RobotClass.prototype.accurateFire = function(roomName, id){
  var ownPosition = this.getOwnPosition(roomName, id)
  var otherPlayersPosition = this.findOpponent(roomName, id)
  var radAngle;
  if (!otherPlayersPosition){radAngle = 0}
  else{
    var xDiff = otherPlayersPosition[0] - ownPosition[0]
    var zDiff = otherPlayersPosition[1] - ownPosition[1]
    if ( xDiff > 0 && zDiff > 0 ){
      radAngle = Math.atan(xDiff/zDiff)
    }
    else if (xDiff>0&&zDiff<0){
      radAngle = Math.PI+Math.atan(xDiff/zDiff)
    }
    else if (xDiff<0&&zDiff<0){
      radAngle = Math.PI+Math.atan(xDiff/zDiff)
    }
    else if(xDiff<0&&zDiff>0){
      radAngle = Math.atan(xDiff/zDiff)
    }
  }
  this.fire( id, radAngle, 1, 5 )
}

RobotClass.prototype.rapidFire = function(roomName, id){
  this.fire(roomName, id, Math.random() * 2 * Math.PI, 1, 0.1)
}

RobotClass.prototype.findOpponent = function(roomName, playerId){
  const robots = backendStore.getState().robots[roomName]
  for (var robotID in robots){
    if (robotID!==playerId){
      return [robots[robotID].x, robots[robotID].z]
    }
  }
  return false
}

RobotClass.prototype.getOwnPosition = function(roomName, playerId){
  const ownRobot = backendStore.getState().robots[roomName][playerId]
  return [ownRobot.x,ownRobot.z]
}

RobotClass.prototype.rotation = function(roomName, playerId, degrees) {
  var theta = degrees *.0174533
  backendStore.dispatch( Rotation(roomName, playerId, theta) )
  backendStore.dispatch( WalkForward(roomName, playerId) )
  backendStore.dispatch( WalkForward(roomName, playerId) )
  backendStore.dispatch( WalkForward(roomName, playerId) )
}

RobotClass.prototype.walkForward = function(roomName, id) {
  backendStore.dispatch( WalkForward(roomName, id) )
}

RobotClass.prototype.perp = function(roomName, playerId, theta) {
  backendStore.dispatch( Perp(roomName, playerId, theta) )
  backendStore.dispatch( WalkForward(roomName, playerId) )
  backendStore.dispatch( WalkForward(roomName, playerId) )
}

RobotClass.prototype.walkBackward = function(roomName, numTimes, id) {
  backendStore.dispatch( WalkBackward(roomName, id) )
}

RobotClass.prototype.onBoxCollision = function(roomName, id){
  this.rotation(roomName, id, 45)
  this.walkForward(roomName, id)
}

util.inherits(RobotClass, eventEmitter)

module.exports = RobotClass;