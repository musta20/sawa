var express = require("express");
var db = require("./db.js").db;
var Ajv = require('ajv');
var ajv = new Ajv();
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
const fs = require('fs');
var parser = require('body-parser')
const multer = require('multer');
const port = 6800;
var hash = require('object-hash');

app.use(parser.urlencoded({ extended: false }))

app.use(parser.json())
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
const path = require('path');

function GenerateUserId(){
  var username =  Math.floor(Math.random() * 1000000);

  var ha1 = hash.MD5(username+':' +'127.0.0.1'+ ':' +username)
  var halb = hash.MD5(username+ '@' +'127.0.0.1'+ ':' +'127.0.0.1'+ ':' +username)
  db.query("INSERT INTO `subscriber` (`id`, `username`, `domain`, `password`, `ha1`, `ha1b`) VALUES (NULL, '"+username+"', '127.0.0.1', '"+username+"', '"+ha1+"', '"+halb+"');"
  , function (error, results, fields) {
    if (error) {
      console.log('db error:');
      throw error;

    }
    

  });
  return username;

}

function GetRoomsNames(socket){
  var myo = io.sockets.adapter.rooms
  var obj = [];
console.log();

Object.getOwnPropertyNames(myo).map(function( index) {
    try{
      var c = JSON.parse(index)

    }catch(e){
      return [];
    }

    if(c != null){
      obj.push(c.title)
    }
    });
    return obj;

}

function GetRoomName(obj){
  try{
    var c = JSON.parse(obj)

   }catch(e){
     console.log('not object')
     return null
   } 
   return c.title

}

function IsRommeExist(room,socket){
 return GetRoomsNames(socket).includes(room);
}

function IsRoomFull(room){
try{
  if(io.sockets.adapter.rooms[room].length >= 5)
  {
    return true;
  }
}catch(e){

}
 
  return false;
}

function GetRoomsIamIn(socket){
  console.log("socket.rooms ========> ")
 var c =[];
 Object.getOwnPropertyNames(socket.rooms).map(e=> {
   if(GetRoomName(e)!=null){
    c.push(GetRoomName(e))
   }
  
  })
return c;
}

function LeavAllRooms(socket){
  var AllRome =  GetRoomsIamIn(socket);
  if(AllRome!=null){
    AllRome.map(rome=> {

      socket.leave('{"title":"'+rome+'"}')
    
    })
  }
  return true;
 
}


