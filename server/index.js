// imports
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import { EVENT_TYPES } from './constants.js';
import bodyParser from 'body-parser';
import { printNotes } from './generateMidi.js';
import { handleTileClick } from './getTiles.js';
// inits
console.log("here")
dotenv.config();

// vars
const PORT = process.env.PORT || 5000;
const CLIENT_APP_BASE_URL = process.env.CLIENT_APP_BASE_URL;
const LEADER_BOARD_APP_BASE_URL = process.env.LEADER_BOARD_APP_BASE_URL;
const SCORE_BOARD_APP_BASE_URL = process.env.SCORE_BOARD_APP_BASE_URL
// configs
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors({ origin: [CLIENT_APP_BASE_URL, LEADER_BOARD_APP_BASE_URL, SCORE_BOARD_APP_BASE_URL] }));
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [CLIENT_APP_BASE_URL, LEADER_BOARD_APP_BASE_URL, SCORE_BOARD_APP_BASE_URL]
    }
});

// socket
let gameOn=false;
const clients=new Set();
io.on(EVENT_TYPES.CONNECTION, (socket)=>{
    console.log("Connection Established", socket.id);
    io.emit("PIANO_TILES", [
        '#ffffff30','#ffffff30','#ffffff30','#ffffff30',
        '#ffffff30','#ffffff30','#ffffff30','#ffffff30',
        '#ffffff30','#ffffff30','#ffffff30','#ffffff30',
        '#ffffff30','#ffffff30','#ffffff30','#ffffff30',
        '#0000FF','#0000FF','#0000FF','#0000FF'
    ]);
    clients.add(socket);

    //gameStart
    socket.on("GAME_START", ()=> printNotes( io));
    
    //disconnect
    socket.on(EVENT_TYPES.DISCONNECT, () =>{
        console.log('User is disconnected!');
        clients.delete(socket);
    });
    socket.on("TILE_CLICKED", (index) => {
        if(!gameOn){
            gameOn=true;
            io.emit("START_SONG");
        }
        handleTileClick(io, index)
    })
});

// listen
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

