const backendStore = require('./backendStore.jsx');
const { robotReducer } = require('./robotReducer.js');
const SERVER_UPDATE_RATE = 1000/30;
const { Rotation, WalkForward } = require("./robotReducer")
const { MoveForward } = require("./projectileReducer")

let io;
let gameLoop;

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
      io.emit('serverUpdate', backendStore.getState());
    }
  }, SERVER_UPDATE_RATE);

}

module.exports =  broadcastGameState
