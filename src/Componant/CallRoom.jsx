
import React, { Component } from 'react';
import JsSIP from "jssip";
import io from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
class CallRoom extends Component {
    constructor(props){
        super(props)
       // console.log(localStorage.getItem("UserId"))
        this.state={
          UserId:'',
          testid:'testid worked',
            socsket : io('http://192.168.8.102:6800'),

            User : localStorage.getItem("UserId") ,
            socket : new JsSIP.WebSocketInterface('ws://192.168.8.102:8080'),
            remoteAudio :new window.Audio().autoplay =true,
            mediaSource : new MediaSource(),
            session: null,         
            phone:null
                   
          

                    }
                    this.showTost = this.showTost.bind(this);
                    this.join = this.join.bind(this);

                    this.guest0 = React.createRef();
                    this.guest1 = React.createRef();
                    this.guest2 = React.createRef();
                    this.guest3 = React.createRef();
                    this.guest4 = React.createRef();
                    this.showTost = this.showTost.bind(this);
                    
                    this.runcam = this.runcam.bind(this);
                    this.setUser = this.setUser.bind(this);
                    this.askCall = this.askCall.bind(this);

                    this.callAsterisk = this.callAsterisk.bind(this);
                    this.add_stream = this.add_stream.bind(this);
                    this.Registering = this.Registering.bind(this);
                    this.config= this.config.bind(this);
                   // this.join()
                    this. setUser();

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


   
    callAsterisk(numTels) {
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
      
      add_stream (){
            this.state.session.connection.addEventListener('addstream',(e) =>{
                     // this.state.remoteAudio.srcObject = (e.stream);
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
                  this.state.session.on('peerconnection',(e) =>{
                  console.log('1accepted');
                  console.log(this.state.testid)
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


    
runcam(){

         navigator.mediaDevices.getUserMedia({ video: true, audio: false })
         .then(function(stream) {
         this.guest0.current.srcObject = stream;
         this.guest1.current.srcObject = stream;
         this.guest2.current.srcObject = stream;
         this.guest3.current.srcObject = stream;
         this.guest4.current.srcObject = stream;
         }.bind(this))
         .catch(function(err) {
             console.log("An error occurred: " + err);
         });
}

showTost(data){
    toast(data)
  }
      setUser(){
        if(this.state.setUser ==null)
        {  this.state.socsket.emit('GenerateUserId','mainroom',
          (data) => { 
            console.log(data)
            this.Registering(data.UserId)

            this.setState({UserId:data.UserId})
            this.join()
        }
          )}
     return this.state.setUser;
        
      }
      askCall(){
        this.state.socsket.to(this.state.TheRoom).emit('joined', this.state.UserId)

      }

      join(){
        console.log(this.state.UserId)

        var  strin = '{"title":"'+this.props.match.params.room+'"}';
        console.log(strin)
        this.state.socsket.emit('JoinStream',strin,
            (data) => { 
            if(data.status){
              this.showTost(data.room);
              this.setState({TheRoom:data.room});
              //this.askCall();

    this.state.socsket.emit('JoinRoom',
     '{"title":"'+this.props.match.params.room+'"}',this.state.UserId)

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

  componentDidMount(){
    this.state.socsket.on('joined', function(msg){
        console.log("this mother fucker Join the Stream")

        });
  }
    render() {
     //   this.runcam();
        return ( 
                            <React.Fragment>
                <div className="container-fulid w-auto h-100	">            
                <div className="row App-header">
                <ToastContainer />

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
 
export default CallRoom;