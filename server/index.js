// imports
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import { EVENT_TYPES, columns, rows } from './src/constants.js';
import bodyParser from 'body-parser';
import { printNotes, stopSongClassic, stopSongComp, setResultAndInterval } from './generateMidi.js';
import { getGameOn, setGameOn } from './src/getTiles.js';
import { handleTileClick } from './src/tileClickHandler.js';
import { hardwareSendTiles, initNotes } from './src/shared.js';
import { compInitNotes } from './src/competition.js'
// import { handleTileClick, hardwareSendTiles, initNotes } from './generateRandomTile.js';
import TCPHandler from './src/tcpHandler.js';
import { handleDemoTileClick, printDemoNotes, stopTiles } from './demoMode.js';
import { handleTileClickComp } from './src/tileClickHandlerComp.js';
import { intervals } from './intervalMapping.js';
import { songSelect } from './songMapping.js';
// import { writeData } from './serial_port/writeData.js';
// import port from './serial_port/index.js';

// inits
// console.log("here")
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


export const tcp = new TCPHandler(rows, columns, (data) => {
    // console.log(data.readings)
})

const colors = ['#ff0000', '#00FF00', '#0000FF'];
let mode = "demo";
export const getMode = () => { return mode; }
let song="Jamal Kudu"
export const getSong=()=>{return song;}
var iterator = 0;
const interval = setInterval(() => {
    const frame = new Array(rows * columns).fill(colors[iterator]);
    io.emit('PIANO_TILES', frame)
    tcp.sendControlData(frame, rows, columns);

    if (iterator === 2) {
        iterator = 0;
    } else {
        iterator++;
    }
}, 1000);
setTimeout(() => {
    clearInterval(interval);
    io.emit("PIANO_TILES", mode == "competition" ? compInitNotes : initNotes)
    // console.log(compInitNotes)
    tcp.sendControlData(
        mode == "competition" ? compInitNotes : initNotes, rows, columns
    )
}, 6000);
var storageArray = [];
var prevArray = [];
setInterval(() => {
    prevArray = storageArray;
    storageArray = [];
}, 300);
const gameOn = false;
tcp.readControlData((data) => {
    // if(!getGameOn())return;
    const serialPattern = convertToSerial(data.readings, rows, columns);
    storageArray.push(serialPattern);
    for (let i = 0; i < serialPattern.length; i++) {
        const item = serialPattern[i];
        if (item === 10) {
            var isTap = false;
            if (storageArray.length > 4) {
                for (let j = storageArray.length - 1; j >= storageArray.length - 4; j--) {
                    if (!storageArray || storageArray[j][i] != 10) {
                        // if (compInitNotes[i] == '00ff00') {
                        //     setGameOn(true);
                        //     return;
                        // } else if (!getGameOn()) return;
                        if (mode == "competition") {
                            handleTileClickComp(io, i, "tap");
                        } else if (mode == "classic") {
                            handleTileClick(io, i, "tap");
                        }
                        else {
                            handleDemoTileClick(io, i, "tap");
                        }
                        isTap = true;
                        break;
                    }
                }
            }
            else {
                for (let j = storageArray.length - 1; j >= 0; j--) {
                    if (!storageArray || storageArray[j][i] != 10) {
                        // if (compInitNotes[i] == '00ff00') {
                        //     setGameOn(true);
                        //     return;
                        // } else if (!getGameOn()) return;
                        if (mode == "competition") {
                            handleTileClickComp(io, i, "tap");
                        } else if (mode == "classic") {
                            handleTileClick(io, i, "tap");
                        }
                        else {
                            handleDemoTileClick(io, i, "tap");
                        }
                        isTap = true;
                        break;
                    }
                }
                if (!isTap) {
                    for (let j = prevArray.length - 1, k = 0; k < 4 - storageArray.length && j >= 0; k++, j--) {
                        if (!prevArray || prevArray[j][i] != 10) {
                            // if (compInitNotes[i] == '00ff00') {
                            //     setGameOn(true);
                            //     return;
                            // } else if (!getGameOn()) return;
                            if (mode == "competition") {
                                handleTileClickComp(io, i, "tap");
                            } else if (mode == "classic") {
                                handleTileClick(io, i, "tap");
                            }
                            else {
                                handleDemoTileClick(io, i, "tap");
                            }
                            isTap = true;
                            break;
                        }
                    }
                }
            }
            if (!isTap) {
                // if (!getGameOn()) return;
                if (mode == "competition") {
                    handleTileClickComp(io, i, "hold");
                } else if (mode == "classic") {
                    handleTileClick(io, i, "hold");
                }
                else {
                    handleDemoTileClick(io, i, "hold");
                }
            }
        }
    }
})
const clients = new Set();

io.on(EVENT_TYPES.CONNECTION, (socket) => {
    console.log("Connection Established", socket.id);
    clients.add(socket);
    //gameStart
    socket.on("GAME_START", () => printDemoNotes(io));

    //disconnect
    socket.on(EVENT_TYPES.DISCONNECT, () => {
        console.log('User is disconnected!');
        clients.delete(socket);
    });
    socket.on("TILE_CLICKED", (index) => {
        // if (!getGameOn()) {
        //     if (compInitNotes[index] == '#00ff00') {
        //         if(mode=="demo")printDemoNotes(io);
        //         else printNotes(io);
        //         setGameOn(true);
        //     }
        //     return;
        // }
        if (mode == "competition") {
            handleTileClickComp(io, index, "tap");
        } else if (mode == "classic") {
            handleTileClick(io, index, "tap");
        }
        else {
            handleDemoTileClick(io, index, "tap");
        }
    })
    socket.on("MODE_CHANGE", (newMode) => {
        console.log(newMode)
        if (newMode == "Competition") {
            mode = "competition";
            io.emit("PIANO_TILES", compInitNotes)
            tcp.sendControlData(compInitNotes, rows, columns)
            // io.emit("SCOREBOARD_MODE_CHANGE", mode);
        } else if (newMode == "Classic") {
            mode = "classic";
            io.emit("PIANO_TILES", initNotes)
            tcp.sendControlData(initNotes, rows, columns)
            // io.emit("SCOREBOARD_MODE_CHANGE", mode);
        } else {
            mode = "demo";
            io.emit("PIANO_TILES", initNotes)
            tcp.sendControlData(initNotes, rows, columns)
        }
        io.emit("SCOREBOARD_MODE_CHANGE", mode);
    })
    socket.on("AUDIO_ENDED", () => {

        if (mode == 'classic'){
            stopSongClassic(io)
        }
        else if (mode == 'competition') {
            stopSongComp(io)
        }else{
            stopTiles(io);
        }
    }
    );
    socket.on("SELECT_SONG", (selectedSong)=>{
        // setSong(selectedSong)
        console.log(selectedSong);
        io.emit("SCOREBOARD_SONG_CHANGE", selectedSong);
        song=selectedSong;
        setResultAndInterval({res:songSelect[selectedSong], int:intervals[selectedSong]});
    })
});

export const convertToSerial = (snakedArr, rows, columns) => {
    const serialArr = [];
    for (let i = 0; i < rows; i++) {
        if (i % 2 === 0) {
            // For even rows, push elements in normal order
            for (let j = 0; j < columns; j++) {
                serialArr.push(snakedArr[i * columns + j]);
            }
        } else {
            // For odd rows, push elements in reverse order
            for (let j = columns - 1; j >= 0; j--) {
                serialArr.push(snakedArr[i * columns + j]);
            }
        }
    }
    return serialArr;
}

// listen
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

