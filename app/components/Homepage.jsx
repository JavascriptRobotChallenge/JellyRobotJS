import React, {Component} from 'react'

const Homepage = ({children, user}) => {
  return (
      <div className="intro-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="intro-message">
                <h1>JELLY ROBOTS</h1>
                <h3>Code your robot in Javascript to fight against other robots now.</h3>
                <hr className="intro-divider" />
                <a href={ user ?"/game" : "/login" } className="btn btn-default btn-lg" className="ghost-button">
                  MULTIPLAYER
                </a>
                <a href="/training" className="btn btn-default btn-lg" className="middle-ghost-button">
                  TRAINING
                </a>
                <a href="/docs" className="btn btn-default btn-lg" className="bottom-ghost-button">
                  DOCS
                </a>
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
