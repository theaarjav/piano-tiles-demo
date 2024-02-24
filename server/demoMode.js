import { rows, columns } from "./src/constants.js";
import { tcp } from "./index.js";
// import { midCol } from "./src/getTiles.js";
import { playerCols } from "./src/getTiles.js";
import { initNotes } from "./src/shared.js";
import { hardwareSendTiles } from "./generateRandomTile.js";
const midCol = parseInt(columns / 2);
export const allTiles = [];
const players = 1;
export let prev = [];
for (let i = 0; i < (rows - 2) * columns; i++) {
    if (i % columns < midCol - players || i % columns > midCol + players - 1) allTiles.push('#ffff00')
    else allTiles.push('#000000');
}
for (let i = (rows - 2) * columns; i < (rows) * columns; i++) {
    if (i % columns < midCol - players || i % columns > midCol + players - 1) allTiles.push('#ffff00')
    else {
        allTiles.push('#000033');
    }
}
export const backToPrev = () => {
    for (let i = 0; i < rows * columns; i++) {
        if (i % columns < midCol - players || i % columns > midCol + players - 1) {
            allTiles[i] = '#ffff00'
        }
    }
}
let gameOn = false
export const result = {
    "0": [{ "note": "4-as", "duration": 0.75, "tiles": 1 }],
    "1": [{ "note": "4-gs", "duration": 0.75, "tiles": 2 }],
    "2": [{ "note": "4-as", "duration": 0.75, "tiles": 1 }],
    "3": [{ "note": "4-gs", "duration": 0.75, "tiles": 1 }],
    "4": [{ "note": "4b", "duration": 0.75, "tiles": 1 }],
    "5": [{ "note": "4-a", "duration": 0.75, "tiles": 2 }],
    "6": [{ "note": "4b", "duration": 0.75, "tiles": 2 }],
    "7": [{ "note": "4-a", "duration": 1, "tiles": 4 }],
    "9": [{ "note": "4-e", "duration": 0.5, "tiles": 1 }]
}

