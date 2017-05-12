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
const { AddPlayer, Rotation, WalkForward, WalkBackward, UpdateLastFired } = require("./reducers/robotReducer")
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
  RobotClass.prototype.fire = function(playerId, degrees, strength){
    var theta = degrees *.0174533

    if ( Date.now() - backendStore.getState().robots[playerId].lastFired > strength * 1000){
      // console.log('date approved')
      // console.log('last fired according to store', backendStore.getState().robots[playerId].lastFired)
      // console.log('counter', counter, (Date.now() - backendStore.getState().robots[playerId].lastFired))
      backendStore.dispatch(UpdateLastFired(playerId,Date.now()))
      backendStore.dispatch(FireProjectile(backendStore.getState().robots[playerId], theta, strength))
      counter++
    }

  }

  RobotClass.prototype.rotation = function(playerId, degrees) {
    var theta = degrees *.0174533
    backendStore.dispatch(Rotation(playerId, theta))
  }

  RobotClass.prototype.walkForward = function(id) {
    backendStore.dispatch(WalkForward(id))
  }

  RobotClass.prototype.walkBackward = function(numTimes, id) {
    backendStore.dispatch(WalkBackward(id))
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
  })
  broadcastGameState(io)
}


// This check on line 64 is only starting the server if this file is being run directly by Node, and not required by another file.
// Bones does this for testing reasons. If we're running our app in development or production, we've run it directly from Node using 'npm start'.
// If we're testing, then we don't actually want to start the server; 'module === require.main' will luckily be false in that case, because we would be requiring in this file in our tests rather than running it directly.
