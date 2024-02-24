import { columns, rows } from "./constants.js";
// import { getLives, getScore, setLives, setScore, setGameFail } from "../generateMidi.js";
import { tcp } from "../index.js";
// import { initNotes } from "./shared.js";
const players = 1;
export const playerCols = {
    1: 2,
    2: 4,
    3: 6
}
export const allTiles = [];
export let prev = [];
for (let i = 0; i < (rows) * columns; i++) {
    if (i % columns == 0 || i % columns == columns - 1 || (i % columns > 2 && i % columns < columns - 3)) allTiles[i] = '#ffff00'
    else allTiles.push('#000000');
}
export const backToPrev = () => {
    for (let i = 0; i < rows * columns; i++) {
        if (i % columns == 0 || i % columns == columns - 1 || (i % columns > 2 && i % columns < columns - 3)) allTiles[i] = '#ffff00'
        else allTiles.push('#000000');
    }
}
// console.log(allTiles)
export const midCol = parseInt(columns / 2);
var startTime = 0;
let compGameOn = false;
export const getCompGameOn = () => {
    return compGameOn;
}
export const setCompGameOn = (gameState) => {
    compGameOn = gameState;
}

let scores=[0,0];
let lives=[5,5];
export const getScores=()=>{
    return scores;
}
export const getLives=()=>{
    return lives;
}
export const setScores=(s)=>{
    scores=s;
}
export const setLives=(l)=>{
    lives=l;
}
let tileChecked = false;
export const setTileChecked = (val) => { tileChecked = val; }
export const getTileChecked = () => { return tileChecked; }
let it = 0;
export const generateRowComp = (io, tileLength) => {
    // console.log("alltiles: ", allTiles)
    // console.log(it);
    io.emit("SCORE_UPDATE_COMP", getScores())
    io.emit("LIVES_UPDATE_COMP", getLives())
    it++;
    if (it == rows - 1) {
        io.emit("START_SONG");
    }
    startTime = new Date().getTime();
    tileChecked = false;
    backToPrev();
    for (let i = 0; i <= columns - 1; i++) {
        if (allTiles[(rows - 1) * columns + i].split(' ')[0] == '#ffffff') {
            allTiles[(rows - 1) * columns + i] = "#000000 checked"
            setTileChecked(true);
            io.emit("TILE_MISSED");
            const sendTiles=[];
            const lives = getLives();
            const scores = getScores();
            if (i % columns < midCol) {
                setLives([lives[0] - 1, lives[1]]);
                io.emit("LIVES_UPDATE_COMP", getLives())
                setScores([scores[0] - 20, scores[1]]);
                io.emit("ADDED_SCORE_LEFT", -20)
                for (let j = 0; j < (rows - 2) * columns; j++) {
                    if (j % columns == 0
                        // || (i % columns > 2 && i % columns < columns - 3)
                    ) {
                        allTiles[j] = '#ff0000'
                    } sendTiles.push(allTiles[j]);
                }
                for (let j = (rows - 2) * columns; j < (rows) * columns; j++) {
                    if (j % columns == 0
                        // || (i % columns > 2 && i % columns < columns - 3)
                    ) {
                        allTiles[j] = '#ff0000';
                        sendTiles.push(allTiles[j]);
                    }
                    else if ((j % columns > 2 && j % columns < columns - 3) || j % columns == columns - 1) {
                        // allTiles[j] = '#ffff00';
                        sendTiles.push(allTiles[j]);
                    }
                    else {
                        if (allTiles[j].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
                        else if (allTiles[j] == '#00ff0a') sendTiles.push('#00ffaa')
                        else sendTiles.push('#000033');
                    }
                    // j++
                }
                // console.log(sendTiles.length);
            } else {
                setLives([lives[0], lives[1] - 1]);
                io.emit("LIVES_UPDATE_COMP", getLives())
                setScores([scores[0], scores[1] - 20]);
                io.emit("ADDED_SCORE_RIGHT", -20)
                for (let j = 0; j < (rows - 2) * columns; j++) {
                    if (j % columns == columns - 1
                        // || (i % columns > 2 && i % columns < columns - 3)
                    ) {
                        allTiles[j] = '#ff0000'
                    } sendTiles.push(allTiles[j]);
                }
                for (let j = (rows - 2) * columns; j < (rows) * columns; j++) {
                    if (j % columns == columns-1
                        // || (i % columns > 2 && i % columns < columns - 3)
                    ) {
                        allTiles[j] = '#ff0000';
                        sendTiles.push(allTiles[j]);
                    }
                    else if((j % columns > 2 && j % columns < columns - 3) || j%columns==0){
                        // allTiles[j] = '#ffff00';
                        sendTiles.push(allTiles[j]);
                    }
                    else {
                        if (allTiles[j].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
                        else if (allTiles[j] == '#00ff0a') sendTiles.push('#00ffaa')
                        else sendTiles.push('#000033');
                    }
                    // j++
                }
            }
            io.emit("SCORE_UPDATE_COMP", getScores());
            

            // for (let i = 0; i < (rows - 2) * columns; i++) {
            //     if (i % columns == 0 || i % columns == columns - 1 || (i % columns >2 && i % columns < columns - 3)) {
            //         allTiles[i] = '#ff0000'
            //         sendTiles.push(allTiles[i]);
            //     }
            //     else sendTiles.push(allTiles[i]);
            // }
            // for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
            //     if (i % columns == 0 || i % columns == columns - 1 || (i % columns > 2 && i % columns < columns - 3)) {
            //         allTiles[i] = '#ff0000';
            //         sendTiles.push(allTiles[i]);
            //     }
            //     else {
            //         if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
            //         else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
            //         else sendTiles.push('#000033');
            //     }
            //     // else sendTiles.push(allTiles[i]);
            //     j++
            // }
            sendTiles[(rows - 1) * columns + i] = '#ff0000'
            // console.log(sendTiles.length);
            tcp.sendControlData(sendTiles, rows, columns)
            io.emit("PIANO_TILES", sendTiles);
            // break;
        }
        prev[i] = allTiles[(rows - 1) * columns + i];
    }
    for (let i = (rows - 1) * columns; i >= columns; i -= columns) {
        for (let j = 0; j < columns; j++)
            // if (allTiles[i + j - columns].split(' ')[0] == '#000000') allTiles[i + j] = '#000000';
            allTiles[i + j] = allTiles[i + j - columns];
    }
    if (tileLength == 0) {
        let sendTiles = [];
        for (let i = 0; i < columns; i++) {
            if (parseInt(allTiles[i + columns].split(' ')[1]) > 0) {
                allTiles[i] = '#ffffff ' + (parseInt(allTiles[i].split(' ')[1]) - 1);
            }
            else if (i % columns == 0 || i % columns == columns - 1 || (i % columns > 2 && i % columns < columns - 3)) {
                allTiles[i] = allTiles[i + columns];
            }
            else allTiles[i] = '#000000';
        }
        for (let i = 0; i < (rows - 2) * columns; i++) {
            sendTiles.push(allTiles[i]);
        }
        for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
            if ((i % columns > 2 && i % columns < columns - 3) || i % columns == 0 || i % columns == columns - 1) sendTiles.push(allTiles[i]);
            else {
                if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
                else if (allTiles[i].split(' ')[0] == '#00ff0a') sendTiles.push('#00ffaa')
                else sendTiles.push('#000033');
            }
            // else sendTiles.push(allTiles[i]);
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
        else if (i % columns == 0 || i % columns == columns - 1 || (i % columns > 2 && i % columns < columns - 3)) {
            allTiles[i] = allTiles[i + columns];
        }
        else allTiles[i] = '#000000';
    }
    let pos1 = Math.trunc(Math.random() * 2)+1;
    while (allTiles[pos1].split(' ')[0] == '#ffffff' && allTiles[pos1 + columns].split(' ')[0] == '#ffffff') {
        pos1 = Math.trunc(Math.random() * 2)+1;
    }

    let pos2 = pos1 + columns - 4;
    // console.log(pos1, pos2)
    allTiles[pos1] = `#ffffff ${(parseInt(tileLength) - 1)}`;

    allTiles[pos2] = `#ffffff ${(parseInt(tileLength) - 1)}`;

    let sendTiles = [];

    for (let i = 0; i < (rows - 2) * columns; i++) {
        sendTiles.push(allTiles[i]);
    }
    for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
        if ((i % columns > 2 && i % columns < columns - 3) || i % columns == 0 || i % columns == columns - 1) sendTiles.push(allTiles[i])
        else {
            if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
            else if (allTiles[i].split(' ')[0] == '#00ff0a') sendTiles.push('#00ffaa')
            else sendTiles.push('#000033');
        }
        // else sendTiles.push(allTiles[i]);
        j++
    }
    tcp.sendControlData(sendTiles, rows, columns)
    io.emit("PIANO_TILES", sendTiles);
    return allTiles;
}


export const compInitNotes = [];
for (let i = 0; i < (rows - 2) * columns; i++) {
    if (i % columns == 0 || i % columns == columns - 1 || (i % columns > 2 && i % columns < columns - 3)) {
        compInitNotes.push('#ffff00');
    }
    else compInitNotes.push('#000000');
}
for (let i = (rows - 2) * columns; i < rows * columns; i++) {
    if (i % columns == 0 || i % columns == columns - 1 || (i % columns > 2 && i % columns < columns - 3)) {
        compInitNotes.push('#ffff00');
    }
    else compInitNotes.push('#000033');
}
compInitNotes[(rows - 2) * columns + 2] = '#00ff00'
compInitNotes[(rows - 2) * columns + columns - 2] = '#00ff00'