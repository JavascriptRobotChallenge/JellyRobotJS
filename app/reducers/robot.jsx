import axios from 'axios'

var initialPosition = {
    x: 0,
    y: 0,
    z: 0
}

const reducer = ( position = initialPosition, action) => {
    switch (action.type) {
        case "Move_X":
            return {
                x: position.x + 1,
                y: position.y,
                z: position.z
            }
        case "Move_Minus_X":
            return {
                x: position.x - 1,
                y: position.y,
                z: position.z
            }
        default:
            return position
    }
}

export const MoveX = robotFunction => ({type: "Move_X"})

export const MoveMinusX = () => ({type: "Move_Minus_X"})

// export const login = (username, password) =>
//   dispatch =>
//     axios.post('/api/auth/login/local',
//       {username, password})
//       .then(() => dispatch(whoami()))
//       .catch(() => dispatch(whoami()))

export default reducer
