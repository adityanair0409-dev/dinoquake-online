const socket=io();

const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");

const params=new URLSearchParams(window.location.search);

const room=params.get("room");

document.getElementById("roomCode").innerText="Room: "+room;

let player={x:100,y:300};

let players=[];

document.addEventListener("keydown",e=>{

if(e.key==="a") player.x-=8;
if(e.key==="d") player.x+=8;
if(e.key==="w") player.y-=8;
if(e.key==="s") player.y+=8;

socket.emit("move",{room,x:player.x,y:player.y});

});

function stomp(){

socket.emit("stomp",room);

}

socket.on("state",state=>{

players=state;

});

socket.on("quake",state=>{

players=state;

});

function drawPlayers(){

players.forEach((p,i)=>{

ctx.fillStyle=i===0?"green":"orange";

ctx.fillRect(p.x,p.y,50,50);

ctx.fillStyle="black";

ctx.font="14px Arial";
ctx.fillText(p.name+" "+p.score,p.x,p.y-10);

});

}

function gameLoop(){

ctx.clearRect(0,0,900,500);

drawPlayers();

requestAnimationFrame(gameLoop);

}

gameLoop();