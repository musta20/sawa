var socket = new JsSIP.WebSocketInterface('wss://${{SERVER}}/ws');
socket.via_transport = "tcp";

//Create HTML Audio Object
var remoteAudio = new window.Audio()
remoteAudio.autoplay = true;

const mediaSource = new MediaSource();

var selfView = document.getElementById('selfView');
var remoteView = document.getElementById('remoteView');

var user = "${{USERNAME}}";
var pass = "${{PASSWORD}}";

var userAgent = JsSIP.version;

console.log('sip:%s@${{SERVER}}', user);

var configuration = {
  'uri': 'sip:'+ user + '@${{SERVER}}',
  'password': pass, // FILL PASSWORD HERE,
  'sockets': [ socket ],
  'register_expires': 180,
  'session_timers': false,
  'user_agent' : 'JsSip-' + userAgent
};

var phone;
if(user && pass){
    JsSIP.debug.enable('JsSIP:*');
    phone = new JsSIP.UA(configuration);
    phone.on('registrationFailed', function(ev){
      alert('Registering on SIP server failed with error: ' + ev.cause);
      configuration.uri = null;
      configuration.password = null;
    });

    phone.on('newRTCSession',function(ev){
        var newSession = ev.session;

        if(session){ // hangup any existing call
            session.terminate();
        }
        session = newSession;
        var completeSession = function(){
                        session = null;
        };


        if(session.direction === 'outgoing'){
                console.log('stream outgoing  -------->');               
        session.on('connecting', function() {
            console.log('CONNECT'); 
                        });
        session.on('peerconnection', function(e) {
            console.log('1accepted');
                        });
        session.on('ended', completeSession);
        session.on('failed', completeSession);
        session.on('accepted',function(e) {
            console.log('accepted')
                        });
        session.on('confirmed',function(e){
            console.log('CONFIRM STREAM');
                        });

                };

        if(session.direction === 'incoming'){
            console.log('stream incoming  -------->');               
        session.on('connecting', function() {
            console.log('CONNECT'); 
                        });
        session.on('peerconnection', function(e) {
            console.log('1accepted');
            add_stream(); 
                        });
        session.on('ended', completeSession);
        session.on('failed', completeSession);
        session.on('accepted',function(e) {
            console.log('accepted')
                        });
        session.on('confirmed',function(e){
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
            session.answer(options);
           }
    });
    phone.start();
}

var session;

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
    phone.call(numTel, options)
   add_stream();
};

function add_stream(){
                session.connection.addEventListener('addstream',function(e) {
                remoteAudio.srcObject = (e.stream);
                remoteView.srcObject = (e.stream);
                selfView.srcObject = (session.connection.getLocalStreams()[0][0]);
        })
}
