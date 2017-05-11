const backendStore = require('./backendStore.js');
const { robotReducer } = require('./robotReducer.js');
const SERVER_UPDATE_RATE = 1000/30;
const { Rotation, WalkForward } = require("./robotReducer")
const { MoveOneForward, RemoveProjectile, DecreaseHealth } = require("./projectileReducer")

let io;
let gameLoop;

const MoveForward = () => {
  var projectiles = backendStore.getState().projectiles
  for(var projectile in projectiles) {
    backendStore.dispatch(MoveOneForward(projectile))
  }
}

// positions for walls and boxes


function checkProjectilesToRemove(){
  var robotsObj = backendStore.getState().robots
  var projectileObj = backendStore.getState().projectiles

  for(var projectileId in projectileObj){
    var projectile = projectileObj[projectileId]
    console.log('projectile', projectile)
    if(Math.abs(projectile.x) > 800 || Math.abs(projectile.z) > 800 ){
      backendStore.dispatch(RemoveProjectile(projectileId))
    }
    else if(projectile.x < 140 && projectile.x > -140 && projectile.z < 140 && projectile.z > -140){
      backendStore.dispatch(RemoveProjectile(projectileId))
    }
    else if ( projectile.x > 148 && projectile.x < 332 && projectile.z < 92 && projectile.z > -92 ) {
      backendStore.dispatch(RemoveProjectile(projectileId))
    }
    for(var robotID in robotsObj){
      var robot = robotsObj[robotID]

      if(Math.abs(robot.x - projectile.x) < 3 && Math.abs(robot.z - projectile.z) < 3 ){
        backendStore.dispatch(DecreaseHealth(robotId, projectile.strength))
        backendStore.dispatch(RemoveProjectile(projectileId))
      }
    }
  }


}


function broadcastGameState(io){
  // change when we add Rooms
  const gameLoop = setInterval(() => {
    let state = backendStore.getState().robots;
    var playerArr = Object.keys(state)
    if (playerArr.length) {
      for(var i = 0; i < playerArr.length; i++){
        state[playerArr[i]].robotInstance.start(playerArr[i])
      }
      MoveForward()
      checkProjectilesToRemove()
      io.emit('serverUpdate', backendStore.getState());
    }
  }, SERVER_UPDATE_RATE);

}

module.exports =  broadcastGameState
