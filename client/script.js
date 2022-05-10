var socket = io.connect('http://localhost:8000');

function load(x,idUser){
  console.log("Joining Room...");
  socket.emit("join",{roomName: x,userID: idUser });
  console.log("Room " + x + " joined" );
}

socket.on("userID",(data)=>{
  let userId = data.userID;
  let roomName = data.roomName;
  console.log("Constructor triggered");
  let userCanPlay = true;
  var height = 20;
  var width = 20;
  var table = document.getElementById("pixel_canvas");
  //------------------------------
  if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
      }
      function showPosition(position) {
        console.log("latitude: " + position.coords.latitude +" / longitude" + position.coords.longitude);
        document.getElementById("coordinates").innerText = "Latitude: " + position.coords.latitude +" \n Longitude: " + position.coords.longitude;
      }
      //Faire plus tardS
      function showError(error) {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
          case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
          case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
          case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
        }
      } 


  //-----------------------------------
  if(data.timer > 0){
    timeOut(data.timer);
  }
//We need to do it on the server side
  function timeOut(time){
    console.log(time);
    const currentTimeAsMs = Date.now();
    const adjustedTimeAsMs = currentTimeAsMs + time;
    const adjustedDateObj = new Date(adjustedTimeAsMs);
    CountDownTimer(adjustedDateObj);
  
      function CountDownTimer(dt)
      {
          var end = dt;
          userCanPlay = false;
          console.log(adjustedDateObj);
          var _second = 1000;
          var _minute = _second * 60;
          var _hour = _minute * 60;
          //var _day = _hour * 24;
          var timer;
  
          function showRemaining() {
              var now = new Date();
              var distance = end - now;
              if (distance < 0) {
                  clearInterval(timer);
                  console.log("fin timer");
                  userCanPlay = true;
                  document.getElementById("timer").innerHTML = "Cooldown ended";
                  return;
              }
  
              var minutes = Math.floor((distance % _hour) / _minute);
              var seconds = Math.floor((distance % _minute) / _second);
              //Faire ici l'affichage du timer restant  
              document.getElementById("timer").innerHTML = "Timeout of " + seconds + " seconds";
              socket.emit("updateTimer", {idUser: userId, time:seconds*1000});
              //Envoie au server avec id + timerrestant 
  
       }
  
          timer = setInterval(showRemaining, 1000);
      }
  }

  socket.on("timeout", (time)=>{
      timeOut(time);
  });


  //------------------------------
  for(i = 0; i < height; i++){
    var row = document.createElement('tr');
      for(j = 0; j < width; j++){
        var cell = document.createElement('td');
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
    //Permet de zoomer
    let scale = 1;
    table.addEventListener('wheel', function(e) {
      //e - when zomm in e + when zoom out
      //console.log(e.clientX);
      e.preventDefault();
      window.moveTo(e.clientY,e.clientX);
      //window.move
      scale += e.deltaY * -0.0025;
      // Restrict scale
    scale = Math.min(Math.max(0.75, scale), 4);
    // Apply scale transform
    console.log("x:" + e.clientX);
    console.log("y:" + e.clientY);
    console.log("scale: " + scale);
    //table.style.transform = "translateX(" + (e.clientX/(scale)-e.clientY) + "px)scale("+scale+") translateY(" + (e.clientY/(scale)-e.clientX) + "px)";
    table.style.transform = `scale(${scale})`;
    table.focus();
    }, false);
    //document.body.appendChild(table);
    
    var cellsIndexs = document.querySelectorAll('td');
      for (let i = 0; i < cellsIndexs.length; i++) {
        //Some bugs here
        cellsIndexs[i].addEventListener("wheel",(e)=>{
          cellsIndexs[i].scrollIntoView(true);
        });
        //No bug, working perfectly ! 
        cellsIndexs[i].addEventListener('click', function (e) {
          if(userCanPlay){
            var color = document.getElementById('colorPicker').value;
            cellsIndexs[i].style.backgroundColor = color;
            console.log(color);
            document.getElementById("timer").innerHTML = "Timeout of 30 seconds";
            socket.emit("position" ,{position : i, userId : userId, color:color, roomName: roomName});  
          }
        });
    }
    socket.on("updateCanvas", function(data){
        var cellsIndexs = document.querySelectorAll('td');
        for (let i = 0; i < cellsIndexs.length; i++) {
          //console.log(cellsIndexs[i] + " / " + data.position);
          if(i == data.position && data.userId != userId ){
            cellsIndexs[i].style.backgroundColor = data.color;
          }
        }
      });
      //On dit au serveur que le client a bien finis de tout loader afin qu'on puisse afficher toutes les datas enregistrées
      socket.emit("clientLoaded", roomName);

      //socket.to(roomName).emit('clientLoaded');
      });
      socket.on("newClient", function(data){
        console.log("vous êtes un nouveau joueur");
        var cellsIndexs = document.querySelectorAll('td');
        console.log(cellsIndexs.length);
        for (let i = 0; i < cellsIndexs.length; i++) {
          for(let j = 0; j < data.length; j++){
            if(i == data[j].position ){
              cellsIndexs[i].style.backgroundColor = data[j].color;
            }
          }
        }
});




