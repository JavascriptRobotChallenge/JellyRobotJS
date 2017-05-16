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
            <Link to={"/home"}>
              <h1 className="resulttext">Tie</h1>
              <button>Back Home</button>
              </Link>
            </div>
          </div>
          </div>
  
        </div>
          )
  }
}
