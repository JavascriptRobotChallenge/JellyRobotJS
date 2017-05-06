import React from 'react'
import axios from "axios"
import store from "../store"
import { RobotWorld } from './RobotWorld'
import { importRobot, IncrementX, DecrementX, IncrementZ, DecrementZ, Rotation } from "../reducers/robot"

function RobotClass() {
    this.health = 100;
    this.direction;
}
RobotClass.prototype.hitWall = function() {
    this.health--
}

RobotClass.prototype.incrementX = function() {
    store.dispatch(IncrementX())
}

RobotClass.prototype.decrementX = function() {
    store.dispatch(DecrementX())
}

RobotClass.prototype.incrementZ = function() {
    store.dispatch(IncrementZ())
}

RobotClass.prototype.decrementZ = function() {
    store.dispatch(DecrementZ())
}

RobotClass.prototype.rotation = function(theta) {
    store.dispatch(Rotation(theta))
}



export default class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: `

    (function(){
    function SubRobot(){
        this.color = "red"
     };

     SubRobot.prototype = Object.create(RobotClass.prototype)
     SubRobot.prototype.sayHi = function(){
         console.log("hi")
     }
     return new SubRobot()
     })`
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        var robotConstructor = eval(this.state.value)
        var robot = robotConstructor()

        // robot instance
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
