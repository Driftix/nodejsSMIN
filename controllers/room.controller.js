const res = require("express/lib/response");
var QRCode = require('qrcode');

function loadPage(req,res){
    //console.log(req.body);
    var rooms = process.dataRoomSave;
    console.log(req.cookies);
    //Il faut absolument le parse car sinon c'est la mierda
    res.render('createRoom', {rooms : rooms, user: req.cookies});
}

function createRoom(req,res){
    //envoyer la nouvelle page avec le nouveau titre
    console.log(req.cookies);
    //res.render('game',{title : req.body.roomName, qr: url})
    console.log(req.params.id);
    QRCode.toDataURL("http://localhost:8000/room/"+req.params.id, function (err, url) {
      //console.log(url)
      res.render("game",{title: req.body.roomName, qr : url, user:req.cookies});
    })
}
function joinRoom(req,res){
    QRCode.toDataURL("http://localhost:8000/room/"+req.params.id, function (err, url) {
      //console.log(url)
      res.render("game",{title: req.body.roomName, qr : url, user:req.cookies});
    })
}

// function testRead(req,res){
//   console.log(req.params.user)
//   res.send(req.params.user);

// }

module.exports = {loadPage, createRoom,joinRoom}

