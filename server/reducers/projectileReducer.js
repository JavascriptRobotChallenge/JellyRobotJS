const _ = require('lodash')

var initialState = {
  'Blueberry': {},
  'Cherry': {},
  'Strawberry': {},
  'Watermelon': {}
}

const reducer = ( state = {}, action) => {
  const newState = _.merge({}, state)
  Object.freeze(state)

    switch (action.type) {
      case "FireProjectile":
        projectileId = Math.floor(Math.random()*98643785).toString(),
        newState[action.roomName][projectileId] = { x: action.position.x, y: action.position.y, z: action.position.z, theta: action.theta, strength: action.strength }
        return newState
      case "MoveOneForward":
        newState[action.roomName][action.projectileId].x = newState[action.roomName][action.projectileId].x + 15 * Math.sin(newState[action.roomName][action.projectileId].theta)
        newState[action.roomName][action.projectileId].z = newState[action.roomName][action.projectileId].z + 15 * Math.cos(newState[action.roomName][action.projectileId].theta)
        return newState
      case "RemoveProjectile":
        delete newState[action.roomName][action.projectileId]
        return newState
    }
    return newState
}

const FireProjectile = (roomName, robot, theta, strength) => {
  return {
    type: "FireProjectile",
    position: { x: robot.x + 20 * Math.sin(theta), y: robot.y, z: robot.z + 20 * Math.cos(theta)},
    theta: theta,
    strength
  }
}

const RemoveProjectile = (roomName, projectileId) => ({
    type: "RemoveProjectile",
    projectileId
})

const MoveOneForward = (roomName, projectileId) => ({
  type: "MoveOneForward",
  projectileId
})

module.exports = { reducer, FireProjectile, MoveOneForward, RemoveProjectile }
