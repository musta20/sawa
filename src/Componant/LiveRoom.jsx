import React, { Component } from 'react';

class  LiveRoom extends Component {
    state = {  }
    constructor(props){
      super(props)
     
      
    }

    render() { 
 
        return (
  <div className="row   h-25  align-items-center">
   <div    className="  col ">
     <div className="mov Vd-box"
      style={{width:'280px',height:'200px', backgroundImage: "url(http://localhost:6800/imges/"+this.props.room+".png)"}} >
        <span className=" badge badge-danger">LIVE</span>
        </div>
        </div></div> );
    }
}
 
export default LiveRoom;