// socket.on("userID", function(data){
//   let userId = data.userId;
//   let userCanPlay = true;
//   var height = 10;
//   var width = 10;
//   var table = document.getElementById("pixel_canvas");

//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition, showError);
//   }
//   function showPosition(position) {
//     console.log("latitude: " + position.coords.latitude +" / longitude" + position.coords.longitude);
//   }
//   //Faire plus tardS
//   function showError(error) {
//     switch(error.code) {
//       case error.PERMISSION_DENIED:
//         x.innerHTML = "User denied the request for Geolocation."
//         break;
//       case error.POSITION_UNAVAILABLE:
//         x.innerHTML = "Location information is unavailable."
//         break;
//       case error.TIMEOUT:
//         x.innerHTML = "The request to get user location timed out."
//         break;
//       case error.UNKNOWN_ERROR:
//         x.innerHTML = "An unknown error occurred."
//         break;
//     }
//   } 

//   for(i = 0; i < height; i++){
//     var row = document.createElement('tr');
//     for(j = 0; j < width; j++){
//       var cell = document.createElement('td');
//       row.appendChild(cell);
//     }
//     table.appendChild(row);
//   }
//   //Permet de zoomer
//   let scale = 1;
//   table.addEventListener('wheel', function(e) {
//     //e - when zomm in e + when zoom out
//     //console.log(e.clientX);
//     e.preventDefault();
//     window.moveTo(e.clientY,e.clientX);
//     //window.move
//     scale += e.deltaY * -0.0025;
//     // Restrict scale
//    scale = Math.min(Math.max(0.75, scale), 4);
//    // Apply scale transform
//    console.log("x:" + e.clientX);
//    console.log("y:" + e.clientY);
//    console.log("scale: " + scale);
//    //table.style.transform = "translateX(" + (e.clientX/(scale)-e.clientY) + "px)scale("+scale+") translateY(" + (e.clientY/(scale)-e.clientX) + "px)";
//    table.style.transform = `scale(${scale})`;
//    table.focus();
//   }, false);
//   document.body.appendChild(table);

// var cellsIndexs = document.querySelectorAll('td');
//   for (let i = 0; i < cellsIndexs.length; i++) {
//     //Some bugs here
//     cellsIndexs[i].addEventListener("wheel",(e)=>{
//       cellsIndexs[i].scrollIntoView(true);
//     });
//     //No bug, working perfectly ! 
//     cellsIndexs[i].addEventListener('click', function (e) {
//       if(userCanPlay){
//         var color = document.getElementById('colorPicker').value;
//         cellsIndexs[i].style.backgroundColor = color;
//         console.log(color);
//         socket.to(x).emit("position" ,{position : i, userId : userId, color:color});  
//       }
//     });
// }
// //Le timer sera ajusté lorsque l'on aura la bdd

// //Permet d'update en temps réel le canvas
// socket.on("updateCanvas", function(data){
//   var cellsIndexs = document.querySelectorAll('td');
//   for (let i = 0; i < cellsIndexs.length; i++) {
//     //console.log(cellsIndexs[i] + " / " + data.position);
//     if(i == data.position && data.userId != userId ){
//       cellsIndexs[i].style.backgroundColor = data.color;
//     }
//   }
// });
// //On dit au serveur que le client a bien finis de tout loader afin qu'on puisse afficher toutes les datas enregistrées
// socket.to(x).emit('clientLoaded');
// });
// socket.on("newClient", function(data){
//   console.log(data);
//   var cellsIndexs = document.querySelectorAll('td');
//   console.log(cellsIndexs.length);
//   for (let i = 0; i < cellsIndexs.length; i++) {
//     for(let j = 0; j < data.length; j++){
//       if(i == data[j].position ){
//         cellsIndexs[i].style.backgroundColor = data[j].color;
//       }
//     }
//   }
  
// });
 


