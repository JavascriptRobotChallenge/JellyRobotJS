import React from 'react'
import { Button, Modal } from 'react-bootstrap'

export default class TipsTricks extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      show: false
    }
  }

  render(){
    let close = () => this.setState({ show: false});
    return (
      <div className="tips">
        <div className="modal-container">
          <Button
            bsStyle="info"
            bsSize="large"
            onClick={() => this.setState({ show: true})}
          >
            Tips & Tricks
          </Button>
          <Modal
            show={this.state.show}
            onHide={close}
            container={this}
            aria-labelledby="contained-modal-title"
          >
            <Modal.Body>
              <div>
                <ul>
                  <li><strong>THE DOCS WILL BE YOUR BEST FRIEND!</strong></li>
                  <li>If you write <strong>bad code</strong> (incorrect syntax or improper functions), your robot will only <code>`walkForward()`</code>.</li>
                  <li>Use <strong>modulo math</strong> along with <code>`incrementCounter()`</code> and <code>`getCounter()`</code> to set patterns for walking or firing.</li>
                  <li>You have the ability to get your <strong>opponent's position and health </strong>- use this to your advantage!</li>
                  <li>Map coordinates of the walls and boxes are provided - this can be helpful in setting your robot's path.</li>
                </ul>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={close}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    )
  }
}
