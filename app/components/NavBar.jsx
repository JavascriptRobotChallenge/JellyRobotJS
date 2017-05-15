import React from 'react'
import { Link } from 'react-router'
import { NavBar, ButtonDropdown } from 'simple-react-bootstrap'
import WhoAmI from './WhoAmI'

/* ------ COMPONENT ------ */

const NavBarMain = ({ user }) => {
  return (
    <nav className="navbar navbar-default navbar-fixed-top topnav" role="navigation">
        <div className="container topnav">
            <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand topnav" href="/">Jelly Robots</a>
            </div>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="nav navbar-nav navbar-right">
                    <li>
                        <a href="/docs">Docs</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
  )
}

/* ------ CONTAINER ------ */

import { connect } from 'react-redux'

export default connect(
  ({ auth }) => ({ user: auth })
)(NavBarMain)

// <NavBar>
//   <NavBar.Header>
//     <NavBar.Brand>
//       <Link to="/" style={{ cursor: 'pointer' }}>JELLY ROBOTS</Link>
//     </NavBar.Brand>
//     <NavBar.Toggle />
//   </NavBar.Header>
//   <NavBar.Header>
//     <NavBar.Brand>
//       <Link to="/documentation" style={{ cursor: 'pointer' }}>DOCS</Link>
//     </NavBar.Brand>
//     <NavBar.Toggle />
//   </NavBar.Header>
//
// </NavBar>
