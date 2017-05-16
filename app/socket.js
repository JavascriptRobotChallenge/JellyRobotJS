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

socket.on('serverUpdate', function(data){
  store.dispatch(ServerUpdate(data))
})

socket.on('gameOver', function(loser){
  if ((socket.id)===loser){
    socket.emit("leaveRoom")
    browserHistory.push('/loss');
  }
  else{
    socket.emit("leaveRoom")
    browserHistory.push('/win');
  }
})

export default socket;
