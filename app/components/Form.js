import React from 'react'
 import axios from "axios"
 export default class NameForm extends React.Component {
   constructor(props) {
     super(props);
     this.state = {value: ''};
 
     this.handleChange = this.handleChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
   }
 
   handleChange(event) {
     this.setState({value: event.target.value});
   }
 
   handleSubmit(event) {
       axios.post("api/code",{code:this.state.value})
       .then((result)=>{
         window.direction = result.data
       })
     event.preventDefault();
   }
 
   render() {
     return (
       <form onSubmit={this.handleSubmit}>
         <label>
           Code for robot:
           <br />
           <textarea  value={this.state.value} rows="40" onChange={this.handleChange} />
         </label>
         <br />
         <input type="submit" value="Submit" />
       </form>
     );
   }
 }