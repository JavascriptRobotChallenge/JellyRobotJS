'use strict'

const db = require('APP/db')
const Robot = db.model('robots')

const {mustBeLoggedIn, forbidden} = require('./auth.filters')

const router = require('express').Router()

module.exports = router

router.param('robotId', (req, res, next, userId) => {
  Robot.find({where: {id: robotId}})
  .then(robot => {
    if (!robot) return res.sendStatus(404)
    req.robot = robot
    next()
  })
  .catch(next)
})

const EasyRobot = {id: 1, robotName: 'EasyRobot', code: `(function(){
   function SubRobot(){
       this.color = "red"
    };

  SubRobot.prototype = Object.create(RobotClass.prototype)
  //ToDo: call functions with roomName and PlayerId so we know
  // which robot to move
  SubRobot.prototype.start = function(roomName, playerId){
    this.rapidFire(roomName, playerId)
    this.walkTowardOpponent(roomName, playerId)
  }

  return new SubRobot()
})`, user_id: 1}

router.get('/testRobots', (req, res, next) => {
  res.send(EasyRobot)
})

router.route('/')
// .get(mustBeLoggedIn, (req, res, next) => {
//   // Robot.findOne({ where: {robotName: req.query.robotName} })
//   // .then(testRobot => res.json(testRobot))
//   res.send(EasyRobot)
// })
.post(mustBeLoggedIn, (req, res, next) => {
  let robotToCreate = Object.assign({}, req.body, {user_id: req.targetUser.id})
  Robot.create(robotToCreate)
  .then((createdRobot) => {
    res.json(createdRobot)})
  .catch(next)
})
.delete(mustBeLoggedIn, (req, res, next) => {
  req.targetUser['remove' + req.robot]()
 .then(() => res.sendStatus(204))
 .catch(next)
})
