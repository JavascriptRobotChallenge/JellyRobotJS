import React from 'react'
import axios from "axios"
import store from "../store"
import {importRobot} from "../reducers/robot"
import {RobotWorld} from './RobotWorld'

function RobotClass(){
  this.health = 100;
  this.direction;
}
RobotClass.prototype.hitWall = function(){
  this.health--
}


 export default class NameForm extends React.Component {
   constructor(props) {
     super(props);
     this.state = {value:`

    (function(){
    function SubRobot(){
        this.color = "red"
     };

     SubRobot.prototype = Object.create(RobotClass.prototype)
     SubRobot.prototype.sayHi = function(){
         console.log("hi")
     }
     return new SubRobot()
     })`};

     this.handleChange = this.handleChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
   }

   handleChange(event) {
     this.setState({value: event.target.value});
   }

   handleSubmit(event) {
     event.preventDefault();

     var robotConstructor = eval(this.state.value)
     var robot = robotConstructor()
     console.log(robot)
     Window.robot = robot

   }

   render() {
     return (
       <div>
       <form onSubmit={this.handleSubmit}>
         <label>
           Code robot:
           <br />
           <textarea  value={this.state.value} rows="40" onChange={this.handleChange} />
         </label>
         <br />
         <input type="submit" value="Submit" />
       </form>
       <RobotWorld />
     </div>
     );
   }
 }
