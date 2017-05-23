import React from 'react';
import {connect} from 'react-redux'

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="buffer-oauth">
        <p>
          <a
            href="/api/auth/login/facebook"
            className="btn btn-social btn-facebook">
            <i className="fa fa-facebook" />
            <span id="facebook-btn">Login with Facebook</span>
          </a>
        </p>
      </div>
    )
  }
}

export default Login;
