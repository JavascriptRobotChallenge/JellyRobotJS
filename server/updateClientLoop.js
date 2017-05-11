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
  var userTime = 0;
  // change when we add Rooms
  const gameLoop = setInterval(() => {
    userTime++;
    let state = backendStore.getState();
    var playerArr = Object.keys(state)
    if (playerArr.length) {
      for(var i = 0; i < playerArr.length; i++){
        let robot = state[playerArr[i]];
        console.log('robotInstance here is ', robot.x, robot.y, robot.z)
        console.log(Math.abs(robot.x), Math.abs(robot.z), 'this is the positon o fhte robot')
        ///if the robot hits the wall
        if (Math.abs(robot.x) > 700 || Math.abs(robot.z) > 700) {
          robot.robotInstance.emit('onWallCollision', playerArr[i]);
        }
        ///if the robot hits a box
        else if((robot.x <140 && robot.x>-140 && robot.z<140 && robot.z>-140)||
          (robot.x>148 && robot.x<332 && robot.z<92 && robot.z>-92)){
          robot.robotInstance.emit("onBoxCollision", playerArr[i])
        }
        else{
          var actionObjects = robot.robotInstance.onIdle(playerArr[i])
          actionObjects.forEach((actionObject) => {
            if(userTime % actionObject.frequency === 0){
              console.log(actionObject, 'here si the action object', userTime)
              actionObject.action.call(robot.robotInstance, playerArr[i], actionObject.degrees)
            }
          })
          // robot.robotInstance.emit('onIdle', playerArr[i])
        }
      }
      MoveForward()
      checkProjectilesToRemove()
      io.emit('serverUpdate', backendStore.getState());
    }
  }, SERVER_UPDATE_RATE);

}

//return [()=>{this.walkForward.bind(null, timesToCall, id)}, ()=>{this.rotation.bind(null, 1, id)}]
module.exports =  broadcastGameState
