import React from 'react'
import AceEditor from 'react-ace'
import CodeEditor from './CodeEditor'
import Docs from './Docs'
import 'brace/mode/javascript';
import 'brace/theme/monokai';

const documentation =
`
  /************* Functions to be invoked: *************/

  // incrementCounter and getCounter- increments or gets a counter that is stored for your robot.
  // These can be used to implement modulo math and change the behaviour of your robot over time.
  getCounter(roomName, playerId); incrementCounter(roomName, playerId)

  //distanceBetween - returns the distance between you and your opponent / accepts two arrays as inputs
   distanceBetween(arrOne, arrTwo)

  // set rotation - set the angle(theta) of rotation
  setRotation(roomName, playerId, theta)

  //angleBetween - returns the angle of a line between the first array and the second array
  angleBetween(arrOne, arrTwo)

  // Accurate Fire- An more accurate shot
  accurateFire(roomName, playerId)

  // Rapid Fire - A quick, weak shot that fires in a random direction
  rapidFire(roomName, playerId)

  // devastator - A powerful, accurate shot with a very long reload time
  devastator(roomName, playerId)

  //findOpponent - returns the location of your opponent as an array
  findOpponent(roomName, playerId)

  //getOpponentsHealth - returns the health of your opponent
  getOpponentsHealth(roomName,playerId)

  // addRotation- Sets the direction of your robot
  addRotation(roomName, playerId, degrees)

  // walkForward - Moves in whatever direction the current angle of your robot is set to
  walkForward(roomName, playerId)

  // walkTowardOpponent - This function will automatically follow your opponent
  // though you may have to add your own logic if you want it to effectively navigate boxes/walls
  // This function is also 40% slower than other walking functions
  walkTowardOpponent(roomName, playerId)

  / walkAwayFromOpponent - This function will automatically run away from your opponent
  // though you may have to add your own logic if you want it to effectively navigate boxes/walls
  walkAwayFromOpponent(roomName, playerId)
`

const EditorDocs = (props) => (
  <div>
      <div className="col-md-6">
        <CodeEditor />
      </div>
      <div className="col-md-6">
          <div className="row">
              <div className="panel panel-primary">
                  <div className="panel-heading" id="accordion">
                      <span className="glyphicon glyphicon-book"></span> Docs
                      <div className="btn-group pull-right">
                          <a type="button" className="btn btn-default btn-xs" data-toggle="collapse" data-parent="#accordion" href="#docs">
                              <span className="glyphicon glyphicon-chevron-down"></span>
                          </a>
                      </div>
                  </div>
                <div className="panel-collapse collapse" id="docs">
                    <div className="panel-body">
                      <AceEditor
                        mode="javascript"
                        theme="monokai"
                        readOnly={true}
                        wrapEnabled={true}
                        value={documentation}
                        editorProps={{$blockScrolling: true}}
                        />
                    </div>
                </div>
              </div>
          </div>
      </div>
  </div>
)

export default EditorDocs
