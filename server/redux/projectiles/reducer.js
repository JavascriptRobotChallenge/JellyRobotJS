const {
    FIRE_PROJECTILE,
    MOVE_ONE_FORWARD,
    REMOVE_PROJECTILE,
    REMOVE_PROJECTILES_ON_LEAVE
} = require('./constants.js')
const initialState = require('./initialState')

const reducer = (state = initialState, action) => {
    var newState = state
    switch (action.type) {
        case FIRE_PROJECTILE:
            projectileId = Math.floor(Math.random() * 98643785).toString(),
                newState[action.roomName][projectileId] = {
                    x: action.position.x,
                    y: action.position.y,
                    z: action.position.z,
                    theta: action.theta,
                    strength: action.strength,
                    id: action.robotId
                }
            return newState
        case MOVE_ONE_FORWARD:
            newState[action.roomName][action.projectileId].x = newState[action.roomName][action.projectileId].x + 15 * Math.sin(newState[action.roomName][action.projectileId].theta)
            newState[action.roomName][action.projectileId].z = newState[action.roomName][action.projectileId].z + 15 * Math.cos(newState[action.roomName][action.projectileId].theta)
            return newState
        case REMOVE_PROJECTILE:
            delete newState[action.roomName][action.projectileId]
            return newState
        case REMOVE_PROJECTILES_ON_LEAVE:
            for (var room in newState) {
                for (var projectile in newState[room]) {
                    ///this checks if the robot associated with the projectile matches the socket of the user that just left the room
                    if (newState[room][projectile].id === action.id) {
                        delete newState[room][projectile]
                    }
                }
            }
            return newState
    }
    return newState
}

module.exports = {
    reducer
}