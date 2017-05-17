import React from 'react'
import RobotGame from './RobotGame'
import TrainingCodeEditor from './TrainingCodeEditor'
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
          <TrainingCodeEditor />
          <RobotWorld />
          <Healthbar />
        </div>
      </div>
    );
  }
}
