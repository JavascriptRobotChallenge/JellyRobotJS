'use strict'

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const {resolve} = require('path')
const passport = require('passport')
const PrettyError = require('pretty-error')
const finalHandler = require('finalhandler')
const backendStore = require('./reducers/backendStore.js')
const { FireProjectile } = require("./reducers/projectileReducer")
const { AddPlayer, RemovePlayer, Rotation, WalkForward, WalkBackward, UpdateGoodTime, Perp } = require("./reducers/robotReducer")
var broadcastGameState = require('./updateClientLoop.js')
var util = require('util')
var eventEmitter = require('events').EventEmitter;

// PrettyError docs: https://www.npmjs.com/package/pretty-error

// Bones has a symlink from node_modules/APP to the root of the app.
// That means that we can require paths relative to the app root by
// saying require('APP/whatever').
//
// This next line requires our root indexReducer.js:
const pkg = require('APP')

const app = express()

if (!pkg.isProduction && !pkg.isTesting) {
  // Logging middleware (dev only)
  app.use(require('volleyball'))
}

// Pretty error prints errors all pretty.
const prettyError = new PrettyError

// Skip events.js and http.js and similar core node files.
prettyError.skipNodeFiles()

// Skip all the trace lines about express' core and sub-modules.
prettyError.skipPackage('express')

module.exports = app
  // Session middleware - compared to express-session (which is what's used in the Auther workshop), cookie-session stores sessions in a cookie, rather than some other type of session store.
  // Cookie-session docs: https://www.npmjs.com/package/cookie-session
  .use(require('cookie-session')({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'an insecure secret key'],
  }))

  // Body parsing middleware
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())

  // Authentication middleware
  .use(passport.initialize())
  .use(passport.session())

  // Serve static files from ../public
  .use(express.static(resolve(__dirname, '..', 'public')))
  // .use(express.static(resolve(__dirname, '..', 'app', 'game', 'js', '*')))

  // Serve our api - ./api also requires in ../db, which syncs with our database
  .use('/api', require('./api'))

  // any requests with an extension (.js, .css, etc.) turn into 404
  .use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found')
      err.status = 404
      next(err)
    } else {
      next()
    }
  })

  // Send index.html for anything else.
  .get('/*', (_, res) => res.sendFile(resolve(__dirname, '..', 'public', 'index.html')))

  // Error middleware interceptor, delegates to same handler Express uses.
  // https://github.com/expressjs/express/blob/master/lib/application.js#L162
  // https://github.com/pillarjs/finalhandler/blob/master/index.js#L172
  .use((err, req, res, next) => {
    console.error(prettyError.render(err))
    finalHandler(req, res)(err)
  })

if (module === require.main) {
  // Start listening only if we're the main module.
  //
  // https://nodejs.org/api/modules.html#modules_accessing_the_main_module
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

  function RobotClass() {
      this.health = 100;
      this.direction;
  }

  var counter = 0
  RobotClass.prototype.fire = function(playerId, theta, strength, reloadTime){
    if ( Date.now() > backendStore.getState().robots[playerId].goodTime ) {
      backendStore.dispatch(FireProjectile(backendStore.getState().robots[playerId], playerId, theta, strength))
      backendStore.dispatch(UpdateGoodTime(playerId,Date.now()+reloadTime*1000))
      counter++
    }
  }

  RobotClass.prototype.accurateFire = function(id){
      var ownPosition = this.getOwnPosition(id)
      var otherPlayersPosition = this.findOpponent(id)
      var radAngle;
      if (!otherPlayersPosition){radAngle = 0}
      else{
      var xDiff = otherPlayersPosition[0] - ownPosition[0]
      var zDiff = otherPlayersPosition[1] - ownPosition[1]
      if ( xDiff > 0 && zDiff > 0 ){
        radAngle = Math.atan(xDiff/zDiff)
      }
      else if (xDiff>0&&zDiff<0){
        radAngle = Math.PI+Math.atan(xDiff/zDiff)
      }
      else if (xDiff<0&&zDiff<0){
        radAngle = Math.PI+Math.atan(xDiff/zDiff)
      }
      else if(xDiff<0&&zDiff>0){
        radAngle = Math.atan(xDiff/zDiff)
      }
    }
    this.fire( id, radAngle, 1, 5 )
  }

  RobotClass.prototype.rapidFire = function(id){
    this.fire(id, Math.random() * 2 * Math.PI, 1, 0.1)
  }

  RobotClass.prototype.findOpponent = function(playerId){
    const robots = backendStore.getState().robots
    for (var robotID in robots){
      if (robotID!==playerId){
        return [robots[robotID].x,robots[robotID].z]
      }
    }
    return false
  }

   RobotClass.prototype.getOwnPosition = function(playerId){
      const ownRobot = backendStore.getState().robots[playerId]
      return [ownRobot.x,ownRobot.z]
  }

  RobotClass.prototype.rotation = function(playerId, degrees) {
    var theta = degrees *.0174533
    backendStore.dispatch( Rotation(playerId, theta) )
    backendStore.dispatch( WalkForward(playerId) )
    backendStore.dispatch( WalkForward(playerId) )
    backendStore.dispatch( WalkForward(playerId) )
  }

  RobotClass.prototype.walkForward = function(id) {
    backendStore.dispatch( WalkForward(id) )
  }

  RobotClass.prototype.perp = function(playerId, theta) {
    backendStore.dispatch( Perp(playerId, theta) )
    backendStore.dispatch( WalkForward(playerId) )
    backendStore.dispatch( WalkForward(playerId) )
  }

  RobotClass.prototype.walkBackward = function(numTimes, id) {
    backendStore.dispatch( WalkBackward(id) )

  }
  RobotClass.prototype.onBoxCollision = function(id){
      this.rotation(id, 45)
      this.walkForward(id)
  }

  util.inherits(RobotClass, eventEmitter)

  var connectCounter = 0, idleActions = {}
  var io = require('socket.io')(server)

  io.on('connection', function(socket) {

    socket.on('sendCode', (code)=>{
      var roboFunc = eval(code)
      var roboInstance = roboFunc()
        
      var robotProtos = Object.getPrototypeOf(roboInstance)
      Object.keys(robotProtos).forEach(robotProto => {
        RobotClass.prototype.on(robotProto, robotProtos[robotProto])
      })
      backendStore.dispatch(AddPlayer(socket.id, roboInstance))
    })

    socket.on('disconnect', function() {
      backendStore.dispatch(RemovePlayer(socket.id))
    })
  })
  broadcastGameState(io)
}


// This check on line 64 is only starting the server if this file is being run directly by Node, and not required by another file.
// Bones does this for testing reasons. If we're running our app in development or production, we've run it directly from Node using 'npm start'.
// If we're testing, then we don't actually want to start the server; 'module === require.main' will luckily be false in that case, because we would be requiring in this file in our tests rather than running it directly.
