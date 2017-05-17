const _ = require('lodash')

var initialState = {
  'Blueberry': {},
  'Cherry': {},
  'Strawberry': {},
  'Watermelon': {}
}

const reducer = ( state = initialState, action) => {
  const newState = _.merge({}, state)
  Object.freeze(state)

    switch (action.type) {
      case "FireProjectile":
        projectileId = Math.floor(Math.random()*98643785).toString(),
        newState[action.roomName][projectileId] = { x: action.position.x, y: action.position.y, z: action.position.z, theta: action.theta, strength: action.strength, id: action.robotId }
        return newState
      case "MoveOneForward":
        newState[action.roomName][action.projectileId].x = newState[action.roomName][action.projectileId].x + 15 * Math.sin(newState[action.roomName][action.projectileId].theta)
        newState[action.roomName][action.projectileId].z = newState[action.roomName][action.projectileId].z + 15 * Math.cos(newState[action.roomName][action.projectileId].theta)
        return newState
      case "RemoveProjectile":
        delete newState[action.roomName][action.projectileId]
        return newState
      case "RemoveProjectilesOnLeave":
      for (var room in newState){
        for (var projectile in newState[room]){
          ///this checks if the robot associated with the projectile matches the socket of the user that just left the room
          if (newState[room][projectile].id===action.id){
            delete newState[room][projectile]
          }
        }
      }
      return newState
    }
    return newState
}

const FireProjectile = (roomName, robotId, robot, theta, strength) => ({
    type: "FireProjectile",
    roomName,
    robotId: robotId,
    position: { x: robot.x, y: robot.y, z: robot.z},
    theta: theta,
    strength,
})

const RemoveProjectile = (roomName, projectileId) => ({
    type: "RemoveProjectile",
    roomName,
    projectileId
})

const MoveOneForward = (roomName, projectileId) => ({
  type: "MoveOneForward",
  roomName,
  projectileId
})

const RemoveProjectilesOnLeave= (socketId) =>({
  type:"RemoveProjectilesOnLeave",
  id:socketId
})

module.exports = { reducer, FireProjectile, MoveOneForward, RemoveProjectile, RemoveProjectilesOnLeave }
