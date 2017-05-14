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
              io.emit("gameOver",robotID)
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
      var playerArr = Object.keys(state[roomName])
      if (playerArr.length) {
        for (var i = 0; i < playerArr.length; i++) {
          let robot = state[roomName][playerArr[i]];
          console.log("heyyyyy",robot.robotInstance)
          if(robot.robotInstance) {
            ///if the robot hits the wall
            if (Math.abs(robot.x) > 700 || Math.abs(robot.z) > 700) {
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
            //close and they have low health
            else if (robot.robotInstance.findOpponent(roomName, playerArr[i]) && distanceBetween([robot.x, robot.z], robot.robotInstance.findOpponent(roomName, playerArr[i])) < 350
            &&robot.robotInstance.getOpponentsHealth(roomName,playerArr[i])<3){
              console.log("closelowhealth",robot.robotInstance.getOpponentsHealth(roomName,playerArr[i]))
              var closeFinisherObjects = robot.robotInstance.onCloseFinisher()
              closeFinisherObjects.forEach((closeFinisherObject)=>{
                 if (userTime % closeFinisherObject.frequency === 0) {
                  if (closeFinisherObject.action.toString().indexOf('Fire') !== -1) {
                    closeFinisherObject.action.call(robot.robotInstance, roomName, playerArr[i], closeFinisherObject.degrees, closeFinisherObject.strength)
                  } else {
                    closeFinisherObject.action.call(robot.robotInstance, roomName, playerArr[i], closeFinisherObject.degrees)
                  }
                }
              })
            }

            ///far and they have low health
            else if (robot.robotInstance.getOpponentsHealth(roomName,playerArr[i])&&robot.robotInstance.getOpponentsHealth(roomName,playerArr[i])<3){
              console.log("farfinish",robot.robotInstance.getOpponentsHealth(roomName,playerArr[i]))
              var farFinisherObjects = robot.robotInstance.onFarFinisher()
              farFinisherObjects.forEach((farFinisherObject)=>{
                 if (userTime % farFinisherObject.frequency === 0) {
                  if (farFinisherObject.action.toString().indexOf('Fire') !== -1) {
                    farFinisherObject.action.call(robot.robotInstance, roomName, playerArr[i], farFinisherObject.degrees, farFinisherObject.strength)
                  } else {
                    farFinisherObject.action.call(robot.robotInstance, roomName, playerArr[i], farFinisherObject.degrees)
                  }
                }
              })
            }

            //close
            else if (robot.robotInstance.findOpponent(roomName, playerArr[i]) && distanceBetween([robot.x, robot.z], robot.robotInstance.findOpponent(roomName, playerArr[i])) < 350) {
               console.log("close")
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
            //onidle
            else {
              var actionObjects = robot.robotInstance.onIdle()
              actionObjects.forEach((actionObject) => {
                console.log("action",actionObject)
                if (userTime % actionObject.frequency === 0) {
                  if (actionObject.action.toString().indexOf('Fire') !== -1) {
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
      // io.to(roomName).emit('serverUpdate', backendStore.getState());
      // console.log('ENTIRE BACKEND STORE', backendStore.getState())
    }
    // loop through the rooms
    var rooms = {
      1: 'Blueberry',
      2: 'Cherry',
      3: 'Strawberry',
      4: 'Watermelon'
    }
    for (var num in rooms) {
      var room = rooms[num]

      var storeToSend = {
        projectiles: backendStore.getState().projectiles[room],
        robots: backendStore.getState().robots[room]
      }
      // console.log(room,storeToSend)
      io.sockets.to(room).emit('serverUpdate', storeToSend);
    }
    // console.log('BACKEND STORE', backendStore.getState())
  }, SERVER_UPDATE_RATE);
}

module.exports =  broadcastGameState
