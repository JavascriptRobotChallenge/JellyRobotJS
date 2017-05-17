import React from 'react';
import {Link} from "react-router"
export default class Win extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
      return(
        <div>
          <div id="headerpicwin">
            <div className="headertext">
              <div className="col-xs-4">
              <Link to={"/game"}>
                <h1 className="resulttext">Congratulations, you win!</h1>
                <button>Play Again</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
    )
  }
}
