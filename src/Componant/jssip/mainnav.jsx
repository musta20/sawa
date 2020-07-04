import React, { Component } from 'react';
import JsSIP from 'jssip';

class  Mainnav extends Component {
    constructor(props){
      super(props)
      this.state = { 
        session:null,
        chat:[],
        SIPuser:null }
        this.selfView = React.createRef()
        this.youtubeView = React.createRef()

      this.register = this.register.bind(this)
      this.callAsterisk = this.callAsterisk.bind(this)
      this.send = this.send.bind(this)
      this.addTheMass = this.addTheMass.bind(this)
      this.add_stream = this.add_stream.bind(this)
      }

      
       add_stream  (){

        this.state.session.connection.addEventListener('addstream',function(e) {
          console.log(this.state.session.connection)
          console.log('add_stream');
          console.log(e)
          console.log(e.track)
       const youtubstream =  this.youtubeView.current.captureStream();
       this.state.session.connection.addTrack(e,youtubstream);
      this.selfView.current.srcObject = (this.state.session.connection.getLocalStreams()[0]);
      this.youtubeView.current.srcObject = (this.state.session.connection.getLocalStreams()[0]);
        
                      
            }.bind(this))
            }

       callAsterisk() {
        var options = {
                'mediaConstraints' : { 'audio': true, 'video': true },
                'pcConfig': {
                  'rtcpMuxPolicy': 'require',
                  'iceServers': [
                  ]
                },
              };
        
       
            this.state.SIPuser.call('sip:'+this.refs.call.value+'@192.168.8.102', options);
            console.log(this.state.SIPuser);
           this.add_stream();
        };

    render() { 

        return (
        <div><h5>WebRT</h5>
                  <video className='video' ref={this.selfView} autoPlay muted={true} > </video>
                  <h3>
                 
                  <video width="420"  
 ref={this.youtubeView}
 height="315"
 src='http://localhost:3000/test.mp4' 
 controls
 >


 </video>
                     


                   
</h3>
            <h1>
           <br></br>
            <input ref='uri' type="text" name='username' placeholder='username'></input>
            <br></br>
            <input ref='pass' type="text" name='pass' placeholder='pass'></input>
            <br></br>
              <input ref='call' type="text" name='call' placeholder='call'></input>
              <br></br>
            <br></br>
              <br></br>

              <button onClick={this.register} >register</button>
            <br></br>
            <input ref='mesg' type="text" name='pass' placeholder='message'></input>
            <br></br>
              <button onClick={this.send} >send message</button>
            
              <br></br>
            <br></br>
              <button  onClick={this.callAsterisk}>call</button>
            </h1>
            <div><ul>
          {this.state.chat.map(item => (
            
            <li key={item.id} >{item.mes}</li>
          ))}
        </ul></div>
        </div>);
    }
    addTheMass(e){
      console.log('newMessage',e);/* Your code here */ 


    }

    
    register(e){

      var socket = new JsSIP.WebSocketInterface('ws://192.168.8.102:8080');
      var configuration = {
        sockets  : [ socket ],
        uri      : 'sip:'+this.refs.uri.value+'@192.168.8.102',
        password : this.refs.pass.value
      };

this.state.SIPuser = new JsSIP.UA(configuration)  
this.state.SIPuser.on('registered', function(e){
   console.log('registered'); });

this.state.SIPuser.on('newMessage',e=>this.setState(state=>{

  const chat = [...state.chat, {mes:e.request.body,id:state.chat+1}];   
     return {
      chat,
    };

   }));
   
   this.state.SIPuser.on('newRTCSession', function(e){ 
    this.state.session = e.session;

   
     if(this.state.session.direction === "outgoing"){
      console.log('stream outgoing  -------->');               
     this.state.session.on('connecting', function() {console.log('CONNECT'); });
     }

     if(this.state.session.direction === "incoming"){
      console.log('stream incoming  -------->');               
     this.state.session.on('connecting', function() {console.log('CONNECT'); });
     this.state.session.on('peerconnection', this.add_stream);

     this.state.session.on('ended', e=>this.setState({session:null}));
     this.state.session.on('failed', e=>this.setState({session:null}));
     this.state.session.on('accepted',function(e) {console.log('accepted') });
     this.state.session.on('accepted',function(e) {
      console.log('accepted')
                  });
     this.state.session.on('confirmed',function(e){
      console.log('CONFIRM STREAM');
                  });
      var options = {
          'mediaConstraints' : {'video': true },
          'pcConfig': {
            'rtcpMuxPolicy': 'require',
            'iceServers': []},};
            console.log('Incoming Call');

            this.state.session.answer(options);
     }


    }.bind(this));


this.state.SIPuser.start();



    }
    send(e){

      console.log('sip:'+this.refs.call.value+'@192.168.8.102');
      var eventHandlers = {
        'succeeded': function(e){console.log('mesg succeeded',e) /* Your code here */ },
        'failed':    function(e){ console.log('mesg failed') /* Your code here */ }
      };
      
      var options = {
        'eventHandlers': eventHandlers
      };
      
      this.state.SIPuser.sendMessage('sip:'+this.refs.call.value+'@192.168.8.102', this.refs.mesg.value, options);
    }
}
 
export default Mainnav;