import axios from 'axios'


// theta
var initialPosition = {
    x: 0,
    y: 0,
    z: 0,
    theta: 0
}

const reducer = ( position = initialPosition, action) => {
    switch (action.type) {
        case "IncrementX":
            return {
                x: position.x + 1,
                y: position.y,
                z: position.z,
                theta: position.theta
            }
        case "DecrementX":
            return {
                x: position.x - 1,
                y: position.y,
                z: position.z,
                theta: position.theta
            }
        case "IncrementZ":
            return {
                x: position.x,
                y: position.y,
                z: position.z  + 1,
                theta: position.theta
            }
        case "DecrementZ":
            return {
                x: position.x,
                y: position.y,
                z: position.z - 1,
                theta: position.theta
            }
        case "Rotation":
          return {
            x: position.x,
            y: position.y,
            z: position.z,
            theta: action.theta
          }
        default:
            return position
    }
}

export const IncrementX = () => ({type: "IncrementX"})
export const DecrementX = () => ({type: "DecrementX"})

export const IncrementZ = () => ({type: "IncrementZ"})
export const DecrementZ = () => ({type: "DecrementZ"})

export const Rotation = (theta) => ({type: "Rotation", theta: theta})


export default reducer