// let end=9;
for (let i = 1; i <= rows; i++) {
    result[(9 + i * 0.5).toString()] = 'blank_tiles'
}
// const result = organizeNotes(jamalKudu);
// console.log(result);
let time = 0;
let currentIndex = 0;
const keysArray = Object.keys(result);
let currTime = parseFloat(keysArray[0]);
let songOn = false;
export const stopTiles = (io) => {
    io.emit("GAME_STOP_TO_CLIENT")
    const sendTiles = [];
    for (let i = 0; i < rows * columns; i++) {
        sendTiles.push('#ffff00')
    }
    for (let i = 0; i < (rows - 2) * columns; i++) {

        if (i % columns < midCol - players || i % columns > midCol + players - 1) initNotes[i] = '#ffff00';
        else initNotes[i] = "#000000";

    }
    for (let i = (rows - 2) * columns; i < rows * columns; i++) {
        if (i % columns >= midCol - players && i % columns <= midCol + players - 1) initNotes[i] = "#000033";
        else initNotes[i] = "#ffff00";
    }
    initNotes[(rows - 2) * columns + parseInt(columns / 2)] = '#00ff00';
    tcp.sendControlData(sendTiles, rows, columns)
    io.emit("PIANO_TILES", sendTiles);
    io.emit("STOP_SONG");
    gameOn = false
    currentIndex = 0;
    return;
}
export const printDemoNotes = (io) => {
    if (io) {
        if (currentIndex >= keysArray.length) {
            stopTiles(io);
            return;
        }
        // if(currentIndex==rows-1)
        const currentTimeInterval = parseFloat(currTime);
        const endTimeInterval = (parseFloat(currTime) + 0.5);
        let highestNote = null;
        // io.emit("GAME_START_TO_CLIENT");
        for (let i = 0; i < columns; i++)
            if (allTiles[(rows - 2) * columns + i].split(' ')[0] == '#ffffff' && (currentIndex < 12 || currentIndex > 13)) {
                songOn = false
                io.emit("PAUSE_SONG");
                return;
            }
        if (result[keysArray[currentIndex]] == 'blank_tiles' || (parseFloat(keysArray[currentIndex]).toFixed(2) < parseFloat(currentTimeInterval).toFixed(2) ||
            parseFloat(keysArray[currentIndex]).toFixed(2) >= parseFloat(endTimeInterval).toFixed(2))) {
            // console.log("here", keysArray[currentIndex], endTimeInterval, currentTimeInterval);
            // currentIndex++;

            generateRowDemo(io, 0);
            if (result[keysArray[currentIndex]] == 'blank_tiles' || parseFloat(keysArray[currentIndex]) < currentTimeInterval) currentIndex++;
            else currTime = endTimeInterval;
            // setTimeout(() => printNotes( io), 500); // Set the timeout to 500 milliseconds for the next interval
            // return;
        }
        else {

            // console.log( currentTimeInterval, endTimeInterval, keysArray[currentIndex]);
            while (
                currentIndex < keysArray.length &&
                parseFloat(keysArray[currentIndex]) >= currentTimeInterval &&
                parseFloat(keysArray[currentIndex]) < endTimeInterval
            ) {
                const currKey = keysArray[currentIndex];
                const currValue = result[currKey];

                for (let i = 0; i < currValue.length; i++) {
                    if (!highestNote) {
                        highestNote = {
                            start: currKey,
                            noteInfo: currValue[i],
                        };
                    } else if (parseFloat(currValue[i].duration) > parseFloat(highestNote.noteInfo.duration) > 0) {
                        // } else if (compareNotes(currValue[i].note, highestNote.noteInfo.note) > 0) {
                        highestNote = {
                            start: currKey,
                            noteInfo: currValue[i],
                        };
                    }
                }

                currentIndex++;
            }
            if (highestNote) generateRowDemo(io, highestNote.noteInfo.tiles);
            else generateRowDemo(io, 0);
            currTime = endTimeInterval;
        }
        time += 0.5;
        const per = (time / 60) * 100;
        io.emit("SET_AUDIO_WIDTH", per);
        setTimeout(() => printDemoNotes(io), 500); // Set the timeout to 500 milliseconds for the next interval
    }
};
let it = 0;
const generateRowDemo = (io, tileLength) => {
    // if(allTiles[(rows-2)*columns])
    it++;
    if (it >= rows - 2) gameOn = true;
    backToPrev();
    for (let i = midCol - players; i <= midCol + players - 1; i++) {

        if (allTiles[(rows - 1) * columns + i].split(' ')[0] == '#ffffff') {
            allTiles[(rows - 1) * columns + i] = "#000000 checked"
            let sendTiles = [];
            for (let i = 0; i < (rows - 2) * columns; i++) {
                if (i % columns < midCol - players || i % columns > midCol + players - 1) {
                    allTiles[i] = '#ff0000'
                    sendTiles.push('#ff0000');
                }
                else sendTiles.push(allTiles[i]);
            }
            for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
                if (i % columns < midCol - players || i % columns > midCol + players - 1) {
                    allTiles[i] = '#ff0000';
                    sendTiles.push(allTiles[i]);
                }
                else {
                    if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
                    else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
                    else sendTiles.push('#000033');
                }
                j++
            }
            sendTiles[(rows - 1) * columns + i] = '#ff0000'
            tcp.sendControlData(sendTiles, rows, columns)
            io.emit("PIANO_TILES", sendTiles);
        }
        prev[i] = allTiles[(rows - 1) * columns + i];
    }
    for (let i = (rows - 1) * columns; i >= columns; i -= columns) {
        for (let j = 0; j < columns; j++)
            if (allTiles[i + j - columns].split(' ')[0] == '#000000') allTiles[i + j] = '#000000';
            else allTiles[i + j] = allTiles[i + j - columns];
    }
    if (tileLength == 0) {
        let sendTiles = [];
        for (let i = 0; i < columns; i++) {
            if (parseInt(allTiles[i + columns].split(' ')[1]) > 0) {
                allTiles[i] = '#ffffff ' + (parseInt(allTiles[i].split(' ')[1]) - 1);
            }
            else if (i % columns < midCol - players || i % columns > midCol + players - 1) {
                allTiles[i] = allTiles[i + columns];
            }
            else allTiles[i] = '#000000';
        }
        for (let i = 0; i < (rows - 2) * columns; i++) {
            sendTiles.push(allTiles[i]);
        }
        for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
            // if(i%columns<midCol-players || i%columns>midCol+players-1)sendTiles.push('#ffff00')
            if (i % columns >= midCol - players && i % columns <= midCol + players - 1) {
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
        else if (i % columns < midCol - players || i % columns > midCol + players - 1) {
            allTiles[i] = allTiles[i + columns];
        }
        else allTiles[i] = '#000000';
    }
    let pos = Math.trunc(Math.random() * playerCols[players]) + midCol - players;
    while (allTiles[pos].split(' ')[0] == '#ffffff' && allTiles[pos + columns].split(' ')[0] == '#ffffff') {
        pos = Math.trunc(Math.random() * playerCols[players]) + midCol - players;
    }

    allTiles[pos] = `#ffffff ${(parseInt(tileLength) - 1)}`;

    let sendTiles = [];

    for (let i = 0; i < (rows - 2) * columns; i++) {
        sendTiles.push(allTiles[i]);
    }
    for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
        if (i % columns >= midCol - players && i % columns <= midCol + players - 1) {
            if (allTiles[i].split(' ')[0] == '#ffffff') {
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


export const handleDemoTileClick = (io, index, e) => {
    // let gameOn = getGameOn();
    // console.log("here, ",index, allTiles[index]);

    if (!gameOn) {
        console.log('ye');
        if (initNotes[index] == '#00ff00') {
            initNotes[index] = '#00ff00 checked'
            gameOn = true;
            printDemoNotes(io);
        }
        return;
    }

    const endTime = new Date().getTime()
    // const elapsedTime = endTime - startTime;
    if (e == "tap") {
        // currentIndex++;
        if (allTiles[index].split(' ')[0] == '#ffffff') {
            allTiles[index] = '#00ff0a'
            const sendTiles = [];
            for (let i = 0; i < (rows - 2) * columns; i++) {
                if (i % columns < midCol - players || i % columns > midCol + players - 1) sendTiles.push('#ffff00')
                else sendTiles.push(allTiles[i]);
            }
            for (let i = (rows - 2) * columns; i < (rows) * columns; i++) {
                if (i % columns < midCol - players || i % columns > midCol + players - 1) sendTiles.push('#ffff00')
                else {
                    if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
                    else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
                    else sendTiles.push('#000033');
                }
            }
            // sendTiles[index]='#00ff0a'

            tcp.sendControlData(sendTiles, rows, columns)
            // console.log(sendTiles);
            io.emit("PIANO_TILES", sendTiles);
            if (!songOn) {
                songOn = true;
                io.emit("START_SONG");
                setTimeout(() => printDemoNotes(io), 500);
            }
            // }
        }
        else if (index < (rows - 2) * columns && allTiles[index] === '#000000') {
            // if(allTiles[index].split(' '))
            allTiles[index] = "#000000 checked"
            let sendTiles = [];

            for (let i = 0; i < (rows - 2) * columns; i++) {
                if (i % columns < midCol - players || i % columns > midCol + players - 1) {
                    allTiles[i] = '#ff0000'
                } sendTiles.push(allTiles[i]);
            }
            for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
                if (i % columns < midCol - players || i % columns > midCol + players - 1) {
                    allTiles[i] = '#ff0000';
                    sendTiles.push(allTiles[i]);
                }
                else {
                    if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
                    else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
                    else sendTiles.push('#000033');
                }
                j++
            }
            sendTiles[index] = '#ff0000'
            tcp.sendControlData(sendTiles, rows, columns)
            io.emit("PIANO_TILES", sendTiles);
            setTimeout(() => {
                backToPrev();
            }, 300);
        }
    }
    else if (e == "hold") {
        // currentIndex++;
        if (index < (rows - 1) * columns && allTiles[index].split(' ')[0] == '#ffffff' && (allTiles[index + columns].split(' ')[0] == '#00ff0a')) {
            allTiles[index] = '#00ff0a'
            const sendTiles = [];
            for (let i = 0; i < (rows - 2) * columns; i++) {
                if (i % columns < midCol - players || i % columns > midCol + players - 1) sendTiles.push('#ffff00')
                else sendTiles.push(allTiles[i]);
            }
            for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
                if (i % columns < midCol - players || i % columns > midCol + players - 1) sendTiles.push('#ffff00')
                else {
                    if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
                    else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
                    else sendTiles.push('#000033');
                }
                j++
            }
            // for (let i = (rows - 1) * columns; i < rows * columns; i++) {
            //     sendTiles.push(allTiles[i]);
            // }
            tcp.sendControlData(sendTiles, rows, columns)
            io.emit("PIANO_TILES", sendTiles);
            if (!songOn) {
                songOn = true;
                io.emit("START_SONG");
                setTimeout(() => printDemoNotes(io), 500);
            }
        }
        else if (index >= (rows - 1) * columns && allTiles[index].split(' ')[0] == '#ffffff' && prev[index - (rows - 1) * columns] == '#00ff0a') {
            // currentIndex++;
            allTiles[index] = '#00ff0a'
            const sendTiles = [];
            for (let i = 0; i < (rows - 2) * columns; i++)sendTiles.push(allTiles[i]);
            for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
                if (i % columns < midCol - players || i % columns > midCol + players - 1) sendTiles.push('#ffff00')
                else {
                    if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
                    else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
                    else sendTiles.push('#000033');
                }

                j++
            }
            tcp.sendControlData(sendTiles, rows, columns)
            io.emit("PIANO_TILES", sendTiles);
            if (!songOn) {
                songOn = true;
                io.emit("START_SONG");
                setTimeout(() => printDemoNotes(io), 500);
            }
        }
    }
    return;
}