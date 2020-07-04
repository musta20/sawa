

function callAsterisk(numTels) {
    var options = {
            'mediaConstraints' : { 'audio': true, 'video': true },
            'pcConfig': {
              'rtcpMuxPolicy': 'require',
              'iceServers': [
              ]
            },
          };
    
        var numTel = numTels.toString();
        var num = '200';
        console.log(numTel);
        this.phone.call(numTel, options)
       this.add_stream();
    };
    
function add_stream(){
                    this.this.state.session.connection.addEventListener('addstream',function(e) {
                    this.this.state.remoteAudio.srcObject = (e.stream);
                    this.this.state.remoteView.srcObject = (e.stream);
                    this.this.state.selfView.srcObject = (session.connection.getLocalStreams()[0]);
            })
    }

function Registering(){
    if(this.state.user && this.state.pass){
        this.state.JsSIP.debug.enable('JsSIP:*');
        this.setState({phone : new JsSIP.UA(this.state.configuration)})
        this.state.phone.on('registrationFailed', function(ev){
        //  alert('Registering on SIP server failed with error: ' + ev.cause);
          this.state.configuration.uri = null;
          this.state.configuration.password = null;
        });
    
        this.state.phone.on('newRTCSession',function(ev){
            var newSession = ev.session;
    
            if(this.state.session){ // hangup any existing call
                this.state.session.terminate();
            }
            this.setState({session :newSession})

            var completeSession = function(){
                this.setState({session :null})
            };
    
    
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
                add_stream(); 
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
        });
        this.state.phone.start();
    }
    
}