import { getCompGameOn, getTileChecked, setTileChecked, allTiles, prev, playerCols, backToPrev, getScores, getLives, setScores, setLives, setCompGameOn, generateRowComp, compInitNotes } from "./competition.js";
import { columns, rows } from "./constants.js";
// import { getLives, setLives, setScore, setGameFail } from "../generateMidi.js";
import { tcp } from "../index.js";
import { printNotes } from "../generateMidi.js";
let players = 1;
const midCol = 3
export const handleTileClickComp = (io, index, e) => {
    let compGameOn = getCompGameOn();
    if (!compGameOn) {
        // console.log("here", compInitNotes[index]);
        if (compInitNotes[index].split(' ')[0] == '#00ff00') {
            compInitNotes[index]='#00ff00 checked'
            let b=true;
            for(let i=0;i<rows*columns;i++){
                if(compInitNotes[i]==='#00ff00'){
                    b=false;
                }
            }
            // console.log(compInitNotes);
            if(b){
                setCompGameOn(true);
                printNotes(io);
            }
        }
        return;
    }

    const endTime = new Date().getTime()
    // const elapsedTime = endTime - startTime;
    if (e == "tap") {
        if (allTiles[index].split(' ')[0] == '#ffffff') {
            allTiles[index] = '#00ff0a'
            const sendTiles = [];
            for (let i = 0; i < (rows - 2) * columns; i++) {
                if (i % columns == 0 || i % columns == columns - 1 || (i % columns > 2 && i % columns < columns - 3)) sendTiles.push(allTiles[i])
                else sendTiles.push(allTiles[i]);
            }
            for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
                if (i % columns == 0 || i % columns == columns - 1 || (i % columns > 2 && i % columns < columns - 3)) sendTiles.push(allTiles[i])
                else {
                    if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
                    else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
                    else sendTiles.push('#000033');
                }

                j++
            }
            // sendTiles[index]='#00ff0a'
            let scores = getScores();

            if (index >= (rows - 2) * columns) {
                if (index % columns < midCol) {
                    setScores([scores[0] + 20, scores[1]]);
                    io.emit("ADDED_SCORE_LEFT", 20)
                } else {
                    setScores([scores[0], scores[1] + 20]);
                    io.emit("ADDED_SCORE_RIGHT", 20)
                }
            } else {
                if (index % columns < midCol) {
                    setScores([scores[0] + 10, scores[1]]);
                    io.emit("ADDED_SCORE_LEFT", 10)
                } else {
                    setScores([scores[0], scores[1] + 10]);
                    io.emit("ADDED_SCORE_RIGHT", 10)
                }
            }
            // console.log(scores);
            io.emit("SCORE_UPDATE_COMP", getScores());
            tcp.sendControlData(sendTiles, rows, columns)
            io.emit("PIANO_TILES", sendTiles);
        }
        else if (index < (rows - 2) * columns && allTiles[index] === '#000000' && !getTileChecked()) {
            // console.log("ye")
            allTiles[index] = "#000000 checked"
            setTileChecked(true);
            io.emit("TILE_MISSED");
            const lives = getLives();
            const scores = getScores();
            let sendTiles = [];
            if (index % columns < midCol) {
                setLives([lives[0] - 1, lives[1]]);
                io.emit("LIVES_UPDATE_COMP", getLives())
                setScores([scores[0] - 20, scores[1]]);
                io.emit("ADDED_SCORE_LEFT", -20)
                for (let i = 0; i < (rows - 2) * columns; i++) {
                    if (i % columns == 0
                        // || (i % columns > 2 && i % columns < columns - 3)
                    ) {
                        allTiles[i] = '#ff0000'
                    } sendTiles.push(allTiles[i]);
                }
                for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
                    if (i % columns == 0
                        // || (i % columns > 2 && i % columns < columns - 3)
                    ) {
                        allTiles[i] = '#ff0000';
                        sendTiles.push(allTiles[i]);
                    }
                    else if ((i % columns > 2 && i % columns < columns - 3) || i % columns == columns - 1) {
                        // allTiles[i] = '#ffff00';
                        sendTiles.push(allTiles[i]);
                    }
                    else {
                        if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
                        else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
                        else sendTiles.push('#000033');
                    }
                    j++
                }
            } else {
                setLives([lives[0], lives[1] - 1]);
                io.emit("LIVES_UPDATE_COMP", getLives())
                setScores([scores[0], scores[1] - 20]);
                io.emit("ADDED_SCORE_RIGHT", -20)
                for (let i = 0; i < (rows - 2) * columns; i++) {
                    if (i % columns == columns - 1
                        // || (i % columns > 2 && i % columns < columns - 3)
                    ) {
                        allTiles[i] = '#ff0000'
                    } sendTiles.push(allTiles[i]);
                }
                for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
                    if (i % columns == columns-1
                        // || (i % columns > 2 && i % columns < columns - 3)
                    ) {
                        allTiles[i] = '#ff0000';
                        sendTiles.push(allTiles[i]);
                    }
                    else if((i % columns > 2 && i % columns < columns - 3) || i%columns==0){
                        // allTiles[i] = '#ffff00';
                        sendTiles.push(allTiles[i]);
                    }
                    else {
                        if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
                        else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
                        else sendTiles.push('#000033');
                    }
                    j++
                }
            }
            io.emit("SCORE_UPDATE_COMP", getScores());
            // io.emit("SCORE_UPDATE", getScore());

            sendTiles[index] = '#ff0000'
            tcp.sendControlData(sendTiles, rows, columns)
            io.emit("PIANO_TILES", sendTiles);
            setTimeout(() => {
                backToPrev();
            }, 500);
        }
    }
    else if (e == "hold") {
        if (index < (rows - 1) * columns && allTiles[index].split(' ')[0] == '#ffffff' && (allTiles[index + columns].split(' ')[0] == '#00ff0a')) {
            allTiles[index] = '#00ff0a'
            let scores = getScores();
            if (index >= (rows - 2) * columns) {
                if (index % columns < midCol) {
                    setScores([scores[0] + 20, scores[1]]);
                    io.emit("ADDED_SCORE_LEFT", 20)
                } else {
                    setScores([scores[0], scores[1] + 20]);
                    io.emit("ADDED_SCORE_RIGHT", 20)
                }
            } else {
                if (index % columns < midCol) {
                    setScores([scores[0] + 10, scores[1]]);
                    io.emit("ADDED_SCORE_LEFT", 10)
                } else {
                    setScores([scores[0], scores[1] + 10]);
                    io.emit("ADDED_SCORE_RIGHT", 10)
                }
            }
            io.emit("SCORE_UPDATE_COMP", getScores());
            const sendTiles = [];
            for (let i = 0; i < (rows - 2) * columns; i++) {
                if (i % columns == 0 || i % columns == columns - 1 || (i % columns > 2 && i % columns < columns - 3)) sendTiles.push(allTiles[i])
                else sendTiles.push(allTiles[i]);
            }
            for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
                if (i % columns == 0 || i % columns == columns - 1 || (i % columns > 2 && i % columns < columns - 3)) sendTiles.push(allTiles[[i]])
                else {
                    if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
                    else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
                    else sendTiles.push('#000033');
                }
                j++;
            }
            tcp.sendControlData(sendTiles, rows, columns)
            io.emit("PIANO_TILES", sendTiles);
        }
        else if (index >= (rows - 1) * columns && allTiles[index].split(' ')[0] == '#ffffff' && prev[index - (rows - 1) * columns] == '#00ff0a') {
            allTiles[index] = '#00ff0a'
            const scores = getScores();
            if (index >= (rows - 2) * columns) {
                if (index % columns < midCol) {
                    setScores([scores[0] + 20, scores[1]]);
                    io.emit("ADDED_SCORE_LEFT", 20)
                } else {
                    setScores([scores[0], scores[1] + 20]);
                    io.emit("ADDED_SCORE_RIGHT", 20)
                }
            } else {
                if (index % columns < midCol) {
                    setScores([scores[0] + 10, scores[1]]);
                    io.emit("ADDED_SCORE_LEFT", 10)
                } else {
                    setScores([scores[0], scores[1] + 10]);
                    io.emit("ADDED_SCORE_RIGHT", 10)
                }
            }
            io.emit("SCORE_UPDATE_COMP", getScores());
            const sendTiles = [];
            for (let i = 0; i < (rows - 2) * columns; i++)sendTiles.push(allTiles[i]);
            for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
                if (i % columns == 0 || i % columns == columns - 1 || (i % columns > 2 && i % columns < columns - 3)) sendTiles.push(allTiles[i]);
                else {
                    if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
                    else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
                    else sendTiles.push('#000033');
                }
                j++;
            }
            tcp.sendControlData(sendTiles, rows, columns)
            io.emit("PIANO_TILES", sendTiles);
        }
    }
    return;
}