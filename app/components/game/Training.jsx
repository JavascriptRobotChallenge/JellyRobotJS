import React from 'react'
import TrainingCodeEditor from './TrainingCodeEditor'
import TipsTricks from './TipsTricks'
import {RobotWorld} from './RobotWorld'
import Healthbar from './Healthbar'

export default class Training extends React.Component {
  render () {
    return(
      <div>
        <div className="training-mode">
          <div className="training-header">
            <h2>Welcome to Easy Training Mode</h2>
            <h3>Test your code by defeating our default robot.</h3>
          </div>
          <hr></hr>
        </div>
        <div className="robot-game">
          <div className="col-md-8">
            <TrainingCodeEditor />
          </div>
          <div className="col-md-4">
            <TipsTricks />
          </div>
          <RobotWorld />
        </div>
      </div>
    );
  }
}
