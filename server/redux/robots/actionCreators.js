const {
    ADD_OR_UPDATE_PLAYER,
    REMOVE_PLAYER,
    INCREMENT_COUNTER,
    UPDATE_WALK_TIME,
    UPDATE_FIRE_TIME,
    ADD_ROTATION,
    WALK_AWAY_FROM_WALL,
    WALK_FORWARD,
    WALK_BACKWARD,
    DECREASE_HEALTH,
    SET_ROTATION,
    WALK_FOLLOW_SPEED,
    SET_USERNAME,
    SET_COLOR
} = require('./constants')

const walkFollowSpeed = (roomName, socketId) => ({
    type: WALK_FOLLOW_SPEED,
    socketId,
    roomName
})
const incrementCounter = (roomName, socketId) => ({
    type: INCREMENT_COUNTER,
    socketId,
    roomName
})
const addOrUpdatePlayer = (roomName, socketId, code) => ({
    type: ADD_OR_UPDATE_PLAYER,
    socketId,
    roomName,
    code
})
const setUserName = (roomName, socketId, userName) => ({
    type: SET_USERNAME,
    socketId,
    roomName,
    userName
})
const setColorUser = (roomName, socketId, color) => ({
    type: SET_COLOR,
    socketId,
    roomName,
    color
})
const removePlayer = (socketId) => ({
    type: REMOVE_PLAYER,
    socketId
})
const updateFireTime = (roomName, socketId, fireTime) => ({
    type: UPDATE_FIRE_TIME,
    socketId,
    fireTime,
    roomName
})
const updateWalkTime = (roomName, socketId) => ({
    type: UPDATE_WALK_TIME,
    socketId,
    roomName
})
const walkAwayFromWall = (roomName, socketId) => ({
    type: WALK_AWAY_FROM_WALL,
    socketId,
    roomName
})
const walkForward = (roomName, socketId) => ({
    type: WALK_FORWARD,
    socketId,
    roomName
})
const walkBackward = (roomName, socketId) => ({
    type: WALK_BACKWARD,
    socketId,
    roomName
})
const addRotation = (roomName, socketId, theta) => ({
    type: ADD_ROTATION,
    socketId,
    theta,
    roomName
})
const decreaseHealth = (roomName, socketId, strength) => ({
    type: DECREASE_HEALTH,
    socketId,
    strength,
    roomName
})
const setRotation = (roomName, socketId, theta) => ({
    type: SET_ROTATION,
    theta,
    socketId,
    roomName
})

module.exports = {
    walkFollowSpeed,
    addOrUpdatePlayer,
    incrementCounter,
    setUserName,
    removePlayer,
    updateFireTime,
    updateWalkTime,
    walkAwayFromWall,
    walkForward,
    walkBackward,
    addRotation,
    decreaseHealth,
    setRotation,
    setColorUser
}
