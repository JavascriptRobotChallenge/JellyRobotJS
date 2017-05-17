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

router.route('/')
.get(mustBeLoggedIn, (req, res, next) => {
  Robot.findOne({ where: {robotName: req.query.robotName} })
  .then(testRobot => res.json(testRobot))
  .catch(next)
})
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
