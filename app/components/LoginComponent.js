import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon'
import RaisedButton from 'material-ui/RaisedButton';
import FaceLogo from 'material-ui/svg-icons/action/face';
import {loginToFacebook} from 'APP/app/reducers/auth'
import {connect} from 'react-redux'

class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.loginToFacebook = this.loginToFacebook.bind(this)
  }

  render() {
    return(
    <a href="/api/auth/login/facebook">
      <button className="ui facebook button">
        <i className="facebook icon" />
        Facebook
      </button>
    </a>
    )
  }
}

export default LoginComponent;

