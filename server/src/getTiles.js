import { columns, rows } from "./constants.js";
// import { getLives, getScore, setLives, setScore, setGameFail } from "./generateMidi.js";
import { tcp } from "../index.js";
const players = 1;
export const playerCols = {
    1: 2,
    2: 4,
    3: 6
}
export const allTiles = [];
export let prev = [];
for (let i = 0; i < (rows) * columns; i++) {
    allTiles.push('#000000');
}
export const midCol=parseInt(columns/2);
var startTime = 0;
let gameOn = false;
export const getGameOn=()=>{
    return gameOn;
}
let tileChecked = false;
export const setTileChecked=(val)=>{tileChecked=val;}
export const getTileChecked=()=>{return tileChecked;}
let it=0;
export const generateRow = (io, tileLength) => {
    it++;
    if(it==rows){
        gameOn=true
        io.emit("START_SONG");
    }
    startTime = new Date().getTime();
    tileChecked = false;
    // console.log(tileLength);
    for (let i = 0; i < columns; i++) {
        prev[i] = allTiles[(rows - 1) * columns + i];
    }
    for (let i = (rows - 1) * columns; i >= columns; i -= columns) {
        for (let j = 0; j < columns; j++)
            if(allTiles[i+j-columns].split(' ')[0]=='#000000')allTiles[i + j] = '#000000';
            else allTiles[i + j] = allTiles[i + j - columns];
    }
    if (tileLength == 0) {
        let sendTiles = [];
        for (let i = 0; i < columns; i++) {
            if (parseInt(allTiles[i + columns].split(' ')[1]) > 0) {
                allTiles[i] = '#ffffff ' + (parseInt(allTiles[i].split(' ')[1]) - 1);
            }
            else {
                allTiles[i] = '#000000';
            }
        }
        for (let i = 0; i < (rows - 2) * columns; i++) {
            sendTiles.push(allTiles[i]);
        }
        for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
            if (j%columns>=midCol-players && j%columns<=midCol+players-1) {
                if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
                else if (allTiles[i].split(' ')[0] == '#00ff0a') sendTiles.push('#00ffaa')
                else sendTiles.push('#000033');
            }
            else sendTiles.push(allTiles[i]);
            j++
        }
        // for (let i = (rows - 1) * columns; i < (rows) * columns; i++) {
        //     sendTiles.push(allTiles[i]);
        // }
        tcp.sendControlData(sendTiles, rows, columns)
        io.emit('PIANO_TILES', sendTiles);
        return;
    }
    for (let i = 0; i < columns; i++) {
        if (parseInt(allTiles[i + columns].split(' ')[1]) > 0) {
            allTiles[i] = '#ffffff ' + (parseInt(allTiles[i].split(' ')[1]) - 1);
        }
        else allTiles[i] = '#000000';
    }
    let pos = Math.trunc(Math.random() * playerCols[players])+midCol-players;
    while (allTiles[pos].split(' ')[0] == '#ffffff' && allTiles[pos + columns].split(' ')[0] == '#ffffff') {
        pos = Math.trunc(Math.random() * playerCols[players])+midCol-players;
    }

    allTiles[pos] = `#ffffff ${(parseInt(tileLength) - 1)}`;

    let sendTiles = [];

    for (let i = 0; i < (rows - 2) * columns; i++) {
        sendTiles.push(allTiles[i]);
    }
    for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
        if (j%columns>=midCol-players && j%columns<=midCol+players-1) {
            if (allTiles[i].split(' ')[0] == '#ffffff') {
                // console.log("yaaassss")
                sendTiles.push('#aaaaff');
            }
            else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
            else sendTiles.push('#000033');
        }
        else sendTiles.push(allTiles[i]);
        j++
    }
    tcp.sendControlData(sendTiles, rows, columns)
    io.emit("PIANO_TILES", sendTiles);
    return allTiles;
}
