const backendStore = require('./backendStore.jsx');
const { robotReducer } = require('./robotReducer.js');
const SERVER_UPDATE_RATE = 1000/30;
const {Rotation,WalkForward} = require("./robotReducer")
let io;
let gameLoop;

function broadcastGameState(io){
  // change when we add Rooms
  const gameLoop = setInterval(() => {
    let state = backendStore.getState();
    var playerArr = Object.keys(state)
    if (playerArr.length) {
      for(var i = 0; i < playerArr.length; i++){
        let robot = state[playerArr[i]];
        console.log('robotInstance here is ', robot.x, robot.y)
        if (Math.abs(robot.x) < 700 && Math.abs(robot.z) < 700) {
          robot.robotInstance.emit('start', playerArr[i])
        }
        else {
          robot.robotInstance.emit('onWallCollision', playerArr[i]);
        }
      }

      io.emit('serverUpdate', backendStore.getState());
    }
  }, SERVER_UPDATE_RATE);

}

module.exports =  broadcastGameState
