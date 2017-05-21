'use strict'

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const {resolve} = require('path')
const passport = require('passport')
const PrettyError = require('pretty-error')
const finalHandler = require('finalhandler')
const backendStore = require('./reducers/backendStore.js')
const { FireProjectile, RemoveProjectile, MoveOneForward, RemoveProjectilesOnLeave } = require("./reducers/projectileReducer")
const { WalkFollowSpeed, AddOrUpdatePlayer, RemovePlayer, SetUserName, UpdateWalkTime, WalkAwayFromWall, WalkForward, WalkBackward, AddRotation, DecreaseHealth, SetRotation } = require("./reducers/robotReducer")
const scripts = require('./scripts')

const SandCastle = require('sandcastle').SandCastle
var sandcastle = new SandCastle({api: './server/APIexports.js'})

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
    4: 'Watermelon',
    5: 'Banana',
    6: 'Mango'
  }

  var multiPlayerRooms = { Blueberry:{}, Cherry:{}, Strawberry:{}, Watermelon:{} }
  var singlePlayerRooms = { Banana:{}, Mango:{} }
  io.on('connection', function(socket) {
    //a new player joined and he is an even number => new room has to be created
    socket.on('giveMeARoom', (user)=>{
      var robotJoined = false
      for (var room in multiPlayerRooms){
        if (Object.keys(multiPlayerRooms[room]).length<2){
          multiPlayerRooms[room][socket.id] = true
          robotJoined = true
          socket.join(room)
          socket.emit('roomAssigned', room)
          backendStore.dispatch(AddOrUpdatePlayer(room, socket.id, null))
          backendStore.dispatch(SetUserName(room, socket.id, user))
          break;
        }
      }
      if (!robotJoined){
        socket.emit('tooManyPlayers', 'Sorry, all the rooms are full! Please come back later.')
      }
    })

    socket.on('singleTrainingRoom', () => {
      var robotJoined = false
      // console.log('singlePlayer rooms backend', backendStore.getState())
      for (var room in singlePlayerRooms){
        // console.log('object keys in singlePlayer rooms', room, (Object.keys(singlePlayerRooms[room])))
        if (Object.keys(singlePlayerRooms[room]).length < 2){
          singlePlayerRooms[room][socket.id] = true
          robotJoined = true
          socket.join(room)
          socket.emit('trainingRoomAssigned', room)
          backendStore.dispatch(AddOrUpdatePlayer(room, socket.id, null))
          backendStore.dispatch(SetUserName(room, socket.id, 'User'))
          break;
        }
      }
      if (!robotJoined){
        socket.emit('tooManyPlayers', 'Sorry, all the rooms are full! Please come back later.')
      }
    })

    socket.on('setTestRobot', (testRobots) => {
      for (var room in singlePlayerRooms){
        singlePlayerRooms[room][testRobots.id] = true;
        backendStore.dispatch(AddOrUpdatePlayer(room, testRobots.id, null))
        backendStore.dispatch(SetUserName(room, socket.id, 'Test Robot'))
      }
    })

    socket.on('sendTrainingCode', (room, code, testRobots)=> {
      scripts[socket.id] = sandcastle.createScript(`exports = {
          start: function(){ setup(initialState); ${code}; exit(getActionQueue()) }
      }`);
      backendStore.dispatch(AddOrUpdatePlayer(room, socket.id, code))
      backendStore.dispatch(SetUserName(room, socket.id, 'User'))
      // unsubscribe
      scripts[socket.id].on('exit', function(err, output, methodName) {
          // console.log('output ', output, typeof output, 'esrr', err); // Hello World!
          if(err){
            console.log("badcode")
            socket.emit('badCode')
            backendStore.dispatch(WalkForward(room, socket.id))
          } else {
            // console.log(Date.now() - scripts.time[socket.id])
            output && output.forEach(action => {
              backendStore.dispatch(action)
            })
          }
      });
      scripts[socket.id].on('timeout', function(methodName) {
        console.log('everyone is timing out')
        backendStore.dispatch(WalkForward(room, socket.id))
      })

      scripts[testRobots.id] = sandcastle.createScript(`exports = {
         start: function(){ setup(initialState); ${testRobots.code}; exit(getActionQueue()) }
      }`);
      backendStore.dispatch(AddOrUpdatePlayer(room, testRobots.id, testRobots.code))
      backendStore.dispatch(SetUserName(room, testRobots.id, 'Test Robot'))
      // unsubscribe
      scripts[testRobots.id].on('exit', function(err, output, methodName) {
          if (err) {
            socket.emit('badCode')
            backendStore.dispatch(WalkForward(room, testRobots.id))
          } else {
            // console.log(Date.now() - scripts.time[testRobots.id])
            output && output.forEach(action => {
              backendStore.dispatch(action)
            })
          }
      });
      scripts[testRobots.id].on('timeout', function(methodName) {
        console.log('test robot is timing out')
        backendStore.dispatch(WalkForward(room, testRobots.id))
      });
    })

    socket.on('sendCode', (room, code, user)=> {
      scripts[socket.id] = sandcastle.createScript(`exports = {
          start: function(){ setup(initialState); ${code}; exit(getActionQueue()) }
      }`);
      backendStore.dispatch(AddOrUpdatePlayer(room, socket.id, code))
      backendStore.dispatch(SetUserName(room, socket.id, user))
      // unsubscribe
      scripts[socket.id].on('exit', function(err, output, methodName) {
          // console.log('output ', output, typeof output, 'err', err); // Hello World!
          if(err){
            socket.emit('badCode')
            backendStore.dispatch(WalkForward(room, socket.id))
          } else {
            console.log(Date.now() - scripts.time[socket.id])
            output && output.forEach(action => {
              console.log(' ACTIONNNN ', action)
              backendStore.dispatch(action)
            })
          }
      });
      scripts[socket.id].on('timeout', function(methodName) {
        console.log('everyone is timing out')
        backendStore.dispatch(WalkForward(room, socket.id))
      });
    })


    socket.on('leaveRoom', function() {
      //this removes players from singlePlayer/multiPlayer rooms which is equivalent to using socket.leave
      console.log('leaving room disconnecting...')
      for (var room in multiPlayerRooms){
        for (var robot in multiPlayerRooms[room]){
          if (socket.id === robot){
            delete multiPlayerRooms[room][robot]
          }
        }
      }
      for (var singlePlayerRoom in singlePlayerRooms){
        for (var singlePlayerRobot in singlePlayerRooms[singlePlayerRoom]){
          if (socket.id === singlePlayerRobot){
            delete singlePlayerRooms[singlePlayerRoom][singlePlayerRobot]
          }
        }
      }
      backendStore.dispatch(RemovePlayer(socket.id))
      backendStore.dispatch(RemoveProjectilesOnLeave(socket.id))
    })


    socket.on('disconnect', function() {
      //this does the same as leave room but for players who disconnect
      var storeState = backendStore.getState().robots
      for (var room in multiPlayerRooms){
        for (var robot in multiPlayerRooms[room]){
          if (socket.id === robot){
            delete multiPlayerRooms[room][robot]
            io.sockets.to(room).emit('tie')
          }
        }
      }
      for (var singlePlayerRoom in singlePlayerRooms){
        for (var singlePlayerRobot in singlePlayerRooms[singlePlayerRoom]){
          if (socket.id === singlePlayerRobot){
            delete singlePlayerRooms[singlePlayerRoom][singlePlayerRobot]
          }
        }
      }
      backendStore.dispatch(RemovePlayer(socket.id))
      backendStore.dispatch(RemoveProjectilesOnLeave(socket.id))
    })
  })

  broadcastGameState(io);
}

// This check on line 64 is only starting the server if this file is being run directly by Node, and not required by another file.
// Bones does this for testing reasons. If we're running our app in development or production, we've run it directly from Node using 'npm start'.
// If we're testing, then we don't actually want to start the server; 'module === require.main' will luckily be false in that case, because we would be requiring in this file in our tests rather than running it directly.
