import React from 'react'
import AceEditor from 'react-ace'
import CodeEditor from './CodeEditor'
import Docs from './Docs'
import 'brace/mode/javascript';
import 'brace/theme/monokai';

const documentation =
`//WALKING FUNCTIONS
//addRotation
this.addRotation(roomName, playerId, degrees)

//walkForward
this.walkForward(roomName, playerId)

//walkBackward
this.walkBackward(roomName, numTimes, id)

//walkTowardOpponent
this.walkTowardOpponent(roomName, playerId)

//walkAwayFromOpponent
this.walkAwayFromOpponent(roomName, playerId)

//setRotation
this.setRotation(roomName, playerId, theta)


//FIRING FUNCTIONS
//accurateFire
this.accurateFire(roomName, playerId)
// This function aims at your opponent but it is heavily throttled.
// If you find your own way of implementing aiming,
// you can enjoy the benefits of accurate aiming but without the throttling.
might need to fix this - not accurate

//rapidFire
this.rapidFire(roomName, playerId)

//devastator
this.devastator(roomName, playerId)
// Devastator is a very powerful fire, but there is a longer time where you cannot call it again.


//HELPER FUNCTIONS
//distanceBetween
this.distanceBetween([robot1.x, robot1.z], [robot2.x, robot2.z])
this.distanceBetween([20, 42], [23, 46])
// 5

this.distanceBetween(robot.getOwnPosition()], robot.findOpponent())

// Takes the positions of two robots as arguments ([robot1.x, robot1.z], [robot2.x, robot2.z]).
// Y positions are not modified in this game because our robots cannot jump.
// Returns the distance between two robots, using the Pythagorean Theorem.

//angleBetween
this.angleBetween(arrOne, arrTwo)
// PI
// Takes the positions of two robots, returns the angle between them, in radians.

// give them accurateFire, but throttle it a lot. Give them a reward if they implement this on their own.`

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
                        width="540px"
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
