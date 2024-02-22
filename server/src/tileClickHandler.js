import { getGameOn, getTileChecked, setTileChecked, allTiles, midCol, prev, playerCols } from "./getTiles.js";
import { columns, rows } from "./constants.js";
import { getLives, getScore, setLives, setScore, setGameFail } from "./generateMidi.js";
import { tcp } from "../index.js";
let players=1;
export const handleTileClick = (io, index, e) => {
    let gameOn=getGameOn();
    if(!gameOn)return;

    const endTime = new Date().getTime()
    // const elapsedTime = endTime - startTime;
    if (e == "tap") {
        // if (index < (rows - 1) * columns && allTiles[index + columns].split(' ')[0] == '#ffffff') {
        //     if (elapsedTime < 167) {
        //         allTiles[index + columns] = '#00ff0a'
        //         io.emit("ADDED_SCORE", 10)
        //         setScore(score + 10);
        //         io.emit("SCORE_UPDATE", getScore());
        //         let sendTiles = [];

        //         for (let i = 0; i < (rows - 1) * columns; i++) {
        //             sendTiles.push(allTiles[i]);
        //         }
        //         for (let i = (rows - 1) * columns, j = 0; i < (rows) * columns; i++) {
        //             if (j < playerCols[players]) {
        //                 if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
        //                 else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
        //                 else sendTiles.push('#000033');
        //             }
        //             else sendTiles.push(allTiles[i]);
        //             j++
        //         }
        //         // for (let i = (rows - 1) * columns; i < (rows) * columns; i++) {
        //         //     sendTiles.push(allTiles[i]);
        //         // }
        //         // sendTiles[index+columns]='#00ff0a'
        //         tcp.sendControlData(sendTiles, rows, columns)
        //         io.emit("PIANO_TILES", sendTiles);
        //     } else if (allTiles[index] = '#000000' && !tileChecked) {
        //         io.emit("TILE_MISSED");
        //         io.emit("LIVES_UPDATE", getLives())
        //         io.emit("ADDED_SCORE", -20)
        //         io.emit("SCORE_UPDATE", getScore());
        //         // for (let i = 0; i < columns; i++) {
        //         let sendTiles = [];

        //         for (let i = 0; i < (rows - 1) * columns; i++) {
        //             sendTiles.push(allTiles[i]);
        //         }
        //         for (let i = (rows - 1) * columns, j = 0; i < (rows) * columns; i++) {
        //             if (j < playerCols[players]) {
        //                 console.log(allTiles[index]);
        //                 if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
        //                 else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
        //                 else sendTiles.push('#000033');
        //             }
        //             else sendTiles.push(allTiles[i]);
        //             j++
        //         }
        //         // for (let i = (rows - 1) * columns; i < (rows) * columns; i++) {
        //         //     sendTiles.push(allTiles[i]);
        //         // }
        //         sendTiles[index] = '#ff0000'
        //         tileChecked = true;
        //         tcp.sendControlData(sendTiles, rows, columns)
        //         io.emit("PIANO_TILES", sendTiles);
        //     }
        //     else if (allTiles[index].split(' ')[0] == '#ffffff') {
        //         allTiles[index] = '#00ff0a'
        //         const sendTiles = [];
        //         for (let i = 0; i < (rows - 1) * columns; i++)sendTiles.push(allTiles[i]);
        //         for (let i = (rows - 1) * columns, j = 0; i < (rows) * columns; i++) {
        //             if (j < playerCols[players]) {
        //                 if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
        //                 else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
        //                 else sendTiles.push('#000033');
        //             }
        //             else sendTiles.push(allTiles[i]);
        //             j++
        //         }
        //         sendTiles[index] = '#00ff0a'
        //         io.emit("SCORE_UPDATE", getScore());
        //         io.emit("ADDED_SCORE", 10)
        //         tcp.sendControlData(sendTiles, rows, columns)
        //         // console.log(sendTiles);
        //         io.emit("PIANO_TILES", sendTiles);
        //     }
        // }

        if (allTiles[index].split(' ')[0] == '#ffffff') {
            // console.log("this ffffff")
            // if (index >= (rows - 1) * columns && prev[index - ((rows - 1) * columns)].split(' ')[0] == '#ffffff') {
            //     if (elapsedTime > 167) {
            //         // allTiles[index] = '#00ff0a'
            //         const sendTiles = [];
            //         for (let i = 0; i < (rows - 1) * columns; i++)sendTiles.push(allTiles[i]);
            //         for (let i = (rows - 1) * columns, j = 0; i < (rows) * columns; i++) {
            //             if (j < playerCols[players]) {
            //                 if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
            //                 else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
            //                 else sendTiles.push('#000033');
            //             }
            //             else sendTiles.push(allTiles[i]);
            //             j++
            //         }
            //         setScore(score + 20)
            //         io.emit("ADDED_SCORE", 20)
            //         io.emit("SCORE_UPDATE", getScore());
            //         tcp.sendControlData(sendTiles, rows, columns)
            //         // console.log(sendTiles);
            //         io.emit("PIANO_TILES", sendTiles);
            //     }
            // }
            // else {

                allTiles[index] = '#00ff0a'
                const sendTiles = [];
                for (let i = 0; i < (rows - 2) * columns; i++)sendTiles.push(allTiles[i]);
                for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
                    if (j%columns>=midCol-players && j%columns<=midCol+players-1) {
                        if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
                        else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
                        else sendTiles.push('#000033');
                    }
                    else sendTiles.push(allTiles[i]);
                    j++
                }
                // sendTiles[index]='#00ff0a'
                let score = getScore();
                if (index >= (rows - 2) * columns) {
                    setScore(score + 20)
                    io.emit("ADDED_SCORE", 20)
                } else {
                    setScore(score + 10)
                    io.emit("ADDED_SCORE", 10)
                }
                io.emit("SCORE_UPDATE", getScore());
                tcp.sendControlData(sendTiles, rows, columns)
                // console.log(sendTiles);
                io.emit("PIANO_TILES", sendTiles);
            // }
        }
        else if (index<(rows-2)*columns && allTiles[index] === '#000000' && !getTileChecked()) {
            // if(allTiles[index].split(' '))
            allTiles[index]="#000000 checked"
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
                sendTiles.push(allTiles[i]);
            }
            for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
                if (j%columns>=midCol-players && j%columns<=midCol+players-1) {
                    if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
                    else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
                    else sendTiles.push('#000033');
                }
                else sendTiles.push(allTiles[i]);
                j++
            }
            sendTiles[index] = '#ff0000'
            tcp.sendControlData(sendTiles, rows, columns)
            io.emit("PIANO_TILES", sendTiles);
        }
    }
    else if (e == "hold") {
        if (index < (rows - 1) * columns && allTiles[index].split(' ')[0] == '#ffffff' && (allTiles[index + columns].split(' ')[0] == '#00ff0a')) {
            allTiles[index] = '#00ff0a'
            let score=getScore();
            setScore(score+10)
            io.emit("SCORE_UPDATE", getScore());
            io.emit("ADDED_SCORE", 10)
            const sendTiles = [];
            for (let i = 0; i < (rows - 2) * columns; i++)sendTiles.push(allTiles[i]);
            for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
                if (j%columns >=midCol-players && j%columns<=midCol+players-1) {
                    if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
                    else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
                    else sendTiles.push('#000033');
                }
                else sendTiles.push(allTiles[i]);
                j++
            }
            // for (let i = (rows - 1) * columns; i < rows * columns; i++) {
            //     sendTiles.push(allTiles[i]);
            // }
            tcp.sendControlData(sendTiles, rows, columns)
            io.emit("PIANO_TILES", sendTiles);
        }
        else if (index >= (rows - 1) * columns && allTiles[index].split(' ')[0] == '#ffffff' && prev[index-(rows-1)*columns]=='#00ff0a') {
            allTiles[index] = '#00ff0a'
            let score=getScore();
            setScore(score+20);
            io.emit("SCORE_UPDATE", getScore());
            io.emit("ADDED_SCORE", 20)
            const sendTiles = [];
            for (let i = 0; i < (rows - 2) * columns; i++)sendTiles.push(allTiles[i]);
            for (let i = (rows - 2) * columns, j = 0; i < (rows) * columns; i++) {
                if (j%columns>=midCol-players && j%columns<=midCol+players-1) {
                    if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#aaaaff');
                    else if (allTiles[i] == '#00ff0a') sendTiles.push('#00ffaa')
                    else sendTiles.push('#000033');
                }
                else sendTiles.push(allTiles[i]);
                j++
            }

            tcp.sendControlData(sendTiles, rows, columns)
            io.emit("PIANO_TILES", sendTiles);
        }
    }
    return;
}