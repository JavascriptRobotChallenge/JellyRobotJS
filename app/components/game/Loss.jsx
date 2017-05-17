import React from 'react';
import {Link} from "react-router"
export default class Loss extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
      return(
          <div>
        <div id="headerpicloss">
          <div className="headertext">
            <div className="col-xs-4">
            <Link to={"/game"}>
              <h1 className="resulttext">You've been defeated!</h1>
              <button>Try Again</button>
              </Link>
            </div>
          </div>
          </div>

        </div>
          )
  }
}
