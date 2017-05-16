import store from './store'
import { ServerUpdate, AssignRoom } from "./reducers/frontendStore"

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

socket.on('clientCodeError', function(){
  // something with toastr
})

socket.on('gameOver', function(loser){
  if ((socket.id)===loser){
    alert("You are trash")
    socket.emit("disconnect")
  }
  else{
    alert("you are ok")
    socket.emit("disconnect")
  }
})

export default socket;
