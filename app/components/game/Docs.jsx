import React from 'react'
import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/theme/monokai';
import 'brace/mode/javascript';

/* ------ COMPONENT ------ */
const fireFunctions =
`//accurateFire
this.accurateFire(roomName, playerId)
// This function aims at your opponent but it is heavily throttled.
// If you find your own way of implementing aiming,
// you can enjoy the benefits of accurate aiming but without the throttling.
might need to fix this - not accurate

//rapidFire
this.rapidFire(roomName, playerId)

//devastator
this.devastator(roomName, playerId)
// Devastator is a very powerful fire, but there is a longer time where you cannot call it again.`

const walkingFunctions =
`//addRotation
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
this.setRotation(roomName, playerId, theta)`

const helperFunctions = `//distanceBetween
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

const Docs = (props) => (
  <div className="docs-container">
    <div className="docs-header">
      <div className="header-title">
        <h1>
          HOW TO CODE MY JELLY ROBOT?
        </h1>
      </div>
      <hr/>
      <h3>Introduction</h3>
    </div>
    <p>
      Your JellyRobot inherits from our built in Robot Class, so it has the following methods built in for you to use!<br/>
      The code you write will be executed 30 times per second.<br/>
      An important thing to remember is that many of our methods require you to pass in your room name and your robotId.
    </p>
    <hr/>
      <h5> Robot Colors </h5>
      <p>
        You can choose from the following colors and set your (this.color = "whatever-color") otherwise it will default to 'red'.
        <br />
        COLORS: red, blue, green, orange, pink, yellow, purple, black, white
      </p>
    <hr/>
      <h5> Walking Functions </h5>
      <p>
        You can implement various walking functions that behave differently.<br/>
        Walking toward your opponent will make you slower than they are.
      </p>
      <div className="ace-editor">
          <AceEditor
            mode="javascript"
            theme="monokai"
            readOnly={true}
            height="300px"
            width="900px"
            value={walkingFunctions}
            minLines={5}
            editorProps={{$blockScrolling: false}}
            />
      </div>
    <hr/>
      <h5>
        Firing Functions
      </h5>
      <p>
        Similarly, there are many firing methods you can take advantage of to defeat your opponent.<br/>
        These functions all have different reload times and strengths.
        Choose wisely!
      </p>
      <div className="ace-editor">
          <AceEditor
            mode="javascript"
            theme="monokai"
            readOnly={true}
            height="300px"
            width="900px"
            value={fireFunctions}
            minLines={5}
            editorProps={{$blockScrolling: false}}
            />
      </div>
    <hr/>
      <h5>
        Helper Functions
      </h5>
      <p>
        Here are some functions that can be used strategically to track down and conquer your opponent. <br/>
      </p>
      <div className="ace-editor">
          <AceEditor
            mode="javascript"
            theme="monokai"
            readOnly={true}
            height="300px"
            width="900px"
            value={helperFunctions}
            minLines={5}
            editorProps={{$blockScrolling: false}}
            />
      </div>
  </div>
)

export default Docs
