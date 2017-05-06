import axios from 'axios'


// theta
var initialPosition = {
    x: -250,
    y: 0,
    z: 0,
    theta: 0
}

const reducer = ( position = initialPosition, action) => {
    switch (action.type) {

        case "Rotation":
          return {
            x: position.x,
            y: position.y,
            z: position.z,
            theta: position.theta + action.theta
          }
          case "WalkForward":
            return {
              x: position.x + Math.sin(position.theta),
              y: position.y,
              z: position.z + Math.cos(position.theta),
              theta: position.theta
            }
        default:
            return position
    }
}

export const WalkForward = () => ({type: "WalkForward"})
export const Rotation = (theta) => ({type: "Rotation", theta: theta})


export default reducer
