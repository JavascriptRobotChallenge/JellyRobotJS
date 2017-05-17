const leaveWall = function(roomName, playerId, theta) {
  backendStore.dispatch( SetRotation(roomName, playerId, theta) )
  backendStore.dispatch( WalkAwayFromWall(roomName, playerId) )
}
const fire = function(roomName, playerId, theta, strength, reloadTime){
  if ( Date.now() > backendStore.getState().robots[roomName][playerId].fireTime ) {
    backendStore.dispatch(FireProjectile(roomName, playerId, backendStore.getState().robots[roomName][playerId], theta, strength))
    backendStore.dispatch(UpdateFireTime(roomName, playerId, Date.now() + reloadTime * 1000))
  }
}

exports.api = {
  distanceBetween: function(arrOne, arrTwo){
    return Math.sqrt(Math.pow(arrTwo[0]-arrOne[0],2)+(Math.pow(arrTwo[1]-arrOne[1]),2))
  },
  setRotation: function(roomName, playerId, theta) {
    console.log('inside set rotation')
    backendStore.dispatch( SetRotation(roomName, playerId, theta) )
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
    const robots = backendStore.getState().robots[roomName]
    for (var robotID in robots){
      if (robotID!==playerId && robots[robotID].code){
        return [robots[robotID].x, robots[robotID].z]
      }
    }
    return false
  },
  getOwnPosition: function(roomName, playerId){
    const ownRobot = backendStore.getState().robots[roomName][playerId]
    return [ownRobot.x,ownRobot.z]
  },
  getOpponentsHealth: function(roomName,playerId){
    const robots = backendStore.getState().robots[roomName]
    for (var robotID in robots){
      if (robotID!==playerId){
        return [robots[robotID].health]
      }
    }
    return false
  },
  addRotation: function(roomName, playerId, degrees) {
    var theta = degrees *.0174533
    backendStore.dispatch( AddRotation(roomName, playerId, theta) )
    backendStore.dispatch( WalkForward(roomName, playerId) )
  },
  walkForward: function(roomName, playerId) {
    console.log('inside walkForward')
    if ( Date.now() > backendStore.getState().robots[roomName][playerId].walkTime ) {
      backendStore.dispatch( WalkForward(roomName, playerId) )
      backendStore.dispatch( UpdateWalkTime(roomName, playerId) )
    }
  },
  slowWalkForward:function(roomName, playerId) {
    if ( Date.now() > backendStore.getState().robots[roomName][playerId].walkTime ) {
      backendStore.dispatch( WalkFollowSpeed(roomName, playerId) )
      backendStore.dispatch( UpdateWalkTime(roomName, playerId) )
    }
  },
  onBoxCollision:function(roomName, id){
    this.addRotation(roomName, id, 45)
    this.walkForward(roomName, id)
  },
  walkTowardOpponent:function(roomName,playerId){
    if (this.findOpponent(roomName, playerId)){
      if ( Date.now() > backendStore.getState().robots[roomName][playerId].walkTime ) {
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

module.exports = leaveWall
