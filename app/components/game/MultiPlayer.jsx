import React from 'react'
import { RobotWorld } from './RobotWorld'
import CodeEditor from './CodeEditor'
import TipsTricks from './TipsTricks'
import ColorPicker from './ColorPicker'


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
          <div className="col-md-8">
            <CodeEditor />
          </div>
          <div className="col-md-4">
            <TipsTricks />
          </div>
          <RobotWorld />
          <ColorPicker />
        </div>
      </div>
    );
  }

}
