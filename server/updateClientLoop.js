const backendStore = require('./backendStore.jsx');
const { robotReducer } = require('./robotReducer.js');
const SERVER_UPDATE_RATE = 1000/30;
const {Rotation,WalkForward} = require("./robotReducer")
let io;
let gameLoop;

function RobotClass() {
    this.health = 100;
    this.direction;
}
RobotClass.prototype.hitWall = function() {
    this.health--
}

RobotClass.prototype.rotation = function(theta) {
    store.dispatch(Rotation(theta))
}

RobotClass.prototype.walkForward = function(playerId) {
    store.dispatch(WalkForward(playerId))
}

function broadcastGameState(io){
  // change when we add Rooms
  const gameLoop = setInterval(() => {
    let state = backendStore.getState();
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
