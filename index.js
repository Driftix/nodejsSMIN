var express = require('express');
const formidable = require('express-formidable');
const path = require('path');
const bodyParser = require('body-parser')
var app = express();
process.dataRoomSave = [];
const PORT = process.env.PORT || 8000;
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const roomCoreRouter = require('./routes/roomCore.router');
const userCoreRouter = require('./routes/userCore.router');
const nodemailer = require('nodemailer');
const bdConnexion = require('./database/connection.database');
let cookieParser = require('cookie-parser');
const { timeout } = require('nodemon/lib/config');


bdConnexion();

//------------------GPS-------------

//----------------------App---------------
//Formidable bug 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/client'));
app.use(cookieParser());
//app.use(express.static(__dirname + '/node_modules'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use('/',userCoreRouter);
app.use('/room', roomCoreRouter)

//--------------Socket-----------

let connections = [];
var dataRoomSave = process.dataRoomSave;
var timeOut = [];

io.on("connect",(socket)=>{
    //Date from the connecting room
    //Save the connections into the array
    connections.push(socket);
    //Replace socket.id by the client id
    console.log(`${socket.id} has connected`);
    //We don't care the channel that the user is disconnected from
    socket.on("join",(data)=>{

        socket.join(data.roomName);
        console.log(`Le client ${data.userID} a rejoins la salle ${data.roomName} `);
        //Il faut arriver à chopper user.id pour remplacer socket.id;
        var time = 0;
        timeOut.forEach(timeout=>{
            if(timeout.idUser == data.userID){
                time = timeout.timer;
            }
        });
        socket.emit("userID",{userID:data.userID, roomName: data.roomName, timer : time});
        //io.sockets.in(roomName).emit("userID",{userID:socket.id, roomName: roomName});
    });
 
    socket.on("disconnect", (reason) => {
        console.log(`${socket.id} is disconnected`);
        connections = connections.filter((con) => con.id !== socket.id);
    });
    socket.on("position", function(data){
        console.log(JSON.stringify(dataRoomSave));
        //Sauvegarder data 
        dataRoomSave.forEach(room=>{
            if(room.roomName == data.roomName){
                //When the room is find
                //We add a timer to the user
                let time = 30000;
                timeOut.push({idUser : data.userId, timer:time});
                room.addPixel(data);
                socket.emit("timeout",time);
                io.sockets.in(data.roomName).emit("updateCanvas",data);
                console.log(room);
            }
        });
        
        //Position user id color
        //dataSave.push(data);
    });
    socket.on('updateTimer',(data)=>{
        timeOut.forEach(timeout=>{
            if(data.idUser == timeout.idUser){
                timeout.timer = data.time;
            }
        });
    });

    socket.on("clientLoaded", (roomName)=>{
        if(dataRoomSave.length == 0){
            dataRoomSave.push(new room(roomName));
        }else{
            let isExisting = false;
            dataRoomSave.forEach(room =>{
                if(room.roomName == roomName){
                    //If room is existing
                    //We send the data of the room
                    isExisting = true;
                    io.sockets.in(roomName).emit("newClient",room.dataSave);
                }
            });
            if(!isExisting){
                //If the room doesn't exist we create one
                dataRoomSave.push(new room(roomName));
            }
        }
    });
    socket.on("propogate", (data) => {
        connections.map((con) => {
            if (con.id !== socket.id) {
                 con.emit("onpropogate", data);
             }
        });
    });
    socket.on("updateChat",(data)=>{
        socket.broadcast.emit("updateChat",data);
    });
});


class room{
    roomName;
    dataSave = [];
    constructor(roomName){
        this.roomName = roomName;
    }
    addPixel(data){
        this.dataSave.push(data);
    }
}

server.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});
