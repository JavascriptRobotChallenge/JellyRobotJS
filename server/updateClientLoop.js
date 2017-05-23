const backendStore = require('./reducers/backendStore.js');
const { robotReducer } = require('./reducers/robotReducer.js');
const SERVER_UPDATE_RATE = 33;
const { FireProjectile, RemoveProjectile, MoveOneForward, RemoveProjectilesOnLeave } = require('./reducers/projectileReducer')
const { WalkFollowSpeed, AddOrUpdatePlayer, RemovePlayer, UpdateFireTime, UpdateWalkTime, WalkAwayFromWall, WalkForward, WalkBackward, AddRotation, DecreaseHealth, SetRotation } = require('./reducers/robotReducer')
const scripts = require('./scripts')

let io;
let gameLoop;
let playerId;


const MoveForward = (roomName) => {
  var projectiles = backendStore.getState().projectiles[roomName]
  for(var projectile in projectiles) {
    backendStore.dispatch(MoveOneForward(roomName, projectile))
  }
}

const leaveWall = function(roomName, playerId, theta) {
  backendStore.dispatch( SetRotation(roomName, playerId, theta) )
  backendStore.dispatch( WalkAwayFromWall(roomName, playerId) )
}

// positions for walls and boxes
function checkProjectilesToRemove(io) {
  var robotsObj = backendStore.getState().robots
  var projectileObjRooms = backendStore.getState().projectiles
  for (let room in projectileObjRooms) {
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

        if (robotID !== projectile.id && robot.code) {
          if (Math.sqrt(Math.pow(robot.x - projectile.x, 2) + Math.pow(robot.z - projectile.z, 2)) < 20) {
            backendStore.dispatch(DecreaseHealth(room, robotID, projectile.strength))
            backendStore.dispatch(RemoveProjectile(room, projectileId))
            if (robot.health < 1) {
              io.sockets.to(room).emit('gameOver',robotID);
              // io.emit("gameOver",robotID)
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
          console.log(roomName, 'here is the roomname')
          let robot = state[roomName][playerArr[i]];
          if(robot.code) {
            ///if the robot hits the wall
            if (Math.abs(robot.x) > 700 || Math.abs(robot.z) > 700) {
              if (robot.x > 700) {
                leaveWall(roomName, playerArr[i], 1.5 * Math.PI)
              }
              else if (robot.x < -700) {
                leaveWall(roomName, playerArr[i], 0.5 * Math.PI)
              }
              else if (robot.z > 700) {
                leaveWall(roomName, playerArr[i], Math.PI)
              }
              else if (robot.z < -700) {
                leaveWall(roomName, playerArr[i], 0)
              }
            }
            ///if the robot hits a box
            else if ((robot.x < 140 && robot.x > -140 && robot.z < 140 && robot.z > -140) || (robot.x > 148 && robot.x < 332 && robot.z < 92 && robot.z > -92)) {
              //if hit inside of boxes just go upwards (in z direction) could be combined with upward conditional below
              if (robot.x > 134 && robot.x < 140||robot.x>148&&robot.x<153){
                leaveWall(roomName,playerArr[i],0)
              }
              //hit the side (x) of box and go in positive x direction
              else if (robot.x > 327 && robot.x < 332 ) {
                leaveWall(roomName, playerArr[i], 0.5 * Math.PI )
              }
              //hit the negative x side of large box and move in negative x direction
              else if (robot.x < -134 && robot.x > -140) {
                leaveWall(roomName, playerArr[i], 1.5 * Math.PI)
              }
              //hit the top (z) of either box and move in positive z direction
              else if (robot.z > 134 && robot.z < 140 || robot.z > 87 && robot.z < 92 ) {
                leaveWall(roomName, playerArr[i], 0)
              }
              //hit the bottom(z) of either box and move in negative z direction
              else if (robot.z < -134 && robot.z > -140 || robot.z > -92 && robot.z < -87) {
                leaveWall(roomName, playerArr[i], Math.PI)
              }
            }
            else {
              console.log("testingdenise",roomName)
              let currState = backendStore.getState()
              let currRobots = currState.robots[roomName]
              let playerId = playerArr[i]
              let roomName = roomName
              let currProjectiles = currState.projectiles[roomName]
              let roomState = Object.assign({}, {robots: currRobots}, {projectiles: currProjectiles})
              var code = backendStore.getState().robots[roomName][playerArr[i]].code;
              scripts.time[playerArr[i]] = Date.now()
                scripts[playerArr[i]].run("start", {
                  code: code,
                  initialState: roomState,
                  roomName: roomName,
                  playerId: playerId
                })
            }
            MoveForward(roomName)
            checkProjectilesToRemove(io)
          }
        }
      }
    }
    // loop through the rooms
    var rooms = {
      1: 'Blueberry',
      2: 'Cherry',
      3: 'Strawberry',
      4: 'Watermelon',
      5: 'Banana',
      6: 'Mango'
    }
    for (var num in rooms) {
      var room = rooms[num]
      var storeToSend = {
        projectiles: backendStore.getState().projectiles[room],
        robots: backendStore.getState().robots[room]
      }
      io.sockets.to(room).emit('serverUpdate', storeToSend);
    }
  }, SERVER_UPDATE_RATE);
}

module.exports =  { broadcastGameState, SERVER_UPDATE_RATE }
