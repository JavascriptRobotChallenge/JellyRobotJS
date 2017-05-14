import React from 'react'
import { Link } from 'react-router'
import { NavBar, ButtonDropdown } from 'simple-react-bootstrap'
import WhoAmI from './WhoAmI'

/* ------ COMPONENT ------ */

const NavBarMain = ({ user }) => {
  return (
    <NavBar>
      <NavBar.Header>
        <NavBar.Brand>
          <Link to="/" style={{ cursor: 'pointer' }}>JELLY ROBOTS</Link>
        </NavBar.Brand>
        <NavBar.Toggle />
      </NavBar.Header>
      <NavBar.Header>
        <NavBar.Brand>
          <Link to="/documentation" style={{ cursor: 'pointer' }}>DOCS</Link>
        </NavBar.Brand>
        <NavBar.Toggle />
      </NavBar.Header>

    </NavBar>
  )
}

/* ------ CONTAINER ------ */

import { connect } from 'react-redux'

export default connect(
  ({ auth }) => ({ user: auth })
)(NavBarMain)

// <NavBar.Nav className="pull-right">
//   { user ? <WhoAmI /> : <NavBar.Item active={true} href="/authenticate">LOGIN/SIGNUP</NavBar.Item> }
// </NavBar.Nav>
