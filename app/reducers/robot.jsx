import axios from 'axios'

const reducer = (position={x:0,y:0,z:0}, action) => {
  switch (action.type) {
  case "Move_Up":
    return {x:0,y:position.y+1,z:0}
  }
  return position
}

export const MoveUp = robotFunction => ({
  type: "Move_Up",
})

// export const login = (username, password) =>
//   dispatch =>
//     axios.post('/api/auth/login/local',
//       {username, password})
//       .then(() => dispatch(whoami()))
//       .catch(() => dispatch(whoami()))


export default reducer
