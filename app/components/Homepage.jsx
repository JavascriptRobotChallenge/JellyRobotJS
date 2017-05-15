import React, {Component} from 'react'

const Homepage = ({children, user}) => {
  return (
    <div>
      <a name="about"></a>
      <div className="intro-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="intro-message">
                <h1>JELLY ROBOTS</h1>
                <h3>Code your robot in Javascript to fight against other robots now.</h3>
                <hr className="intro-divider" />
                  { user ? <a href="/game" className="btn btn-default btn-lg" className="ghost-button">PLAY NOW</a> :
                        <a href="/login" className="btn btn-default btn-lg"className="ghost-button">PLAY NOW</a> }
                </div>
              </div>
            </div>

          </div>

        </div>
    </div>

  )
}

/* ------ CONTAINER ------ */

import { connect } from 'react-redux'

export default connect(
  ({ auth }) => ({ user: auth })
)(Homepage)

// <div className="jumbotron">
//   <p>
//     { user ? <a id="jumbobutton" href="/game" className="ghost-button">PLAY NOW</a> :
//       <a id="jumbobutton" href="/login" className="ghost-button">PLAY NOW</a> }</p>
// </div>
