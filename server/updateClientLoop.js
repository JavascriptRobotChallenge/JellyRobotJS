const backendStore = require('./reducers/backendStore.js');
const { robotReducer } = require('./reducers/robotReducer.js');
const SERVER_UPDATE_RATE = 1000/30;
const { Rotation, WalkForward, DecreaseHealth } = require("./reducers/robotReducer")
const { MoveOneForward, RemoveProjectile } = require("./reducers/projectileReducer")

let io;
let gameLoop;

function distanceBetween(arrOne, arrTwo){
  return Math.sqrt(Math.pow(arrTwo[0]-arrOne[0],2)+(Math.pow(arrTwo[1]-arrOne[1]),2))
}

const MoveForward = (roomName) => {
  var projectiles = backendStore.getState().projectiles[roomName]

  for(var projectile in projectiles) {
    backendStore.dispatch(MoveOneForward(roomName, projectile))
  }
}

// positions for walls and boxes
function checkProjectilesToRemove() {
  var robotsObj = backendStore.getState().robots
  var projectileObjRooms = backendStore.getState().projectiles

  for (var room in projectileObjRooms) {
    let projectileObj = projectileObjRooms[room]
    for (var projectileId in projectileObj) {
      var projectile = projectileObj[projectileId]
      if (Math.abs(projectile.x) > 800 || Math.abs(projectile.z) > 800) {
        backendStore.dispatch(RemoveProjectile(room, projectileId))
      }
      else if (projectile.x < 140 && projectile.x > -140 && projectile.z < 140 && projectile.z > -140) {
        backendStore.dispatch(RemoveProjectile(room, projectileId))
      }
      else if (projectile.x > 148 && projectile.x < 332 && projectile.z < 92 && projectile.z > -92) {
        backendStore.dispatch(RemoveProjectile(room, projectileId))
      }

      for (var robotID in robotsObj[room]) {
        var robot = robotsObj[room][robotID]

        if (robotID !== projectile.id) {
          if (Math.sqrt(Math.pow(robot.x - projectile.x, 2) + Math.pow(robot.z - projectile.z, 2)) < 20) {
            backendStore.dispatch(DecreaseHealth(room, robotID, projectile.strength))
            backendStore.dispatch(RemoveProjectile(room, projectileId))
            if (robot.health < 1) {
              io.emit("gameOver", robotID)
            }
          }
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

    for(var roomName in state) {
      console.log(state[roomName], 'this the state for that roomname')
      var playerArr = Object.keys(state[roomName])
      console.log(playerArr, 'this the player store')
      if (playerArr.length) {
        for (var i = 0; i < playerArr.length; i++) {
          let robot = state[roomName][playerArr[i]];
          if(robot.robotInstance) {
            ///if the robot hits the wall
            if (Math.abs(robot.x) > 700 || Math.abs(robot.z) > 700) {
              console.log(robot.x, robot.z)
              if (robot.x > 700) {
                robot.robotInstance.perp(roomName, playerArr[i], 1.5 * Math.PI)
              }
              else if (robot.x < -700) {
                robot.robotInstance.perp(roomName, playerArr[i], 0.5 * Math.PI)
              }
              else if (robot.z > 700) {
                robot.robotInstance.perp(roomName, playerArr[i], Math.PI)
              }
              else if (robot.z < -700) {
                robot.robotInstance.perp(roomName, playerArr[i], 0)
              }
            }
            ///if the robot hits a box
            else if ((robot.x < 140 && robot.x > -140 && robot.z < 140 && robot.z > -140) ||
              (robot.x > 148 && robot.x < 332 && robot.z < 92 && robot.z > -92)) {
              robot.robotInstance.onBoxCollision(roomName, playerArr[i])
            }
            else if (robot.robotInstance.findOpponent(roomName, playerArr[i]) && distanceBetween([robot.x, robot.z], robot.robotInstance.findOpponent(roomName, playerArr[i])) < 350) {
              var closeObjects = robot.robotInstance.onClose(roomName, playerArr[i])
              closeObjects.forEach((closeObject) => {
                if (userTime % closeObject.frequency === 0) {
                  if (closeObject.action.toString().indexOf('Fire') !== -1) {
                    closeObject.action.call(robot.robotInstance, roomName, playerArr[i], closeObject.degrees, closeObject.strength)
                  } else {
                    closeObject.action.call(robot.robotInstance, roomName, playerArr[i], closeObject.degrees)
                  }
                }
              })
            }
            else {
              var actionObjects = robot.robotInstance.onIdle(roomName, playerArr[i])
              actionObjects.forEach((actionObject) => {
                if (userTime % actionObject.frequency === 0) {
                  if (actionObject.action.toString().indexOf('Fire') !== -1) {
                    consol.
                    actionObject.action.call(robot.robotInstance, roomName, playerArr[i], actionObject.degrees, actionObject.strength)
                  } else {
                    actionObject.action.call(robot.robotInstance, roomName, playerArr[i], actionObject.degrees)
                  }
                }
              })
            }
            MoveForward(roomName)
            checkProjectilesToRemove()
          }
        }
      }
    }
    // loop through the rooms
    var rooms = {
      1: 'Blueberry',
      2: 'Cherry',
      3: 'Strawberry',
      4: 'Watermelon'
    }
    for (var num in rooms) {
      const room = rooms[num]
      const storeToSend = {
        projectiles: backendStore.getState().projectiles[room],
        robots: backendStore.getState().robots[room]
      }
      io.to(room).emit('serverUpdate', storeToSend);
    }
  }, SERVER_UPDATE_RATE);
}

module.exports =  broadcastGameState
