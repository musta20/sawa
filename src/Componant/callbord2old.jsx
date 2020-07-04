
import React, { Component } from 'react';
import JsSIP from "jssip"
class CallBord extends Component {
    constructor(props){
        super(props)
        console.log(localStorage.getItem("UserId"))
        this.state={
            
            User : localStorage.getItem("UserId") ,
            socket : new JsSIP.WebSocketInterface('ws://192.168.8.102/ws').via_transport = "tcp",
            remoteAudio :new window.Audio().autoplay =true,
            mediaSource : new MediaSource(),
            user : "${{USERNAME}}",
            pass : "${{PASSWORD}}",
            session: null,
            configuration : {
                        'uri': 'sip:'+ localStorage.getItem("UserId") + '@${{SERVER}}',
                        'password': localStorage.getItem("UserId") , // FILL PASSWORD HERE,
                        'sockets': [ this.socket ],
                        'register_expires': 180,
                        'session_timers': false,
                        'user_agent' : 'JsSip-' + JsSIP.version,
                            },

            phone:null
                    }

                    this.guest0 = React.createRef();
                    this.guest1 = React.createRef();
                    this.guest2 = React.createRef();
                    this.guest3 = React.createRef();
                    this.guest4 = React.createRef();
                    this.runcam = this.runcam.bind(this);


    }

runcam(){

         //this.props.match.params.id,
         navigator.mediaDevices.getUserMedia({ video: true, audio: false })
         .then(function(stream) {
         //    this.refs.guest0.current.srcObject
         this.guest0.current.srcObject = stream;
         this.guest1.current.srcObject = stream;
         this.guest2.current.srcObject = stream;
         this.guest3.current.srcObject = stream;
         this.guest4.current.srcObject = stream;
           //  this.refs.guest0.play();
         }.bind(this))
         .catch(function(err) {
             console.log("An error occurred: " + err);
         });
}

  
    render() {
        this.runcam();
        return ( 
            <React.Fragment>
<div className="container-fulid 	">            
<div className="row App-header">
<br></br>
<br></br>
<br></br>
</div>
            <div className="row App-header">
                
            <div className=" col-3 ">
                <video  ref={this.guest1}  autoPlay className="Vd-box h-0 w-100 "></video>
                <video  ref={this.guest2}  autoPlay className="Vd-box h-0 w-100 "></video>
           </div>
           <video   ref={this.guest0} autoPlay className="Vd-box p-0 col-6 "></video>
                <div className="App-header col-3 ">
                    <video  ref={this.guest3}  autoPlay className="Vd-box h-0 w-100 "></video>
                    <video  ref={this.guest4}  autoPlay className="Vd-box h-0 w-100 "></video>
                </div>
                <div className="col App-header">
                    <br></br>
                </div>

            
           

          </div>
          </div>
          </React.Fragment>
       );
    }
}
 
export default CallBord;