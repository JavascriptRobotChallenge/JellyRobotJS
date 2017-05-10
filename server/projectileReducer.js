const _ = require('lodash')

var initialState = {}

const reducer = ( state = {}, action) => {
  const newState = _.merge({}, state)
  Object.freeze(state)

    switch (action.type) {
      case "FireProjectile":
        projectileId = Math.floor(Math.random()*98643785).toString(),
        newState[projectileId] = {x:action.position.x,y:action.position.y,z:action.position.z,theta: action.theta }
        return newState
      case "MoveOneForward":
        newState[action.projectileId].x = newState[action.projectileId].x + 15 * Math.sin(newState[action.projectileId].theta)
        newState[action.projectileId].z = newState[action.projectileId].z + 15 * Math.cos(newState[action.projectileId].theta)
        return newState
      case "RemoveProjectile":
        delete newState[action.projectileId]
        return newState
    }
    return newState
}

const FireProjectile = (robot, theta, strength) => {
  return {
    type: "FireProjectile",
    position: { x: robot.x, y: robot.y, z: robot.z },
    theta: theta
    strength
  }
}

const RemoveProjectile = (projectileId) => {
  return {
    type: "RemoveProjectile",
    projectileId
  }
}



const MoveOneForward = (projectileId) => ({
  type: "MoveOneForward",
  projectileId
})

module.exports = { reducer, FireProjectile, MoveOneForward}
