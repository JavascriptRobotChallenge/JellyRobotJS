import {
    browserHistory
} from 'react-router';

import store from './store'
import {
    serverUpdate,
    assignRoom
} from "./redux/game/actionCreators"

const socket = io.connect()

socket.on('connect', function() {
})

socket.on('roomAssigned', function(myRoom) {
    console.log('room assigned: ', myRoom)
    store.dispatch(assignRoom(myRoom))
})

socket.on('trainingRoomAssigned', function(myRoom) {
    store.dispatch(assignRoom(myRoom))
    const room = store.getState().game.room
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
    store.dispatch(serverUpdate(data))
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
    const room = store.getState().game.room
    socket.emit('leaveRoom', room)
    browserHistory.push('/tie');
})

export default socket;
