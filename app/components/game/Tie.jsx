import React from 'react';
import {Link} from "react-router"
export default class Tie extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
      return(
          <div>
        <div id="headerpictie">
          <div className="headertext">
            <div className="col-xs-4">
            <Link to={"/game"}>
              <h1 className="resulttext">Tied Match!</h1>
              <button>Try Again</button>
              </Link>
            </div>
          </div>
          </div>

        </div>
          )
  }
}
