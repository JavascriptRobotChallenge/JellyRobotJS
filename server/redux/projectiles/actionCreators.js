const {
    FIRE_PROJECTILE,
    MOVE_ONE_FORWARD,
    REMOVE_PROJECTILE,
    REMOVE_PROJECTILES_ON_LEAVE,
} = require('./constants.js')

const fireProjectile = (roomName, robotId, robot, theta, strength) => ({
    type: FIRE_PROJECTILE,
    roomName,
    robotId: robotId,
    position: {
        x: robot.x,
        y: robot.y,
        z: robot.z
    },
    theta: theta,
    strength,
})

const removeProjectile = (roomName, projectileId) => ({
    type: REMOVE_PROJECTILE,
    roomName,
    projectileId
})

const moveOneForward = (roomName, projectileId) => ({
    type: MOVE_ONE_FORWARD,
    roomName,
    projectileId
})

const removeProjectilesOnLeave = (socketId) => ({
    type: REMOVE_PROJECTILES_ON_LEAVE,
    id: socketId
})

module.exports = {
    fireProjectile,
    moveOneForward,
    removeProjectile,
    removeProjectilesOnLeave
}