
 var Sandbox = require('sandbox')
 
 var code = []
 
 // look up book by id

module.exports = require('express').Router()
  .post('/', (req, res, next) => {
   console.log("code: ",req.body.code)
   console.log(typeof req.body.code)
   var s = new Sandbox()
   var cleanedCode = s.run(req.body.code, function(returnedValue){
     res.send(returnedValue.result);
   })
 })
 