import { columns, rows } from "./src/constants.js";
import { getLives, getScore, setLives, setScore, setGameFail } from "./generateMidi.js";
import { tcp } from "./index.js";
const players = 1;
const allTiles = [];
for (let i = 0; i < rows * columns; i++) {
    allTiles.push('#000000');
}
const playerCols = {
    1: 2,
    2: 4,
    4: 7
}
const prev = [parseInt(((rows) / 2) * columns + ((columns+1)/2)), 0];
const next=[];
var startTime = 0;
export const generateRow = (io, tileLength) => {
    for (let i = 0; i < rows * columns; i++) {
        if(i!=prev[0])allTiles[i] = '#000000';
    }
    allTiles[prev[0]] = allTiles[prev[0]] == '#00ff0a' ? '#00ff0a' : '#ffffff';
    if (prev[1] == 0) {
        allTiles[prev[0]]='#000000'
        const arr = []
        if (prev[0] > columns) {
            // prev[0] - columns
            arr.push(prev[0] - columns);
        }

        if (prev[0] <- (rows - 1) * columns) {
            // prev[0] + columns
            arr.push(prev[0] + columns);
        }

        if (prev[0] % columns > 0) {
            // prev[0] - 1
            arr.push(prev[0] - 1);
        }

        if (prev[0] % columns < columns - 1) {
            // prev[0] + 1
            arr.push(prev[0] + 1);
        }

        if (prev[0] > columns && prev[0] % columns > 0) {
            // prev[0] - columns - 1
            arr.push(prev[0] - columns - 1);
        }

        if (prev[0] > columns && prev[0] % columns < columns - 1) {
            // prev[0] - columns + 1
            arr.push(prev[0] - columns + 1);
        }

        if (prev[0] < (rows - 1) * columns && prev[0] % columns > 0) {
            // prev[0] + columns - 1
            arr.push(prev[0] + columns - 1);
        }

        if (prev[0] < (rows - 1) * columns && prev[0] % columns < columns - 1) {
            // prev[0] + columns + 1
            arr.push(prev[0] + columns + 1);
        }

        const ind = arr[(Math.floor(Math.random() * arr.length))];
        prev[0] = ind;
        prev[1] = tileLength;
        allTiles[ind] = '#ffffff'
    }
    else {
        prev[1] = prev[1] - 1;
        // allTiles[prev[0]] = allTiles[prev[0]]=='#00ffaa'
    }
    tcp.sendControlData(allTiles, rows, columns)
    io.emit("PIANO_TILES", allTiles);
    return allTiles;
}
let gameOn = false;

