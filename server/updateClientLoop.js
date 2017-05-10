const backendStore = require('./backendStore.js');
const { robotReducer } = require('./robotReducer.js');
const SERVER_UPDATE_RATE = 1000/30;
const { Rotation, WalkForward } = require("./robotReducer")
const { MoveOneForward } = require("./projectileReducer")

let io;
let gameLoop;

const MoveForward = () => {
  var projectiles = backendStore.getState().projectiles
  for(var projectile in projectiles) {
    console.log("projectiles",projectiles)
    console.log("projectile",projectile)

    backendStore.dispatch(MoveOneForward(projectile))
  }
}


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
