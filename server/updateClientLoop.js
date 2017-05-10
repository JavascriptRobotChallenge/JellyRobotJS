const backendStore = require('./backendStore.jsx');
const { robotReducer } = require('./robotReducer.js');
const SERVER_UPDATE_RATE = 1000/30;
const {Rotation,WalkForward} = require("./robotReducer")
let io;
let gameLoop;

function broadcastGameState(io){
  var userTime = 0;
  // change when we add Rooms
  const gameLoop = setInterval(() => {
    userTime++;
    let state = backendStore.getState();
    var playerArr = Object.keys(state)
    if (playerArr.length) {
      for(var i = 0; i < playerArr.length; i++){
        let robot = state[playerArr[i]];
        console.log('robotInstance here is ', robot.x, robot.y, robot.z)
        if (Math.abs(robot.x) < 700 && Math.abs(robot.z) < 700) {
          var actionObjects = robot.robotInstance.onIdle(playerArr[i])
          actionObjects.forEach((actionObject) => {
            if(userTime % actionObject.frequency === 0){
              console.log(actionObject, 'here si the action object')
              actionObject.action.call(robot.robotInstance, playerArr[i],actionObject.degrees)
            }
          })
              // robot.robotInstance.emit('onIdle', playerArr[i])
        }
        else {
          robot.robotInstance.emit('onWallCollision', playerArr[i]);
        }
      }

      io.emit('serverUpdate', backendStore.getState());
    }
  }, SERVER_UPDATE_RATE);

}

//return [()=>{this.walkForward.bind(null, timesToCall, id)}, ()=>{this.rotation.bind(null, 1, id)}]
module.exports =  broadcastGameState
