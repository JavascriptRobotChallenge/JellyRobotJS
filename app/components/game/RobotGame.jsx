import React from 'react'
import { RobotWorld } from './RobotWorld'
// import CountdownReduxContainer from "./Countdown"
import EditorDocs from './EditorDocs'

export default class RobotGame extends React.Component {
  render () {
    return(
      <div>
        <div className="multiplayer-mode">
          <div className="multiplayer-header">
            <h2>Welcome to Multiplayer Mode</h2>
            <h3>Play against an opponent and test your skills.</h3>
          </div>
          <hr></hr>
        </div>
        <div className="robot-game">
          <EditorDocs />
          <RobotWorld />
        </div>
      </div>
    );
  }
}
