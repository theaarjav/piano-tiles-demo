import { columns, rows } from "./constants.js";
import { getLives, getScore, setLives, setScore, setGameFail } from "../generateMidi.js";
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
export const backToPrev=()=>{
    for(let i=0;i<rows*columns;i++){
        if(i%columns<midCol-players || i%columns>midCol+players-1){
            allTiles[i]='#ffff00'
        }
    }
}
export const midCol=parseInt(columns/2);
var startTime = 0;
let gameOn = false;
export const getGameOn=()=>{
    return gameOn;
}
export const setGameOn=(gameState)=>{
    gameOn=gameState;
}
let tileChecked = false;
export const setTileChecked=(val)=>{tileChecked=val;}
export const getTileChecked=()=>{return tileChecked;}
let it=0;

export const generateRow = (io, tileLength) => {
    it++;
    // console.log("here genrow");
    if(it==rows-1)io.emit("START_SONG");
    startTime = new Date().getTime();
    tileChecked = false;
    backToPrev();
    // console.log(tileLength);
    for (let i = midCol-players; i <= midCol+players-1; i++) {
        if(allTiles[(rows-1)*columns+i].split(' ')[0]=='#ffffff'){
            // console.log("missss")
            allTiles[(rows-1)*columns+i]="#000000 checked"
            setTileChecked(true);
            io.emit("TILE_MISSED");
            const lives=getLives();
            setLives(lives-1);
            io.emit("LIVES_UPDATE", getLives())
            const score=getScore();
            setScore(score-20);
            io.emit("ADDED_SCORE", -20)
            io.emit("SCORE_UPDATE", getScore());
            let sendTiles = [];
            
            for (let i = 0; i < (rows - 2) * columns; i++) {
                if(i%columns<midCol-players || i%columns>midCol+players-1){
                    allTiles[i]='#ff0000'
                    sendTiles.push('#ff0000');
                }
                else sendTiles.push(allTiles[i]);
            }
            for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
                if(i%columns<midCol-players || i%columns>midCol+players-1){
                    allTiles[i]='#ff0000';
                    sendTiles.push(allTiles[i]);
                }
                else {
                    if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
                    else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
                    else sendTiles.push('#000033');
                }
                // else sendTiles.push(allTiles[i]);
                j++
            }
            sendTiles[(rows-1)*columns+i] = '#ff0000'
            // console.log(sendTiles);
            tcp.sendControlData(sendTiles, rows, columns)
            io.emit("PIANO_TILES", sendTiles);
            // break;
        }
        prev[i] = allTiles[(rows - 1) * columns + i];
    }
    // setTimeout(() => {
    //     backToPrev();
    // }, 300);
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
            else if(i%columns<midCol-players || i%columns>midCol+players-1){
                allTiles[i]=allTiles[i+columns];
            }
            else allTiles[i] = '#000000';
        }
        for (let i = 0; i < (rows - 2) * columns; i++) {
             sendTiles.push(allTiles[i]);
        }
        for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
            // if(i%columns<midCol-players || i%columns>midCol+players-1)sendTiles.push('#ffff00')
            if(i%columns>=midCol-players && i%columns<=midCol+players-1) {
                if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
                else if (allTiles[i].split(' ')[0] == '#00ff0a') sendTiles.push('#00ffaa')
                else sendTiles.push('#000033');
            }
            else sendTiles.push(allTiles[i]);
            j++
        }
        tcp.sendControlData(sendTiles, rows, columns)
        io.emit('PIANO_TILES', sendTiles);
        return;
    }
    for (let i = 0; i < columns; i++) {
        if (parseInt(allTiles[i + columns].split(' ')[1]) > 0) {
            allTiles[i] = '#ffffff ' + (parseInt(allTiles[i].split(' ')[1]) - 1);
        }
        else if(i%columns<midCol-players || i%columns>midCol+players-1){
            allTiles[i]=allTiles[i+columns];
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
        if(i%columns>=midCol-players && i%columns<=midCol+players-1) {
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
