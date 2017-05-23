import store from './store'
import {
    ServerUpdate,
    AssignRoom
} from "./reducers/frontendStore"
import {
    browserHistory
} from 'react-router';

const socket = io.connect()

socket.on('connect', function() {
    // socket.emit('giveMeARoom')
})

socket.on('roomAssigned', function(myRoom) {
    console.log('room assigned: ', myRoom)
    store.dispatch(AssignRoom(myRoom))
})

socket.on('trainingRoomAssigned', function(myRoom) {
    store.dispatch(AssignRoom(myRoom))
    const room = store.getState().gameData.room
    console.log('trainingRoomAssigned', room)
})

socket.on('tooManyPlayers', function(alertMsg) {
    const canvases = [...document.getElementsByTagName('canvas')]
    canvases.forEach(canvas => {
        canvas.remove()
    })
    browserHistory.push('/home')
    alert(alertMsg)
})

socket.on('serverUpdate', function(data) {
    store.dispatch(ServerUpdate(data))
})

socket.on('gameOver', function(loser) {
    if ((socket.id) === loser) {
        socket.emit('leaveRoom')
        browserHistory.push('/loss');
    } else {
        socket.emit('leaveRoom')
        browserHistory.push('/win');
    }
})

socket.on('tie', function() {
    const room = store.getState().gameData.room
    socket.emit('leaveRoom', room)
    browserHistory.push('/tie');
})

export default socket;