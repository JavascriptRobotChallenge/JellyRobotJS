'use strict'

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const {resolve} = require('path')
const passport = require('passport')
const PrettyError = require('pretty-error')
const finalHandler = require('finalhandler')
const backendStore = require('./reducers/backendStore.js')
const { AddPlayer, RemovePlayer, UpdatePlayer, AddRoom } = require("./reducers/robotReducer")
const broadcastGameState = require('./updateClientLoop.js')
const RobotClass =  require('./RobotClass')

const pkg = require('APP')

const app = express()

if (!pkg.isProduction && !pkg.isTesting) {
  app.use(require('volleyball'))
}

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
  .use(express.static(resolve(__dirname, '..', 'public')))
  .use('/api', require('./api'))
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
  var counterPeople = 0, roomIndex  = 0;
  var rooms = {
    1: 'Blueberry',
    2: 'Cherry',
    3: 'Strawberry',
    4: 'Watermelon'
  }
  io.on('connection', function(socket) {
    //a new player joined and he is an even number => new room has to be created
    if(counterPeople % 2 === 0) {
      console.log('socket id even', counterPeople, socket.id)
      roomIndex = Math.floor(counterPeople /2) + 1
      backendStore.dispatch(AddPlayer(socket.id, rooms[roomIndex]))
    } else {
      console.log('socket id odd',counterPeople, socket.id)
      backendStore.dispatch(AddPlayer(socket.id, rooms[roomIndex]))
    }

    counterPeople++;
    socket.on('sendCode', (code)=> {
      var roboFunc = eval(code)
      var roboInstance = roboFunc()
      var robotProtos = Object.getPrototypeOf(roboInstance)
      Object.keys(robotProtos).forEach(robotProto => {
        RobotClass.prototype.on(robotProto, robotProtos[robotProto])
      })
      // update player when they have submitted code
      backendStore.dispatch(UpdatePlayer(socket.id, roboInstance))
    })

    socket.on('room', function(room) {
      // console.log('joined room', room)
      socket.join(room)
    })

    socket.on('disconnect', function() {
      backendStore.dispatch(RemovePlayer(socket.id))
    })

  })

  broadcastGameState(io);
}


// This check on line 64 is only starting the server if this file is being run directly by Node, and not required by another file.
// Bones does this for testing reasons. If we're running our app in development or production, we've run it directly from Node using 'npm start'.
// If we're testing, then we don't actually want to start the server; 'module === require.main' will luckily be false in that case, because we would be requiring in this file in our tests rather than running it directly.
