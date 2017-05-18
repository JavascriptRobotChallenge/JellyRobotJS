const backendStore = require('./reducers/backendStore')
const { robotReducer } = require('./reducers/robotReducer.js');
const SERVER_UPDATE_RATE = 33;
var { FireProjectile, RemoveProjectile, MoveOneForward, RemoveProjectilesOnLeave } = require("./reducers/projectileReducer")
var { WalkFollowSpeed, AddOrUpdatePlayer, RemovePlayer, UpdateFireTime, UpdateWalkTime, WalkAwayFromWall, WalkForward, WalkBackward, AddRotation, DecreaseHealth, SetRotation } = require("./reducers/robotReducer")

const async = require("async")

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

let io;
let gameLoop;

const MoveForward = (roomName) => {
  var projectiles = backendStore.getState().projectiles[roomName]
  for(var projectile in projectiles) {
    backendStore.dispatch(MoveOneForward(roomName, projectile))
  }
}

// positions for walls and boxes
function checkProjectilesToRemove(io) {
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
              var code = backendStore.getState().robots[roomName][playerArr[i]].code;

              var SandCastle = require('sandcastle').SandCastle;
              var sandcastle = new SandCastle({api: './server/APIexports.js'});

              var script = sandcastle.createScript(`exports = {
                  start: function(){ setup(initialState) ; ${code}; exit(getActionQueue()) }
              }`);

              script.run("start", {
                code: code,
                initialState: backendStore.getState(),
              });

              console.log('robot position: ', robot.x, robot.z)

              script.on('exit', function(err, output, methodName) {
                  console.log('output ', output, typeof output, 'err', err); // Hello World!
                  output.forEach(action => {
                    backendStore.dispatch(action)
                  })
              });

              // take note that a single script should only be
              // executing a single method at a time.



              // var cb = null;
              // async.eachLimit(['start', 'distanceBetween', 'hello'], 1, function(item, _cb) {
              //   cb = _cb;
              //   script.run(item, {name: 'Ben'});
              // });

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
      4: 'Watermelon'
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