io.on("connection", function(socket) {
  globasoc = socket;


  socket.on("GenerateUserId", (room , fun) => {
    
    UserId = GenerateUserId();

      fun({status:true,room:GetRoomName(room), UserId:UserId})
      return
   

  });

  socket.on("IsRommeExist", (room , fun) => {

    if(!IsRommeExist(GetRoomName(room),socket)){
     
      fun({status:true,room:room})
      return
    }
    fun({status:false,room:"the room "+GetRoomName(room)+" is all ready exict"})


  });

  socket.on("CreateStream", (room , fun) => {
    
    var schema = {"properties":
    {"name": { 
      "type": "string",
      "minLength": 5  ,
      "maxLength": 8  ,
      "pattern":  "^[a-zA-Z0-9]{4,10}$"
    }
  }}
  var romaname = GetRoomName(room);
  var valid = ajv.validate(schema, {"name":romaname});
    if (!valid) {
      
      if(ajv.errors[0].message =='should match pattern "^[a-zA-Z0-9]{4,10}$"'){
        fun({status:false,room:"the name is not valid special character is not allowed"})
        return;
      }else{
        fun({status:false,room:"the name is not valed "+ajv.errors[0].message})
        return;
      }

    }

    if(!IsRommeExist(GetRoomName(room),socket)){
      LeavAllRooms(socket)

      UserId = GenerateUserId();
      console.log(UserId)
      socket.join(room);

      fun({status:true,room:GetRoomName(room), UserId:UserId})
      return
    }
    fun({status:false,room:"the room "+GetRoomName(room)+" is all ready exict"})


  });

  socket.on("JoinStream", (room , fun) => {
    if(IsRommeExist(GetRoomName(room),socket) && !IsRoomFull(room)){
      socket.join(room);
      fun({status:true,room:"you joined the room "+GetRoomName(room)})

      return
    }
    fun({status:false,room:"the room "+GetRoomName(room)+" is full or not exict"})


  });

  socket.on("create", (room , fun) => { 
    console.log(room)

    console.log(GetRoomName(room))
  if(IsRommeExist(GetRoomName(room),socket)){
    fun({status:false,room:"room name "+GetRoomName(room)+"Exist"})
    return
  }
  
   socket.join(room);
   fun({status:true,room:GetRoomName(room)})

   });
   
  socket.on("join", (room , fun) => {
    if(IsRommeExist(GetRoomName(room),socket) && !IsRoomFull(room)){
      socket.join(room);
      fun({status:true,room:"you joined the room "+GetRoomName(room)})
      return
    }
    fun({status:false,room:"the room "+GetRoomName(room)+" is full or not exict"})


  });

     
  socket.on("saveimg", (room , fun) => {

    var img = room;

    var fs = require('fs');
    var imgname =  GetRoomsIamIn(socket)[0]+'.png';
    console.log(imgname)
  var data = img.replace(/^data:image\/\w+;base64,/, "");
  var buf = new Buffer(data, 'base64');
 
  fs.writeFile('uploads/'+imgname, buf ,err => {
    if (err) throw err;
    console.log('Saved!');
  })

  });

  socket.on("GetRoomsIamIn", (room , fun) => {

  console.log(GetRoomsIamIn(socket))
  fun(GetRoomsIamIn(socket))


  });

  socket.on("leave", (room , fun) => {
      LeavAllRooms(socket)
      fun('leaved')


    });

  socket.on("GetRoomsIamIn", (room , fun) => {
    GetRoomsIamIn(socket)
    fun('leaved')


  });

  socket.on("getroom", (room,fun) => {

   
    fun(GetRoomsNames(socket))


  });

  socket.on("users", (room,fun) => {
      console.log(room)
      var clients = io.sockets.adapter.rooms[room].length;
      
      // console.log(io.sockets.adapter.rooms)
       console.log(clients)
       fun(clients)
  });

  socket.on("JoinRoom", ( room,userid) => {
    console.log(room)
    console.log(userid)
    socket.to(room).emit("JoinRoom", {
      userid
  //    name: "Friend"
    });
    
  })

  socket.on("typing", ({ room }) => {
    socket.to(room).emit("typing", "Someone is typing");
  });

  socket.on("stopped_tying", ({ room }) => {
    socket.to(room).emit("stopped_tying");
  });
});

http.listen(port, function() {
  console.log(`listening on *:${port}`);
});

app.post('/getUserId',function(req,res){
  var username =  Math.floor(Math.random() * 1000000);

  var ha1 = hash.MD5(username+':' +'127.0.0.1'+ ':' +username)
  var halb = hash.MD5(username+ '@' +'127.0.0.1'+ ':' +'127.0.0.1'+ ':' +username)
  db.query("INSERT INTO `subscriber` (`id`, `username`, `domain`, `password`, `ha1`, `ha1b`) VALUES (NULL, '"+username+"', '127.0.0.1', '"+username+"', '"+ha1+"', '"+halb+"');"
  , function (error, results, fields) {
    if (error) {
      return res.send('error:');

    }

  });

  return res.status(200).send({"UserId":username})

})

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, '/UserImg')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
  })
  var upload = multer({ storage: storage }).single('file')
  
app.get('/imges/:name',function(req,res){
  return  res.sendFile(path.join(__dirname, 'uploads/', req.params.name))
})

app.post('/UserdImg',function(req, res) {
  console.log(req.params);
                upload(req, res, function (err) {
                  if (err instanceof multer.MulterError) {
                      return res.status(500).json(err)
                  } else if (err) {
                      
                      console.log(err)
                      return res.status(500).json(err)
                  }
                  var thefile = req.file;
                  console.log(thefile.filename);
                  console.log(payload._id);
              //  console.log(donc);

              return res.status(200).send(thefile.filename)

              })

});