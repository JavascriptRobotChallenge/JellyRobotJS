const _ = require('lodash')
const backendStore = require('./backendStore.jsx')

var initialState = {}

const reducer = ( state = {}, action) => {
  const newState = _.merge({}, state)
  Object.freeze(state)

    switch (action.type) {
      case "FireProjectile":
        newState[action.projectileId] = { position: action.position, theta: theta }
        return newState
      case "MoveOneForward":
        newState[action.projectileId].x = newState[action.projectileId].x + 15 * Math.sin(newState[action.projectileId].theta)
        newState[action.projectileId].z = newState[action.projectileId].z + 15 * Math.cos(newState[action.projectileId].theta)
        return newState
    }
    return newState
}



const FireProjectile = (robotId, theta) => {
  var firingRobot = backendStore.getState().robots[robotId]
  console.log(firingRobot)

  return {
    type: "FireProjectile",
    projectileID: Math.random(0, 999999999).toString(),
    position: { x: firingRobot.x, y: firingRobot.y, z: firingRobot.z },
    theta: theta
  }
}

const MoveForward = () => {
  var projectiles = backendStore.getState().projectiles
  for(var projectile in projectiles) {
    backendStore.dispatch(MoveOneForward(projectile.id))
  }
}

const MoveOneForward = (projectileId) => ({
  type: "MoveOneForward",
  projectileId
})

module.exports = { reducer, MoveForward, FireProjectile }
