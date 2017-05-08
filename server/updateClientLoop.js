const backendStore = require('./backendStore.jsx');
const { robotReducer } = require('./robotReducer.js');
const SERVER_UPDATE_RATE = 1000/30;
const {Rotation,WalkForward} = require("./robotReducer")
let io;
let gameLoop;

// function RobotClass() {
//     this.health = 100;
//     this.direction;
// }
// RobotClass.prototype.hitWall = function() {
//     this.health--
// }
//
// RobotClass.prototype.rotation = function(playerId, theta) {
//   console.log('robotclass rotation', playerId, theta)
//     store.dispatch(Rotation(playerId, theta))
// }
//
// RobotClass.prototype.walkForward = function(playerId) {
//     store.dispatch(WalkForward(playerId))
// }

function broadcastGameState(io){
  // change when we add Rooms
  const gameLoop = setInterval(() => {
    let state = backendStore.getState();
    console.log('state in game loop', state)
    var playerArr = Object.keys(state)
    if (playerArr.length) {
      for(var i = 0; i < playerArr.length; i++){
        state[playerArr[i]].robotInstance.start(playerArr[i])
      }
      io.emit('serverUpdate', backendStore.getState());
    }
  }, SERVER_UPDATE_RATE);

}

module.exports =  broadcastGameState
