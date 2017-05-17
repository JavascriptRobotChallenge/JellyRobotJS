import store from './store'
import { ServerUpdate, AssignRoom } from "./reducers/frontendStore"
import { browserHistory } from 'react-router';

const socket = io.connect()

socket.on('connect', function(){
  // socket.emit('giveMeARoom')
})

socket.on('roomAssigned', function(myRoom){
  console.log('room assigned: ', myRoom)
  store.dispatch(AssignRoom(myRoom))
})

socket.on('trainingRoomAssigned', function(myRoom) {
  store.dispatch(AssignRoom(myRoom))
  const testRobots = store.getState().gameData.testRobots
  const room = store.getState().gameData.room
  console.log('trainingRoomAssigned', myRoom)

  socket.emit('setTestRobot', room, testRobots)
})


socket.on('serverUpdate', function(data){
  store.dispatch(ServerUpdate(data))
})

socket.on('gameOver', function(loser){
  if ((socket.id)===loser){
    const room = store.getState().gameData.room
    console.log('room', room)
    socket.emit('leaveRoom', room)
    browserHistory.push('/loss');
  } else {
    const room = store.getState().gameData.room
    socket.emit('leaveRoom', room)
    browserHistory.push('/win');
  }
})

socket.on('tie',function(){
  const room = store.getState().gameData.room
  socket.emit('leaveRoom', room)
  browserHistory.push('/tie');
})

export default socket;
