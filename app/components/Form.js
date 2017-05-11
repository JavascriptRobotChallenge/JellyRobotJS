import React from 'react'
import axios from "axios"
import store from "../store"
import { RobotWorld } from './RobotWorld'
import { Rotation, WalkForward, WalkBackward } from "../reducers/robot"
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

var startingCode =
    `(function(){
    function SubRobot(){
        this.color = "red"
     };

     SubRobot.prototype = Object.create(RobotClass.prototype)

     SubRobot.prototype.onIdle = function(id){
       var robotInstance = backendStore.getState()[id]
        return [
          { frequency: 1, action: this.walkForward},
          { frequency: 400, action: this.rotation, degrees: 60},
        ]

    }
    
    SubRobot.prototype.onWallCollision = function(id){
        this.rotation(id, 45)
        this.walkForward(id)
     }
     
     SubRobot.prototype.onBoxCollision = function(id){
        this.rotation(id, 45)
        this.walkForward(id)
     }
     
     return new SubRobot()
    })`
var inputCode = startingCode

export default class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previousInput: ''
    }
  }

  onChange(newCode) {
    inputCode = newCode
  }

  onSubmit() {
    socket.emit('sendCode', inputCode)
  }

  render () {
    return(
      <div>
        <AceEditor
          mode="javascript"
          theme="monokai"
          onChange={this.onChange}
          name="ace-form"
          value={startingCode}
          editorProps={{$blockScrolling: true}}
          maxLines = {20}
          minLines = {10}
          />
        <button onClick={this.onSubmit}>Submit</button>
        <RobotWorld />
      </div>
    );
  }
}

// export default class NameForm extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             value: `
//             (function(){
//             function SubRobot(){
//                 this.color = "red"
//              };
//
//              SubRobot.prototype = Object.create(RobotClass.prototype)
//
//              SubRobot.prototype.start = function(id){
//                var robotInstance = backendStore.getState()[id]
//
//                  if (Math.abs(robotInstance.x) < 700 && Math.abs(robotInstance.z) < 700) {
//                      this.walkForward(id);
//                  } else {
//                   this.rotation(id, 1)
//                   this.walkForward(id)
//                 }
//              }
//
//              return new SubRobot()
//             })`
//         };
//
//         this.handleChange = this.handleChange.bind(this);
//         this.handleSubmit = this.handleSubmit.bind(this);
//     }
//
//     handleChange(event) {
//         this.setState({
//             value: event.target.value
//         });
//     }
//
//     handleSubmit(event) {
//         event.preventDefault();
//         socket.emit('sendCode', this.state.value)
//     }
//
//     render() {
//       return (
//         <div>
//         <form onSubmit={this.handleSubmit}>
//           <label>
//             Code robot:
//             <br />
//             <textarea  value={this.state.value} rows="40" onChange={this.handleChange} />
//           </label>
//           <br />
//           <input type="submit" value="Submit" />
//         </form>
//         <RobotWorld />
//       </div>
//       );
//     }
// }
