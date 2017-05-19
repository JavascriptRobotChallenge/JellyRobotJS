var { FireProjectile, RemoveProjectile, MoveOneForward, RemoveProjectilesOnLeave } = require("../../../server/reducers/projectileReducer")
var { WalkFollowSpeed, AddOrUpdatePlayer, RemovePlayer, UpdateFireTime, UpdateWalkTime, WalkAwayFromWall, WalkForward, WalkBackward, AddRotation, DecreaseHealth, SetRotation } = require("../../../server/reducers/robotReducer")

let sandboxStore
let actionQueue = []

function fire(roomName, playerId, theta, strength, reloadTime){
  if ( Date.now() > sandboxStore.robots[playerId].fireTime ) {
    actionQueue.push(FireProjectile(roomName, playerId, sandboxStore.robots[playerId], theta, strength))
    actionQueue.push(UpdateFireTime(roomName, playerId, Date.now() + reloadTime * 1000))
  }
}

exports.api = {
  getActionQueue: function(){
    return actionQueue
  },
  setup: function(initialState){
    sandboxStore = initialState
  },
  distanceBetween: function(arrOne, arrTwo){
    return Math.sqrt(Math.pow(arrTwo[0]-arrOne[0],2)+(Math.pow(arrTwo[1]-arrOne[1]),2))
  },
  setRotation: function(roomName, playerId, theta) {
    console.log('inside set rotation')
    actionQueue.push( SetRotation(roomName, playerId, theta) )
  },
  angleBetween: function(arrOne,arrTwo){
    var xDiff = arrTwo[0] - arrOne[0]
    var zDiff = arrTwo[1] - arrOne[1]
    let radAngle
      if( xDiff > 0 && zDiff > 0 ){
        radAngle = Math.atan(xDiff/zDiff)
      }
      else if(xDiff > 0 && zDiff < 0){
        radAngle = Math.PI + Math.atan(xDiff/zDiff)
      }
      else if(xDiff < 0 && zDiff < 0){
        radAngle = Math.PI + Math.atan(xDiff/zDiff)
      }
      else if(xDiff < 0 && zDiff > 0){
        radAngle = Math.atan(xDiff/zDiff)
      }
      return radAngle
  },
  accurateFire: function(roomName, playerId){
    var ownPosition = exports.api.getOwnPosition(roomName, playerId)
    var otherPlayersPosition = exports.api.findOpponent(roomName, playerId)
    var radAngle

    if (!otherPlayersPosition){radAngle = 0}
    else {
      var xDiff = otherPlayersPosition[0] - ownPosition[0]
      var zDiff = otherPlayersPosition[1] - ownPosition[1]
      if ( xDiff > 0 && zDiff > 0 ){
        radAngle = Math.atan(xDiff/zDiff)
      }
      else if (xDiff > 0 && zDiff < 0){
        radAngle = Math.PI + Math.atan(xDiff/zDiff)
      }
      else if (xDiff < 0 && zDiff < 0){
        radAngle = Math.PI + Math.atan(xDiff/zDiff)
      }
      else if(xDiff < 0 && zDiff > 0){
        radAngle = Math.atan(xDiff/zDiff)
      }
    }
    fire(roomName, playerId, radAngle, 1, 5 )
  },
  rapidFire: function(roomName, playerId){
    fire(roomName, playerId, Math.random() * 2 * Math.PI, 1, 0.1)
  },
  devastator: function(roomName,playerId){
    console.log("devestatorunloaded")
    var ownPosition = exports.api.getOwnPosition(roomName, playerId)
    var otherPlayersPosition = exports.api.findOpponent(roomName, playerId)
    if (otherPlayersPosition){
      fire(roomName,playerId,exports.api.angleBetween(ownPosition,otherPlayersPosition),3,15)
    }
  },
  findOpponent: function(roomName, playerId){
    const robots = sandboxStore.robots
    for (var robotID in robots){
      if (robotID!==playerId && robots[robotID].code){
        return [robots[robotID].x, robots[robotID].z]
      }
    }
    return false
  },
  getOwnPosition: function(roomName, playerId){
    const ownRobot = sandboxStore.robots[playerId]
    return [ownRobot.x,ownRobot.z]
  },
  getOpponentsHealth: function(roomName,playerId){
    const robots = sandboxStore.robots
    for (var robotID in robots){
      if (robotID!==playerId){
        return robots[robotID].health
      }
    }
    return false
  },
  addRotation: function(roomName, playerId, degrees) {
    var theta = degrees *.0174533
    actionQueue.push( AddRotation(roomName, playerId, theta) )
    actionQueue.push( WalkForward(roomName, playerId) )
  },
  walkForward: function(roomName, playerId) {
    if ( Date.now() > sandboxStore.robots[playerId].walkTime ) {
      actionQueue.push( WalkForward(roomName, playerId) )
      actionQueue.push( UpdateWalkTime(roomName, playerId) )
    }
  },
  slowWalkForward:function(roomName, playerId) {
    if ( Date.now() > sandboxStore.robots[playerId].walkTime ) {
      actionQueue.push( WalkFollowSpeed(roomName, playerId) )
      actionQueue.push( UpdateWalkTime(roomName, playerId) )
    }
  },
  onBoxCollision:function(roomName, id){
    exports.api.addRotation(roomName, id, 45)
    exports.api.walkForward(roomName, id)
  },
  walkTowardOpponent:function(roomName,playerId){
    if (exports.api.findOpponent(roomName, playerId)){
      if ( Date.now() > sandboxStore.robots[playerId].walkTime ) {
        var theta = exports.api.angleBetween(exports.api.getOwnPosition(roomName, playerId), exports.api.findOpponent(roomName, playerId))
        exports.api.setRotation(roomName,playerId,theta)
        exports.api.slowWalkForward(roomName,playerId)
      }
      else {
        exports.api.walkForward(roomName,playerId)
      }
    }
  },
  walkAwayFromOpponent: function(roomName,playerId){
    if (exports.api.findOpponent(roomName, playerId)){
      var theta = exports.api.angleBetween(exports.api.getOwnPosition(roomName, playerId),exports.api.findOpponent(roomName, playerId)) + 0.666 * Math.PI
      exports.api.setRotation(roomName,playerId,theta)
      exports.api.walkForward(roomName,playerId)
    }
    else {
      walkForward(roomName,playerId)
    }
  }
}
