const backendStore = require('./backendStore.jsx');
const { robotReducer } = require('./robotReducer.js');

const SERVER_UPDATE_RATE = 1000/30;

let io;
let gameLoop;

const broadcastGameState = (io) => {
  gameLoop = setInterval(() => {
    let state = backendStore.getState();
    if (Object.keys(state).length) {
      io.emit('serverUpdate', state);
    }
  }, SERVER_UPDATE_RATE);

}

module.exports = { broadcastGameState };
