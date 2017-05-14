import store from './store'
import { ServerUpdate, AssignRoom } from "./reducers/robot.js"

const socket = io.connect()

socket.on('connect', function(){
  socket.emit('giveMeARoom')
})

socket.on('roomAssigned', function(myRoom){
  console.log('room assigned: ', myRoom)
  store.dispatch(AssignRoom(myRoom))
})

socket.on('serverUpdate', function(data){
  store.dispatch(ServerUpdate(data))
})

socket.on('gameOver', function(data){
  console.log("gamesoverdoeeeeee")
})

export default socket;