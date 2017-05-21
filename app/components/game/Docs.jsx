import React from 'react'
import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/theme/monokai';
import 'brace/theme/xcode';
import 'brace/mode/javascript';

/* ------ COMPONENT ------ */
const fireFunctions =
  `
  /**** Functions to invoke for firing ******/
  //default wall/box behaviour
  //your robot will automatically turn around when it hits boxes or walls

  // Accurate Fire- An more accurate shot
  accurateFire(roomName, playerId)
  //Strength: 1
  //Reload Time: 5 seconds

  //Rapid Fire - A quick, weak shot that fires in a random direction
  rapidFire(roomName, playerId)
  //Strength: 1
  //ReloadTime: 0.2 seconds

  //devastator - A powerful, accurate shot with a very long reload time
  devastator(roomName, playerId)
  //Strength: 3
  //ReloadTime: 15 seconds
`

const walkingFunctions =
  `
  //addRotation- Sets the direction of your robot
  addRotation(roomName, playerId, degrees)

  //setRotation
  setRotation(roomName, playerId, theta)

  //walkForward - Moves in whatever direction the current angle of your robot is set to
  walkForward(roomName, playerId)


  //walkTowardOpponent - This function will automatically follow your opponent
  //though you may have to add your own logic if you want it to effectively navigate boxes/walls
  //This function is also 40% slower than other walking functions
  walkTowardOpponent(roomName, playerId)

  //walkAwayFromOpponent - This function will automatically run away from your opponent
  //though you may have to add your own logic if you want it to effectively navigate boxes/walls
  walkAwayFromOpponent(roomName, playerId)
`

const helperFunctions =
  `
  /**** These functions can be used in your JavaScript
   to help build conditionals and other logic to get the edge!!
   ****/
  
  //incrementCounter and getCounter- increments or gets a counter that is stored for your robot.
  //These can be used to implement modulo math and change the behaviour of your robot over time.
  incrementCounter(roomName,playerId); getCounter(roomName,playerId);
  
  //findOpponent - returns the location of your opponent as an array
  findOpponent(roomName,playerId);
  
  //getOwnLocation - returns the location of your robots as an array
  getOwnLocation(roomName,playerId);
  
  //getOpponentsHealth - returns the health of your opponent
  getOpponentsHealth(roomName,playerId);
  
  //distanceBetween - returns the distance between you and your opponent
  //takes two arrays as inputs
  distanceBetween(arrOne, arrTwo);
  
  
  //angleBetween - returns the angle of a line between the first array and the second array
  angleBetween(arrOne, arrTwo);
  `

const media_style = {
  width: '200px',
  height: '200px',
  borderRadius: '50%'
}

const Docs = (props) => (
  <div className="docs-container">
    <div className="container">
    <div className="well">
      <div className="media" style={{ padding: '20px'}}>
      <div className="media-body">
        <h1 className="media-heading" style={{color: 'darkgreen', textAlign: 'center'}}>
          HOW TO CODE MY JELLY ROBOT?</h1>
        <h3>You have all the power of JavaScript in conjunction with our API at your fingertips to program the behaviour of your Jelly Robot.
          The code you write will be executed 30 times per second however many actions are throttled.</h3>
      </div>
    </div>
    </div>
    </div>
    <div className="container">
      <div className="well">
        <div className="media" style={{ padding: '20px'}}>
          <a className="pull-left" href="#">
            <img className="media-object" style={media_style} src="assets/walkingRobot.gif"/>
          </a>
          <div className="media-body">
            <h2 className="media-heading" style={{color: 'darkgreen'}}>Movement Functions</h2>
            <h3>Looking to charge your opponent, run away, make a custom movement function?<br/>
              The answer is here:</h3>
          </div>
        </div>
        <div className="ace-editor">
          <AceEditor
            mode="javascript"
            theme="xcode"
            readOnly={true}
            fontSize={15}
            height="400px"
            width="1000px"
            value={walkingFunctions}
            minLines={5}
            editorProps={{$blockScrolling: false}}
          />
        </div>
      </div>
      <div className="well">
        <div className="media" style={{ padding: '20px'}}>
          <a className="pull-left" href="#">
            <img className="media-object" style={media_style} src="assets/rapidFire.gif"/>
          </a>
          <div className="media-body">
            <h2 className="media-heading" style={{color: 'darkgreen'}}>Firing Functions</h2>
            <h3>Similarly, there are many firing methods you can take advantage <br/>
              of to defeat your opponent.<br/>
              These functions all have different reload times and strengths.<br/>
              Choose wisely!</h3>
          </div>
        </div>
        <div className="ace-editor">
          <AceEditor
            mode="javascript"
            theme="xcode"
            readOnly={true}
            fontSize={15}
            height="400px"
            width="1000px"
            value={fireFunctions}
            minLines={5}
            editorProps={{$blockScrolling: false}}
          />
        </div>
      </div>
      <div className="well">
        <div className="media" style={{ padding: '20px'}}>
          <a className="pull-left" href="#">
            {/*<img className="media-object" style={media_style} src="assets/rapidFire.gif"/>*/}
          </a>
          <div className="media-body">
            <h2 className="media-heading" style={{color: 'darkgreen'}}>Helper Functions</h2>
            <h3>Here are some functions that can be used strategically <br/>
              to track down and conquer your opponent.</h3>
          </div>
        </div>
        <div className="ace-editor">
          <AceEditor
            mode="javascript"
            theme="xcode"
            readOnly={true}
            fontSize={15}
            height="400px"
            width="1000px"
            value={helperFunctions}
            minLines={5}
            editorProps={{$blockScrolling: false}}
          />
        </div>
      </div>
    </div>
    <div className="container">
      <div className="well">
        <div className="media" style={{ padding: '20px'}}>
          <div className="media-body" style={{ textAlign: 'center' }}>
            <h2 className="media-heading" style={{color: 'darkgreen'}}>
              Below are important coordinates on the map</h2>
            <h3>Expert players can utilize this data to write more customized walking functions.</h3>
          </div>
        </div>
        <div className="coordinates">
          <img className="media-object" style={{ width: '700px', marginLeft: '200px'}} src="assets/gamemap.png"/>
        </div>
      </div>
    </div>
  </div>

  )
/*
* */

export default Docs
