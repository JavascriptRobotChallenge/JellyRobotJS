
 var Sandbox = require('sandbox')

 var code = []

 function RobotClass() {
     this.health = 100;
     this.direction;
 }
 RobotClass.prototype.hitWall = function() {
     this.health--
 }

 RobotClass.prototype.rotation = function(theta) {
     store.dispatch(Rotation(theta))
 }

 RobotClass.prototype.walkForward = function(theta) {
     store.dispatch(WalkForward(theta))
 }

module.exports = require('express').Router()
  .post('/', (req, res, next) => {

   var RoboOne = eval(req.body.code)
   var testRobot = RoboOne()

  //  res.send(testRobot)
  })
