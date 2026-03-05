const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let rooms = {};

function roomCode(){
 return Math.random().toString(36).substring(2,6).toUpperCase();
}

io.on("connection", socket => {

 socket.on("createRoom", name => {

   const code = roomCode();

   rooms[code] = {
     players:[{
       id:socket.id,
       name:name,
       x:150,
       y:300,
       score:0
     }]
   };

   socket.join(code);

   socket.emit("roomCreated",code);

 });

 socket.on("joinRoom", ({room,name}) => {

   if(!rooms[room] || rooms[room].players.length>=2){
     socket.emit("joinError");
     return;
   }

   rooms[room].players.push({
     id:socket.id,
     name:name,
     x:600,
     y:300,
     score:0
   });

   socket.join(room);

   io.to(room).emit("updatePlayers",rooms[room].players);

 });

 socket.on("move",({room,x,y})=>{

   const player=rooms[room].players.find(p=>p.id===socket.id);

   if(player){
     player.x=x;
     player.y=y;
   }

   io.to(room).emit("state",rooms[room].players);

 });

 socket.on("stomp",room=>{

   const players=rooms[room].players;

   players.forEach(p=>p.score+=5);

   io.to(room).emit("quake",players);

 });

});

server.listen(3000,()=>console.log("Server running on port 3000"));