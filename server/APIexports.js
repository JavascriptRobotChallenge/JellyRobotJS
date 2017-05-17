var { FireProjectile, RemoveProjectile, MoveOneForward, RemoveProjectilesOnLeave } = require("../../../server/reducers/projectileReducer")
var { WalkFollowSpeed, AddOrUpdatePlayer, RemovePlayer, UpdateFireTime, UpdateWalkTime, WalkAwayFromWall, WalkForward, WalkBackward, AddRotation, DecreaseHealth, SetRotation } = require("../../../server/reducers/robotReducer")
var redux = require('redux')

let sandboxStore
let actionQueue = []

exports.api = {
  getActionQueue: function(){
    return actionQueue
  },
  setup: function(initialState){
    sandboxStore = redux.createStore(
      require("../../../server/reducers/indexReducer"),
      initialState,
      redux.applyMiddleware(function(store){
        return function(next){
          return function(action){
            actionQueue.push(action)
            return next(action)
          }
        }
      }))
  },
  distanceBetween: function(arrOne, arrTwo){
    return Math.sqrt(Math.pow(arrTwo[0]-arrOne[0],2)+(Math.pow(arrTwo[1]-arrOne[1]),2))
  },
  setRotation: function(roomName, playerId, theta) {
    console.log('inside set rotation')
    sandboxStore.dispatch( SetRotation(roomName, playerId, theta) )
  },
  angleBetween: function(arrOne,arrTwo){
    var xDiff = arrTwo[0] - arrOne[0]
    var zDiff = arrTwo[1] - arrOne[1]
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
    var ownPosition = this.getOwnPosition(roomName, playerId)
    var otherPlayersPosition = this.findOpponent(roomName, playerId)
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
    this.fire(roomName, playerId, radAngle, 1, 5 )
  },
  rapidFire: function(roomName, playerId){
    this.fire(roomName, playerId, Math.random() * 2 * Math.PI, 1, 0.1)
  },
  devastator: function(roomName,playerId){
    console.log("devestatorunloaded")
    var ownPosition = this.getOwnPosition(roomName, playerId)
    var otherPlayersPosition = this.findOpponent(roomName, playerId)
    if (otherPlayersPosition){
      this.fire(roomName,playerId,this.angleBetween(ownPosition,otherPlayersPosition),3,15)
    }
  },
  findOpponent: function(roomName, playerId){
    const robots = sandboxStore.getState().robots[roomName]
    for (var robotID in robots){
      if (robotID!==playerId && robots[robotID].code){
        return [robots[robotID].x, robots[robotID].z]
      }
    }
    return false
  },
  getOwnPosition: function(roomName, playerId){
    const ownRobot = sandboxStore.getState().robots[roomName][playerId]
    return [ownRobot.x,ownRobot.z]
  },
  getOpponentsHealth: function(roomName,playerId){
    const robots = sandboxStore.getState().robots[roomName]
    for (var robotID in robots){
      if (robotID!==playerId){
        return [robots[robotID].health]
      }
    }
    return false
  },
  addRotation: function(roomName, playerId, degrees) {
    var theta = degrees *.0174533
    sandboxStore.dispatch( AddRotation(roomName, playerId, theta) )
    sandboxStore.dispatch( WalkForward(roomName, playerId) )
  },
  walkForward: function(roomName, playerId) {
    if ( Date.now() > sandboxStore.getState().robots[roomName][playerId].walkTime ) {
      sandboxStore.dispatch( WalkForward(roomName, playerId) )
      sandboxStore.dispatch( UpdateWalkTime(roomName, playerId) )
    }
  },
  slowWalkForward:function(roomName, playerId) {
    if ( Date.now() > sandboxStore.getState().robots[roomName][playerId].walkTime ) {
      sandboxStore.dispatch( WalkFollowSpeed(roomName, playerId) )
      sandboxStore.dispatch( UpdateWalkTime(roomName, playerId) )
    }
  },
  onBoxCollision:function(roomName, id){
    this.addRotation(roomName, id, 45)
    this.walkForward(roomName, id)
  },
  walkTowardOpponent:function(roomName,playerId){
    if (this.findOpponent(roomName, playerId)){
      if ( Date.now() > sandboxStore.getState().robots[roomName][playerId].walkTime ) {
      var theta =this.angleBetween(this.getOwnPosition(roomName, playerId),this.findOpponent(roomName, playerId))
      this.setRotation(roomName,playerId,theta)
      this.slowWalkForward(roomName,playerId)
      }
      else {
        this.walkForward(roomName,playerId)
      }
    }
  },
  walkAwayFromOpponent: function(roomName,playerId){
    if (this.findOpponent(roomName, playerId)){
      var theta = this.angleBetween(this.getOwnPosition(roomName, playerId),this.findOpponent(roomName, playerId)) + 0.666 * Math.PI
      this.setRotation(roomName,playerId,theta)
      this.walkForward(roomName,playerId)
    }
    else {
      this.walkForward(roomName,playerId)
    }
  }
}