export const handleTileClick = (io, index, e) => {
    if (!gameOn && allTiles[index].split(' ')[0] == '#ffffff') {
        gameOn = true;;
        io.emit("START_SONG");
    }

    const endTime = new Date().getTime()
    const elapsedTime = endTime - startTime;
    let score = getScore();
    // if (index < (rows - 1) * columns && allTiles[prev[]].split(' ')[0] == '#ffffff') {
        // if (elapsedTime < 167) {
            if(index==prev[0]){
                prev[1]==0?allTiles[index] = '#00ff0a':allTiles[index]='#00ffaa'
                setScore(score + 10);
                io.emit("SCORE_UPDATE", getScore());
                io.emit("ADDED_SCORE", 10)
                tcp.sendControlData(allTiles, rows, columns)
                io.emit("PIANO_TILES", allTiles);
            }
        // }
    // }
    // if (e == "tap") {
    // if (index < (rows - 1) * columns && allTiles[index + columns].split(' ')[0] == '#ffffff') {
    //     // if (elapsedTime < 167) {
    //     allTiles[index + columns] = '#00ff0a'
    //     setScore(score + 10);
    //     io.emit("SCORE_UPDATE", getScore());
    //     io.emit("ADDED_SCORE", 10)
    //     // tcp.sendControlData(allTiles, rows, columns)
    //     io.emit("PIANO_TILES", allTiles);
    // }

    //     else if (allTiles[index].split(' ')[0] == '#ffffff') {
    //         allTiles[index] = '#00ff0a'
    //         const sendTiles = [];
    //         for (let i = 0; i < rows * columns; i++)sendTiles.push(allTiles[i]);
    //         for (let i = (rows - 2) * columns, j = 0; i < (rows - 1) * columns; i++) {
    //             if (j < playerCols[players]) sendTiles[i] = '0000ff'
    //             else sendTiles[i] = allTiles[i];
    //         }
    //         sendTiles[index] = '#00ff0a'
    //         io.emit("SCORE_UPDATE", getScore());
    //         io.emit("ADDED_SCORE", 10)
    //         // tcp.sendControlData(sendTiles, rows, columns)
    //         // console.log(sendTiles);
    //         io.emit("PIANO_TILES", allTiles);
    //     }
    //     else if (index > columns && allTiles[index - columns].split(' ')[0] == '#ffffff') {
    //         allTiles[index] = '#00ff0a'
    //         const sendTiles = [];
    //         for (let i = 0; i < rows * columns; i++)sendTiles.push(allTiles[i]);
    //         for (let i = (rows - 2) * columns, j = 0; i < (rows - 1) * columns; i++) {
    //             if (j < playerCols[players]) sendTiles[i] = '0000ff'
    //             else sendTiles[i] = allTiles[i];
    //         }
    //         sendTiles[index] = '#00ff0a'
    //         io.emit("SCORE_UPDATE", getScore());
    //         io.emit("ADDED_SCORE", 10)
    //         // tcp.sendControlData(sendTiles, rows, columns)
    //         // console.log(sendTiles);
    //         io.emit("PIANO_TILES", allTiles);
    //     }
    //     else if (allTiles[index].split(' ')[0] != '#00ff0a') {
    //         io.emit("TILE_MISSED");
    //         io.emit("LIVES_UPDATE", getLives())
    //         io.emit("ADDED_SCORE", -20)
    //         io.emit("SCORE_UPDATE", getScore());
    //         // for (let i = 0; i < columns; i++) {
    //         let sendTiles = [];

    //         for (let i = 0; i < (rows - 2) * columns; i++) {
    //             sendTiles.push(allTiles[i]);
    //         }
    //         for (let i = (rows - 2) * columns, j = 0; i < (rows - 1) * columns; i++) {
    //             if (j < playerCols[players]) sendTiles.push('#0000ff');
    //             else sendTiles.push(allTiles[i])
    //             j++;
    //         }
    //         for (let i = (rows - 1) * columns; i < (rows) * columns; i++) {
    //             sendTiles.push(allTiles[i]);
    //         }
    //         sendTiles[index] = '#ff0000'
    //         // tcp.sendControlData(sendTiles, rows, columns)
    //         io.emit("PIANO_TILES", sendTiles);
    //     }


    // }
    // else if (e == "hold") {
    //     if (index < (rows - 1) * columns && allTiles[index].split(' ')[0] == '#ffffff' && (allTiles[index + columns].split(' ')[0] == '#00ff0a')) {
    //         allTiles[index] = '#00ff0a'
    //         io.emit("SCORE_UPDATE", getScore());
    //         io.emit("ADDED_SCORE", 10)
    //         const sendTiles = [];
    //         for (let i = 0; i < (rows - 2) * columns; i++)sendTiles.push(allTiles[i]);
    //         for (let i = (rows - 2) * columns, j = 0; i < (rows - 1) * columns; i++) {
    //             if (i < playerCols[players]) sendTiles.push('#0000ff');
    //             else sendTiles.push(allTiles[i]);
    //             j++;
    //         }
    //         for (let i = (rows - 1) * columns; i < rows * columns; i++) {
    //             sendTiles.push(allTiles[i]);
    //         }
    //         // tcp.sendControlData(sendTiles, rows, columns)
    //         io.emit("PIANO_TILES", sendTiles);
    //     }
    //     else if (index >= (rows - 1) * columns && allTiles[index].split(' ')[0] == '#ffffff') {
    //         allTiles[index] = '#00ff0a'
    //         io.emit("SCORE_UPDATE", getScore());
    //         io.emit("ADDED_SCORE", 10)
    //         const sendTiles = [];
    //         for (let i = 0; i < (rows - 2) * columns; i++)sendTiles.push(allTiles[i]);
    //         for (let i = (rows - 2) * columns, j = 0; i < (rows - 1) * columns; i++) {
    //             if (j < playerCols[players]) sendTiles.push('#0000ff');
    //             else sendTiles.push(allTiles[i]);
    //             j++;
    //         }
    //         for (let i = (rows - 1) * columns; i < rows * columns; i++) {
    //             sendTiles.push(allTiles[i]);
    //         }
    //         // tcp.sendControlData(sendTiles, rows, columns)
    //         io.emit("PIANO_TILES", sendTiles);
    //     }
    // }
    return;
}

export const hardwareSendTiles = (serialArr, rows, columns) => {
    const snakedArr = [];
    console.log(serialArr)
    for (let i = 0; i < rows; i++) {
        // For even rows, push elements in normal order
        if (i % 2 === 0) {
            for (let j = 0; j < columns; j++) {
                snakedArr.push(serialArr[i * columns + j].split(' ')[0]);
            }
        } else {
            // For odd rows, push elements in reverse order
            for (let j = columns - 1; j >= 0; j--) {
                snakedArr.push(serialArr[i * columns + j].split(' ')[0]);
            }
        }
    }
    return getHexColors(snakedArr);
}


export const getHexColors = (colors) => {
    const hexColors = [];
    for (let i = 0; i < colors.length; i++) {
        let hexColor = colors[i];
        hexColor = hexColor.replace('#', '');
        hexColor = hexColor.replace(/ff/g, 'FE');
        hexColor = hexColor.replace(/FF/g, 'FE');
        hexColors[i] = hexColor;
    };
    // console.log(hexColors)
    return hexColors;
};

export var initNotes;
initNotes=[];
for (let i = 0; i < rows - 2; i++) {
    for (let j = 0; j < columns; j++)initNotes.push("#000000");
}
for (let i = 0; i < columns; i++) {
    initNotes.push("#000000");
}
for (let i = 0; i < columns; i++) {
    initNotes.push("#000000");
}
initNotes[prev[0]]='#ffffff'