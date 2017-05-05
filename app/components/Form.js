import React from 'react'
import axios from "axios"
import store from "../store"
import {importRobot} from "../reducers/robot"
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
       axios.post("api/code",{code:this.state.value})
       .then((result)=>{
           console.log("isthisfunc")
        store.dispatch(importRobot(result.data))
        window.robot = result.data
       })
     event.preventDefault();
   }
 
   render() {
     return (
       <form onSubmit={this.handleSubmit}>
         <label>
           Code for robot:
           <br />
           <textarea  value={this.state.value} rows="40" onChange={this.handleChange} />
         </label>
         <br />
         <input type="submit" value="Submit" />
       </form>
     );
   }
 }