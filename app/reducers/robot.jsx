import axios from 'axios'

const reducer = (robotOne=null, action) => {
  switch (action.type) {
  case "Import_Robot_Function":
    return action.robotFunction
  }
  return robotOne
}

export const importRobot = robotFunction => ({
  type: "IMPORT_ROBOT_FUNCTION",
  robotFunction:robotFunction
})

// export const login = (username, password) =>
//   dispatch =>
//     axios.post('/api/auth/login/local',
//       {username, password})
//       .then(() => dispatch(whoami()))
//       .catch(() => dispatch(whoami()))


export default reducer
