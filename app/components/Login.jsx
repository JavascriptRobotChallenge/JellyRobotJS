import React from 'react';
import {loginToFacebook} from 'APP/app/reducers/auth'
import {connect} from 'react-redux'

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="buffer oauth">
        <p>
          <a
            href="/api/auth/login/google"
            className="btn btn-social btn-google">
            <i className="fa fa-google" />
            <span>Login with Google</span>
          </a>
        </p>
        <p>
          <a
            href="/api/auth/login/github"
            className="btn btn-social btn-github">
            <i className="fa fa-github" />
            <span>Login with GitHub</span>
          </a>
        </p>
        <p>
          <a
            href="/api/auth/login/facebook"
            className="btn btn-social btn-facebook">
            <i className="fa fa-facebook" />
            <span>Login with Facebook</span>
          </a>
        </p>
      </div>
    )
  }
}

export default Login;
