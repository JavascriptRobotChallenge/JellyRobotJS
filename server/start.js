'use strict'

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const {resolve} = require('path')
const passport = require('passport')
const PrettyError = require('pretty-error')
const finalHandler = require('finalhandler')
const backendStore = require('./reducers/backendStore.js')
const RobotClass =  require('./RobotClass')
const { AddOrUpdatePlayer, RemovePlayer } = require("./reducers/robotReducer")
const { RemoveProjectilesOnLeave } = require("./reducers/projectileReducer")

var { broadcastGameState } = require('./updateClientLoop.js')
const pkg = require('APP')
const app = express()


if (!pkg.isProduction && !pkg.isTesting) {  app.use(require('volleyball')) }


const prettyError = new PrettyError
prettyError.skipNodeFiles()
prettyError.skipPackage('express')

module.exports = app
  .use(require('cookie-session')({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'an insecure secret key'],
  }))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(passport.initialize())
  .use(passport.session())
  .use(express.static(resolve(__dirname, '..', 'node_modules')))
  .use(express.static(resolve(__dirname, '..', 'public')))
  .use('/api', require('./api/api'))
  .use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found')
      err.status = 404
      next(err)
    } else {
      next()
    }
  })
  .get('/*', (_, res) => res.sendFile(resolve(__dirname, '..', 'public', 'index.html')))
  .use((err, req, res, next) => {
    console.error(prettyError.render(err))
    finalHandler(req, res)(err)
  })

if (module === require.main) {
  const server = app.listen(
    pkg.port,
    () => {
      console.log(`--- Started HTTP Server for ${pkg.name} ---`)
      const { address, port } = server.address()
      const host = address === '::' ? 'localhost' : address
      const urlSafeHost = host.includes(':') ? `[${host}]` : host
      console.log(`Listening on http://${urlSafeHost}:${port}`)
    }
  )

 var io = require('socket.io')(server)
  var users = 0, roomIndex = 0;
  var rooms = {
    1: 'Blueberry',
    2: 'Cherry',
    3: 'Strawberry',
    4: 'Watermelon'
  }


  var jonahRooms = {Blueberry:{},Cherry:{},Strawberry:{},Watermelon:{}}
  io.on('connection', function(socket) {
    //a new player joined and he is an even number => new room has to be created
    socket.on('giveMeARoom', ()=>{
      var robotJoined = false
      for (var room in jonahRooms){
        console.log("room",jonahRooms[room],typeof jonahRooms[room])
        if (Object.keys(jonahRooms[room]).length<2){
          jonahRooms[room][socket.id] = true
          robotJoined = true
          console.log("thisisurroom",[room])
          socket.join(room)
          socket.emit("roomAssigned",room)
          backendStore.dispatch(AddOrUpdatePlayer(room,socket.id,null))
          break;
        }
      }
      if (!robotJoined){
        console.log("toomany players")
      }
      // users++
      // roomIndex = Math.ceil(users/2)
      // backendStore.dispatch(AddOrUpdatePlayer(rooms[roomIndex],socket.id,null))
      
      // socket.join(rooms[roomIndex])
      // socket.emit('roomAssigned', rooms[roomIndex])
      // console.log("index",roomIndex)
      // console.log("rooms",rooms)
      // console.log("myroomis",rooms[roomIndex])
    })

    socket.on('test', (code, room)=> {
      console.log("testing")
    })


    socket.on('sendCode', (code, room)=> {




      var roboFunc = eval(code)
      var roboInstance = roboFunc()
      console.log(roboInstance.color, 'here is the color!!!!!')
      var robotProtos = Object.getPrototypeOf(roboInstance)
      Object.keys(robotProtos).forEach(robotProto => {
        RobotClass.prototype.on(robotProto, robotProtos[robotProto])
      })
      // update player when they have submitted code
      backendStore.dispatch(AddOrUpdatePlayer(room, socket.id, roboInstance))
    })

    socket.on('leaveRoom', function() {
      console.log("disconnecting...")
    var storeState = backendStore.getState().robots
    for (var room in jonahRooms){
      for (var robot in jonahRooms[room]){
        if (socket.id===robot){
          delete jonahRooms[room][robot]
        }
      }
      
    }
      // var store = store.leave
      // console.log("oldrooms",rooms)
      backendStore.dispatch(RemovePlayer(socket.id))
      backendStore.dispatch(RemoveProjectilesOnLeave(socket.id))
      // console.log("newroom",rooms)
      // console.log("plz",io.sockets.adapter.rooms)
      // users--  
    })


    socket.on('disconnect', function() {
      console.log("disconnecting...")
    var storeState = backendStore.getState().robots
    for (var room in jonahRooms){
      for (var robot in jonahRooms[room]){
        if (socket.id===robot){
          delete jonahRooms[room][robot]
          io.sockets.to(room).emit("tie")
        }
      }
    }
      // var store = store.leave
      // console.log("oldrooms",rooms)
      backendStore.dispatch(RemovePlayer(socket.id))
      backendStore.dispatch(RemoveProjectilesOnLeave(socket.id))
      // console.log("newroom",rooms)
      // console.log("plz",io.sockets.adapter.rooms)
      // users--  
    })
  })

  broadcastGameState(io);
}

// This check on line 64 is only starting the server if this file is being run directly by Node, and not required by another file.
// Bones does this for testing reasons. If we're running our app in development or production, we've run it directly from Node using 'npm start'.
// If we're testing, then we don't actually want to start the server; 'module === require.main' will luckily be false in that case, because we would be requiring in this file in our tests rather than running it directly.
