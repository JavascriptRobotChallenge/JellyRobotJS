import React from 'react'
import store from "../../store"
import { RobotWorld } from './RobotWorld'
import { Rotation, WalkForward, WalkBackward } from "../../reducers/frontendStore"
import AceEditor from 'react-ace';
import socket from '../../socket';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

var startingCode =
`(function(){
   function SubRobot(){
       this.color = "red"
    };

  SubRobot.prototype = Object.create(RobotClass.prototype)
  //ToDo: call functions with roomName and PlayerId so we know
  // which robot to move
  SubRobot.prototype.start = function(roomName, playerId){
    this.walkForward(roomName, playerId)
    this.walkTowardOpponent(roomName, playerId)
  }

  return new SubRobot()
})`
var inputCode = startingCode

export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previousInput: ''
    }
  }

  onSubmit() {
    socket.emit('sendCode', inputCode, store.getState().gameData.room)
  }

  render () {
    return(
      <div className="container">
          <div className="row">
              <div className="col-md-7">
                  <div className="panel panel-primary">
                      <div className="panel-heading" id="accordion">
                          <span className="glyphicon glyphicon-pencil"></span> Code Editor
                          <div className="btn-group pull-right">
                              <a type="button" className="btn btn-default btn-xs" data-toggle="collapse" data-parent="#accordion" href="#collapseOne">
                                  <span className="glyphicon glyphicon-chevron-down"></span>
                              </a>
                          </div>
                      </div>
                  <div className="panel-collapse collapse" id="collapseOne">
                      <div className="panel-body">
                          <AceEditor
                            mode="javascript"
                            theme="monokai"
                            onChange={this.onChange}
                            height="800px"
                            width="600px"
                            name="ace-form"
                            value={startingCode}
                            editorProps={{$blockScrolling: true}}
                            maxLines = {50}
                            minLines = {25}
                            />
                      </div>
                      <div className="panel-footer">
                          <div className="input-group">
                              <span className="input-group-btn">
                                  <button className="btn btn-warning btn-sm" onClick={this.onSubmit} id="btn-chat">
                                      Send</button>
                              </span>
                          </div>
                      </div>
                  </div>
                  </div>
              </div>
          </div>
      </div>

    );
  }
}
