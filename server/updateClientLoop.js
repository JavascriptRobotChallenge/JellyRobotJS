const backendStore = require('./reducers/backendStore.js');
const { robotReducer } = require('./reducers/robotReducer.js');
const SERVER_UPDATE_RATE = 1000/30;
const { Rotation, WalkForward, DecreaseHealth } = require("./reducers/robotReducer")
const { MoveOneForward, RemoveProjectile } = require("./reducers/projectileReducer")

let io;
let gameLoop;

const MoveForward = (roomName) => {
  var projectiles = backendStore.getState().projectiles[roomName]
  for(var projectile in projectiles) {
    backendStore.dispatch(MoveOneForward(roomName, projectile))
  }
}

// positions for walls and boxes
function checkProjectilesToRemove(){
  var robotsObj = backendStore.getState().robots
  var projectileObjRooms = backendStore.getState().projectiles

  for(var room in projectileObjRooms){
    let projectileObj = projectileObjRooms[room]
    for(var projectileId in projectileObj){
      var projectile = projectileObj[projectileId]
      if(Math.abs(projectile.x) > 800 || Math.abs(projectile.z) > 800 ){
        backendStore.dispatch(RemoveProjectile(room, projectileId))
      }
      else if(projectile.x < 140 && projectile.x > -140 && projectile.z < 140 && projectile.z > -140){
        backendStore.dispatch(RemoveProjectile(room, projectileId))
      }
      else if ( projectile.x > 148 && projectile.x < 332 && projectile.z < 92 && projectile.z > -92 ) {
        backendStore.dispatch(RemoveProjectile(room, projectileId))
      }
      for(var robotID in robotsObj){
        var robot = robotsObj[robotID]

        if(Math.abs(robot.x - projectile.x) < 22 && Math.abs(robot.z - projectile.z) < 22 ){
          console.log('hit registered')

          backendStore.dispatch(DecreaseHealth(robotID, projectile.strength))

          backendStore.dispatch(RemoveProjectile(projectileId))
        }
      }
    }
  }
}

function broadcastGameState(io){
  var userTime = 0;
  // change when we add Rooms
  const gameLoop = setInterval(() => {
    userTime++;
    let state = backendStore.getState().robots
    for(var roomName in state){
      var playerArr = Object.keys(state[roomName])
      if (playerArr.length) {
        for (var i = 0; i < playerArr.length; i++){
          let robot = state[roomName][playerArr[i]];
          if(robot.robotInstance) {
            ///if the robot hits the wall
            if (Math.abs(robot.x) > 700 || Math.abs(robot.z) > 700) {
              robot.robotInstance.emit('onWallCollision', roomName, playerArr[i]);
            }
            ///if the robot hits a box
            else if ((robot.x < 140 && robot.x > -140 && robot.z < 140 && robot.z > -140) ||
              (robot.x > 148 && robot.x < 332 && robot.z < 92 && robot.z > -92)) {
              robot.robotInstance.emit("onBoxCollision", roomName, playerArr[i])
            }
            else {
              var actionObjects = robot.robotInstance.onIdle(roomName, playerArr[i])
              actionObjects.forEach((actionObject) => {
                if (userTime % actionObject.frequency === 0) {
                  if (actionObject.action.toString().indexOf('Fire') !== -1) {
                    actionObject.action.call(robot.robotInstance, roomName, playerArr[i], actionObject.degrees, actionObject.strength)
                  } else {
                    actionObject.action.call(robot.robotInstance, roomName, playerArr[i], actionObject.degrees)
                  }
                }
              })
            }
          }
        }
        MoveForward(roomName)
        checkProjectilesToRemove()

        // with rooms, we can broadcast to only that room
        io.emit('serverUpdate', backendStore.getState());
        // state.robots[roomName]
        // state.robots[roomName]
        // get the room from the projectile part of the state, and the robot part of the state, and
      }
    }
  }, SERVER_UPDATE_RATE);
}

module.exports =  broadcastGameState
