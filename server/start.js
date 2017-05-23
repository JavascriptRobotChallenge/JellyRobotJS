'use strict'

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const {
    resolve
} = require('path')
const passport = require('passport')
const PrettyError = require('pretty-error')
const finalHandler = require('finalhandler')

const store = require('./redux/store.js')
const {
    fireProjectile,
    removeProjectile,
    moveOneForward,
    removeProjectilesOnLeave
} = require("./redux/projectiles/actionCreators")
const {
    walkFollowSpeed,
    addOrUpdatePlayer,
    removePlayer,
    setUserName,
    updateWalkTime,
    walkAwayFromWall,
    walkForward,
    walkBackward,
    addRotation,
    decreaseHealth,
    setRotation
} = require("./redux/robots/actionCreators")
const scripts = require('./sandcastle/scripts')

const SandCastle = require('sandcastle').SandCastle
var sandcastle = new SandCastle({
    api: './server/sandcastle/APIexports.js'
})

var {
    broadcastGameState
} = require('./updateClientLoop.js')
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
    .use(bodyParser.urlencoded({
        extended: true
    }))
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
            const {
                address,
                port
            } = server.address()
            const host = address === '::' ? 'localhost' : address
            const urlSafeHost = host.includes(':') ? `[${host}]` : host
            console.log(`Listening on http://${urlSafeHost}:${port}`)
        }
    )

    var io = require('socket.io')(server)
    var users = 0,
        roomIndex = 0;
    var rooms = {
        1: 'Blueberry',
        2: 'Cherry',
        3: 'Strawberry',
        4: 'Watermelon',
        5: 'Banana',
        6: 'Mango'
    }

    var multiPlayerRooms = {
        Blueberry: {},
        Cherry: {},
        Strawberry: {},
        Watermelon: {}
    }
    var singlePlayerRooms = {
        Banana: {},
        Mango: {}
    }

    io.on('connection', function(socket) {
        //A new player joined and he is an even number => new room has to be created
        socket.on('giveMeARoom', (user) => {
            var robotJoined = false
            for (var room in multiPlayerRooms) {
                if (Object.keys(multiPlayerRooms[room]).length < 2) {
                    multiPlayerRooms[room][socket.id] = true
                    robotJoined = true
                    socket.join(room)
                    socket.emit('roomAssigned', room)
                    store.dispatch(addOrUpdatePlayer(room, socket.id, null))
                    store.dispatch(setUserName(room, socket.id, user))
                    break;
                }
            }
            if (!robotJoined) {
                socket.emit('tooManyPlayers', 'Sorry, all the rooms are full! Please come back later.')
            }
        })

        socket.on('singleTrainingRoom', () => {
            var robotJoined = false
            for (var room in singlePlayerRooms) {
                if (Object.keys(singlePlayerRooms[room]).length < 2) {
                    singlePlayerRooms[room][socket.id] = true
                    robotJoined = true
                    socket.join(room)
                    socket.emit('trainingRoomAssigned', room)
                    store.dispatch(addOrUpdatePlayer(room, socket.id, null))
                    store.dispatch(setUserName(room, socket.id, 'User'))
                    break;
                }
            }
            if (!robotJoined) {
                socket.emit('tooManyPlayers', 'Sorry, all the rooms are full! Please come back later.')
            }
        })

        socket.on('sendTrainingCode', (room, code, testRobots)=> {
          scripts[socket.id] = sandcastle.createScript(`exports = {
              start: function(){ setup(initialState, roomName, playerId); ${code}; exit(getActionQueue()) }
          }`);

          store.dispatch(addOrUpdatePlayer(room, socket.id, code))
          store.dispatch(setUserName(room, socket.id, 'User'))

          scripts[socket.id].on('exit', function(err, output, methodName) {
              // console.log('output ', output, typeof output, 'esrr', err); // Hello World!
              if (err) {
                socket.emit('badCode')
                store.dispatch(walkForward(room, socket.id))
              } else {
                  if (typeof output === "object") {
                    output && output.forEach(action => { store.dispatch(action) })
                  }
              }
          });
          scripts[socket.id].on('timeout', function(methodName) {
            console.log('everyone is timing out')
            store.dispatch(walkForward(room, socket.id))
          })

          scripts[testRobots.id] = sandcastle.createScript(`exports = {
             start: function(){ setup(initialState, roomName, playerId); ${testRobots.code}; exit(getActionQueue()) }
          }`);

          store.dispatch(addOrUpdatePlayer(room, testRobots.id, testRobots.code))
          store.dispatch(setUserName(room, testRobots.id, 'Test Robot'))

          scripts[testRobots.id].on('exit', function(err, output, methodName) {
              if (err) {
                socket.emit('badCode',err)
                store.dispatch(walkForward(room, testRobots.id))
              } else {
                  if (typeof output === "object") {
                    output && output.forEach(action => { store.dispatch(action) })
                  }
              }
          });
          scripts[testRobots.id].on('timeout', function(methodName) {
            console.log('test robot is timing out')
            store.dispatch(walkForward(room, testRobots.id))
          });
        })

        socket.on('sendCode', (room, code, user) => {
            scripts[socket.id] = sandcastle.createScript(`exports = {
              start: function(){ setup(initialState, roomName, playerId); ${code}; exit(getActionQueue()) }
            }`);

            store.dispatch(addOrUpdatePlayer(room, socket.id, code))
            store.dispatch(setUserName(room, socket.id, user))

            scripts[socket.id].on('exit', function(err, output, methodName) {
              //  console.log('output ', output, typeof output, 'err', err); // Hello World!
                if (err) {
                  socket.emit('badCode',err)
                  store.dispatch(walkForward(room, socket.id))
                } else {
                    output && output.forEach(action => { store.dispatch(action) })
                }
            });
            scripts[socket.id].on('timeout', function(methodName) {
              console.log('everyone is timing out')
              store.dispatch(walkForward(room, socket.id))
            });
        })

        socket.on('leaveRoom', function() {
            //this removes players from singlePlayer/multiPlayer rooms which is equivalent to using socket.leave
            console.log('leaving room disconnecting...')
            for (var room in multiPlayerRooms) {
                for (var robot in multiPlayerRooms[room]) {
                    if (socket.id === robot) {
                        delete multiPlayerRooms[room][robot]
                    }
                }
            }
            for (var singlePlayerRoom in singlePlayerRooms) {
                for (var singlePlayerRobot in singlePlayerRooms[singlePlayerRoom]) {
                    if (socket.id === singlePlayerRobot) {
                        delete singlePlayerRooms[singlePlayerRoom][singlePlayerRobot]
                    }
                }
            }
            store.dispatch(removePlayer(socket.id))
            store.dispatch(removeProjectilesOnLeave(socket.id))
        })


        socket.on('disconnect', function() {
            //this does the same as leave room but for players who disconnect
            var storeState = store.getState().robots
            for (var room in multiPlayerRooms) {
                for (var robot in multiPlayerRooms[room]) {
                    if (socket.id === robot) {
                        delete multiPlayerRooms[room][robot]
                        io.sockets.to(room).emit('tie')
                    }
                }
            }
            for (var singlePlayerRoom in singlePlayerRooms) {
                for (var singlePlayerRobot in singlePlayerRooms[singlePlayerRoom]) {
                    if (socket.id === singlePlayerRobot) {
                        delete singlePlayerRooms[singlePlayerRoom][singlePlayerRobot]
                    }
                }
            }
            store.dispatch(removePlayer(socket.id))
            store.dispatch(removeProjectilesOnLeave(socket.id))
        })
    })

    broadcastGameState(io);
}

// This check on line 64 is only starting the server if this file is being run directly by Node, and not required by another file.
// Bones does this for testing reasons. If we're running our app in development or production, we've run it directly from Node using 'npm start'.
// If we're testing, then we don't actually want to start the server; 'module === require.main' will luckily be false in that case, because we would be requiring in this file in our tests rather than running it directly.
