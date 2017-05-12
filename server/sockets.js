// const backendStore = require('./reducers/backendStore.js')
// const { AddPlayer, RemovePlayer } = require("./reducers/robotReducer")
// const RobotClass =  require('./RobotClass')
// const server = require('./server')
//
// const io = require('socket.io')(server)
//
// io.on('connection', function(socket) {
//
//   socket.on('sendCode', (code)=>{
//     var roboFunc = eval(code)
//     var roboInstance = roboFunc()
//     var robotProtos = Object.getPrototypeOf(roboInstance)
//     Object.keys(robotProtos).forEach(robotProto => {
//       RobotClass.prototype.on(robotProto, robotProtos[robotProto])
//     })
//     backendStore.dispatch(AddPlayer(socket.id, roboInstance))
//   })
//
//   socket.on('disconnect', function() {
//     backendStore.dispatch(RemovePlayer(socket.id))
//   })
// })
//
// module.exports=  io
