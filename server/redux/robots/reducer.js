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
    SET_USERNAME
} = require('./constants')


const initialState = require('./initialState')

function getRandomPosition(min, max) {
    var min = Math.ceil(min);
    var max = Math.floor(max);
    var rand = Math.floor(Math.random() * (max - min)) + min;
    while (rand > -140 && rand < 340) {
        rand = Math.floor(Math.random() * (max - min)) + min;
    }
    return rand;
}

const reducer = (state = initialState, action) => {
    const newState = state
    switch (action.type) {
        case ADD_OR_UPDATE_PLAYER:
            if (!action.roomName) {
                return newState
            } else {
                newState[action.roomName][action.socketId] = {
                    x: getRandomPosition(-699, 699),
                    y: 0,
                    z: getRandomPosition(-699, 699),
                    theta: Math.random() * 2 * Math.PI,
                    code: action.code,
                    health: 10,
                    fireTime: 0,
                    walkTime: 0,
                    counter: 0
                }
                return newState
            }
        case REMOVE_PLAYER:
            for (var room in newState) {
                for (var robot in newState[room]) {
                    if (robot === action.socketId) {
                        delete newState[room][robot]
                    }
                }
            }
            return newState
        case INCREMENT_COUNTER:
            newState[action.roomName][action.socketId] && (newState[action.roomName][action.socketId].counter = ++newState[action.roomName][action.socketId].counter)
            return newState
        case UPDATE_WALK_TIME:
            newState[action.roomName][action.socketId] && (newState[action.roomName][action.socketId].walkTime = Date.now() + 29)
            return newState
        case UPDATE_FIRE_TIME:
            newState[action.roomName][action.socketId] && (newState[action.roomName][action.socketId].fireTime = action.fireTime)
            return newState
        case ADD_ROTATION:
            newState[action.roomName][action.socketId] && (newState[action.roomName][action.socketId].theta = newState[action.roomName][action.socketId].theta + action.theta)
            return newState
        case WALK_AWAY_FROM_WALL:
            newState[action.roomName][action.socketId] && (newState[action.roomName][action.socketId].x = newState[action.roomName][action.socketId].x + 10 * Math.sin(newState[action.roomName][action.socketId].theta))
            newState[action.roomName][action.socketId] && (newState[action.roomName][action.socketId].z = newState[action.roomName][action.socketId].z + 10 * Math.cos(newState[action.roomName][action.socketId].theta))
            return newState
        case WALK_FORWARD:
            newState[action.roomName][action.socketId] && (newState[action.roomName][action.socketId] && (newState[action.roomName][action.socketId].x = newState[action.roomName][action.socketId].x + 5 * Math.sin(newState[action.roomName][action.socketId].theta)))
            newState[action.roomName][action.socketId] && (newState[action.roomName][action.socketId] && (newState[action.roomName][action.socketId].z = newState[action.roomName][action.socketId].z + 5 * Math.cos(newState[action.roomName][action.socketId].theta)))
            return newState
        case WALK_BACKWARD:
            newState[action.roomName][action.socketId] && (newState[action.roomName][action.socketId].x = newState[action.roomName][action.socketId].x - Math.sin(newState[action.roomName][action.socketId].theta))
            newState[action.roomName][action.socketId] && (newState[action.roomName][action.socketId].z = newState[action.roomName][action.socketId].z - Math.cos(newState[action.roomName][action.socketId].theta))
            return newState
        case DECREASE_HEALTH:
            newState[action.roomName][action.socketId] && (newState[action.roomName][action.socketId].health -= action.strength)
            return newState
        case SET_ROTATION:
            newState[action.roomName][action.socketId] && (newState[action.roomName][action.socketId].theta = action.theta)
            return newState
        case WALK_FOLLOW_SPEED:
            newState[action.roomName][action.socketId] && (newState[action.roomName][action.socketId].x = newState[action.roomName][action.socketId].x + 3 * Math.sin(newState[action.roomName][action.socketId].theta))
            newState[action.roomName][action.socketId] && (newState[action.roomName][action.socketId].z = newState[action.roomName][action.socketId].z + 3 * Math.cos(newState[action.roomName][action.socketId].theta))
            return newState
        case SET_USERNAME:
            newState[action.roomName][action.socketId] &&
                (newState[action.roomName][action.socketId].userName = action.userName)
            return newState
        default:
            return newState
    }
}

module.exports = {
    reducer
}
