
import React, { Component } from 'react';
import JsSIP from "jssip"
import io from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
class CallBord extends Component {
    constructor(props){
        super(props)
        this.state={
            socsket : io('http://192.168.8.102:6800'),
            User : localStorage.getItem("UserId") ,
            socket : new JsSIP.WebSocketInterface('ws://192.168.8.102:8080'),
            remoteAudio :new window.Audio().autoplay =true,
            mediaSource : new MediaSource(),
            session: null,         
            phone:null,
             width : 320,   // We will scale the photo width to this
             height : 0,
             streaming:false
                   
          
          }
        //  video = document.getElementById('video');
        this.canvas =React.createRef();
        this.photo = React.createRef();

              this.showTost = this.showTost.bind(this);
              this.createTheStream = this.createTheStream.bind(this)
              this.guest0 = React.createRef();
              this.guest1 = React.createRef();
              this.guest2 = React.createRef();
              this.guest3 = React.createRef();
              this.guest4 = React.createRef();
              this.takepicture = this.takepicture.bind(this);
          //    this.clearphoto = this.clearphoto.bind(this);

              this.runcam = this.runcam.bind(this);
              
              this.createTheStream();
              this.callAsterisk = this.callAsterisk.bind(this);
              this.add_stream = this.add_stream.bind(this);
              this.Registering = this.Registering.bind(this);
              this.config= this.config.bind(this);

        
    }

    config(user){
      console.log(user)
     var configuration = {
        'uri': 'sip:'+ user + '@192.168.8.102',
        'password': user , // FILL PASSWORD HERE,
        'sockets': [ this.state.socket ],
        'register_expires': 180,
        'session_timers': false,
        'user_agent' : 'JsSip-' + JsSIP.version,
            }
            return configuration;
    }

    showTost(data){
        toast(data)
      }

    createTheStream(){
     
        this.state.socsket.emit('CreateStream','{"title":"'+this.props.match.params.room+'"}',
        (data) => { 
          console.log(data)
          if(data.status){
           this.showTost(data.room);
            //this.AddName()
          //  this.clearphoto();
          

            this.Registering(data.UserId)
          }else{
            
            this.showTost(data.room);
            setTimeout(function(){
              document.location.href="/"
              }, 3000);
          }


      })
      this.state.socsket.on('JoinRoom', function(userid){
        console.log('JoinRoom')
        this.showTost(userid);
        this.callAsterisk(userid);
       }.bind(this));
      }



   takepicture() {
    console.log("videoHeight "+this.guest0.current.videoHeight)
    console.log("videoWidth "+this.guest0.current.videoWidth)
    var context = this.canvas.current.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, 
      280, 
      200);
    var data = this.canvas.current.toDataURL('image/png');
  this.photo.current.src= data;

    var context = this.canvas.current.getContext('2d');
      this.canvas.current.width=280
      this.canvas.current.height= 200
      context.drawImage(this.guest0.current, 0, 0, 
        280
      , 200);
      var data = this.canvas.current.toDataURL('image/png');
    
      this.state.socsket.emit('saveimg', data,
      (data) => { 
      console.log(data); 
    }
    )
 
  }


     componentDidMount(){
      setTimeout(()=>{
        this.takepicture();
      }, 3000);
     }

    runcam(){
      console.log('runcam')
         //this.props.match.params.id,
         navigator.mediaDevices.getUserMedia({ video: true, audio: false })
         .then(function(stream) {
         //    this.refs.guest0.current.srcObject
         this.guest0.current.srcObject = stream;
  
         
         }.bind(this))
         .catch(function(err) {
             console.log("An error occurred: " + err);
         });
        
}
    render() {
        this.runcam();
        return ( 
            <React.Fragment>
                              <ToastContainer />
                              <canvas ref={this.canvas} className="unv"  id="canvas">
    </canvas>
    <div className="output unv">
      <img id="photo" ref={this.photo} alt="The screen capture will appear in this box."></img>
      <img id="a" alt="The screen capture will appear in this box."></img>
    </div>
<div className="container-fulid w-auto h-100	">            
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



    callAsterisk(numTels) {
      console.log(numTels.userid)
      var options = {
              'mediaConstraints' : { 'audio': true, 'video': true },
              'pcConfig': {
                'rtcpMuxPolicy': 'require',
                'iceServers': [
                ]
              },
            };
      
          this.state.phone.call('sip:'+numTels.userid+'@192.168.8.102', options)
        this.add_stream();
      };
      
    add_stream(){
            this.state.session.connection.addEventListener('addstream',(e)=> {
                     this.state.remoteAudio.srcObject = (e.stream);
                      this.guest1.current.srcObject = (e.stream);
                      this.guest0.current.srcObject = (this.state.session.connection.getLocalStreams()[0]);
              })
      }

    Registering(user){
      console.log(this.config(user))
          //this.state.JsSIP.debug.enable('JsSIP:*');
          this.setState({phone : new JsSIP.UA(this.config(user))})
          this.state.phone.on('registered', function(e){
         console.log('registered'); });
         
          this.state.phone.on('registrationFailed', function(ev){
           console.log('Registering on SIP server failed with error: ' + ev.cause);
          console.log(ev)  
          //this.state.configuration.uri = null;
            //this.state.configuration.password = null;
          });
      
          this.state.phone.on('newRTCSession',function(ev){
              var newSession = ev.session;
      
              if(this.state.session){ // hangup any existing call
                  this.state.session.terminate();
              }
              this.setState({session :newSession})

              var completeSession = function(){
                  this.setState({session :null})
                  console.log('completeSession')
              }.bind(this);
      
      
              if(this.state.session.direction === 'outgoing'){
              console.log('stream outgoing  -------->');               
              this.state.session.on('connecting', function() {
                  console.log('CONNECT'); 
                              });
              this.state.session.on('peerconnection', function(e) {
                  console.log('1accepted');
                              });
              this.state.session.on('ended', completeSession);
              this.state.session.on('failed', completeSession);
              this.state.session.on('accepted',function(e) {
                  console.log('accepted')
                              });
              this.state.session.on('confirmed',function(e){
                  console.log('CONFIRM STREAM');
                              });
      
                      };
      
              if(this.state.session.direction === 'incoming'){
                  console.log('stream incoming  -------->');               
                  this.state.session.on('connecting', function() {
                  console.log('CONNECT'); 
                              });
                  this.state.session.on('peerconnection', function(e) {
                  console.log('1accepted');
                  this.add_stream(); 
                              });
                  this.state.session.on('ended', completeSession);
                  this.state.session.on('failed', completeSession);
                  this.state.session.on('accepted',function(e) {
                  console.log('accepted')
                              });
                  this.state.session.on('confirmed',function(e){
                  console.log('CONFIRM STREAM');
                              });
      
                      var options = {
                  'mediaConstraints' : { 'audio': true, 'video': true },
                  'pcConfig': {
                    'rtcpMuxPolicy': 'require',
                    'iceServers': [
                                                          ]
                                              },
                                      };
                  console.log('Incoming Call');
                  this.state.session.answer(options);
                }
          }.bind(this));
          this.state.phone.start();
      
      
    }


  }
 
export default CallBord;