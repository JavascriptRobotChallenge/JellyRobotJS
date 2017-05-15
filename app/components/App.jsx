import React, {Component} from 'react'
import NavBarMain from './NavBar'

export default function App({ children }) {
  return (
    <div id="main" className="container-fluid">
      <div>
        <NavBarMain />
      </div>
      <div>
        { children }
      </div>
    </div>
  )
}
