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

// <ul className="list-inline intro-social-buttons">
//   <li>
//     <a href="https://twitter.com/SBootstrap" className="btn btn-default btn-lg"><i className="fa fa-twitter fa-fw"></i> <span className="network-name">Twitter</span></a>
//   </li>
//   <li>
//     <a href="https://github.com/IronSummitMedia/startbootstrap" className="btn btn-default btn-lg"><i className="fa fa-github fa-fw"></i> <span className="network-name">Github</span></a>
//   </li>
//   <li>
//     <a href="#" className="btn btn-default btn-lg"><i className="fa fa-linkedin fa-fw"></i> <span className="network-name">Linkedin</span></a>
//   </li>
// </ul>
