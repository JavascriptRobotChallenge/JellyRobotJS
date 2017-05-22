import React from 'react'
import store from "../../store"
import { RobotWorld } from './RobotWorld'
import AceEditor from 'react-ace';
import socket from '../../socket';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

var startingCode =
`walkForward(roomName, playerId)`
var inputCode = startingCode

class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previousInput: startingCode,
      isButtonDisabled: false
    }
  }

  onChange = (newCode) => {
    this.setState({previousInput: newCode})
  }

  onSubmit = () => {
    this.setState({isButtonDisabled: true})

    const code = this.state.previousInput
    const room = this.props.room
    const user = this.props.user
    socket.emit('sendCode', room, code, user)
  }

  onSaveRobot = () => {
    const userId = this.props.user.id
    this.props.saveRobot('testRobot', this.state.previousInput, userId)
  }

  render () {
    return(
          <div className="row">
              <div className="panel panel-primary">
                <div className="panel-heading" id="accordion">
                    <span className="glyphicon glyphicon-pencil"></span> Code Editor
                    <div className="btn-group pull-right">
                        <a type="button" className="btn btn-default btn-xs" data-toggle="collapse" data-parent="#accordion" href="#code">
                            <span className="glyphicon glyphicon-chevron-down"></span>
                        </a>
                    </div>
                </div>
                <div className="panel-collapse collapse" id="code">
                    <div className="panel-body">
                        <AceEditor
                          mode="javascript"
                          theme="monokai"
                          onChange={this.onChange}
                          fontSize={15}
                          height="800px"
                          width="1000px"
                          name="ace-form"
                          value={this.state.previousInput}
                          defaultValue={startingCode}
                          editorProps={{$blockScrolling: true}}
                          maxLines = {50}
                          minLines = {23}
                          />
                    </div>
                    <div className="panel-footer">
                        <div className="input-group">
                            <span className="input-group-btn">
                                <button
                                  className="btn btn-warning btn-sm"
                                  onClick={this.onSubmit} id="btn-chat"
                                  disabled={this.state.isButtonDisabled}
                                  >Submit</button>
                            </span>
                            <span className="input-group-btn">
                                <button className="btn btn-warning btn-sm" onClick={this.onSaveRobot} id="btn-chat">
                                    Save Your Robot</button>
                            </span>
                        </div>
                    </div>
                </div>
              </div>
          </div>
    );
  }
}

/* ------ CONTAINER ------ */

import { connect } from 'react-redux'
import { SaveRobot } from "../../reducers/frontendStore"

const mapStateToProps = (state) => ({
  user: state.auth.user,
  room: state.gameData.room
})

const mapDispatchToProps = (dispatch) => ({
  saveRobot: function(robotName, code, userId) {
    dispatch(SaveRobot(robotName, code, userId))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor)
