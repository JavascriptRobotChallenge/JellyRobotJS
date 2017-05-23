import React from 'react';
import {Link} from "react-router"
import { Button } from 'react-bootstrap'

const Loss = (props) => (
    <div>
      <div id="headerpicloss">
        <div className="headertext">
          <div className="col-xs-4">
          <Link to={"/home"}>
            <h1 className="resulttext">You've been defeated!</h1>
              <Button
                bsStyle="default"
                bsSize="lg"
              > Back Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
)

export default Loss
