import React, {Component} from 'react'

const Homepage = ({children, user}) => {
  return (
    <div className="jumbotron">
      <p>
        { user ? <a id="jumbobutton" href="/game" className="ghost-button">PLAY NOW</a> :
          <a id="jumbobutton" href="/login" className="ghost-button">PLAY NOW</a> }</p>
    </div>
  )
}

/* ------ CONTAINER ------ */

import { connect } from 'react-redux'

export default connect(
  ({ auth }) => ({ user: auth })
)(Homepage)
