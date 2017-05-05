
 var Sandbox = require('sandbox')
 
 var code = []
 
 // look up book by id
// class game(robotOne,robotTwo){
// constructor(){
// }
// // start(){
// // }
// }

function RobotClass(){
  this.health = 100;
  this.direction;
}
RobotClass.prototype.hitWall = function(){
  this.health--
}

// move(direction){
//     if (["up","right","left","down"].includes(direction)){
//     this.direction=direction
// }
// }
// }

module.exports = require('express').Router()
  .post('/', (req, res, next) => {
   console.log(eval(req.body.code))
   var RoboOne = eval(req.body.code)
   var testRobot = RoboOne()
   console.log('instance',testRobot)
   console.log("can access",testRobot.hitWall)
   console.log("functionsavailable",testRobot.sayHi)
   res.send(testRobot)
  //  console.log("robooneis",RoboOne)
  })
  
  //  const input = comboClass.toString()+"test()"
  //  var stringComboClass = comboClass.toString()+"test()"

  //    console.log("seee",RobotClass)
  //    console.log("input",input)
  //  console.log("input",stringComboClass)

//    var s = new Sandbox()
//    var cleanedCode = s.run("function test(){const person = class person{constructor(){this.health=1}}; var jonah = new person();return jonah;}test()", function(returnedValue){
//      console.log(returnedValue)
//      res.send(returnedValue.result);
//    })
//  })

  //   var s = new Sandbox()
  //  var cleanedCode = s.run(input, (returnedValue)=>{
  //    console.log(returnedValue)
  //    res.send(returnedValue.result);
  //  })
