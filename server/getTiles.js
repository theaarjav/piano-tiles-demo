import { getLives, getScore, setLives, setScore, setGameFail } from "./generateMidi.js";

const allTiles = [];
for (let i = 0; i < 20; i++) {
    allTiles.push('#000000');
}
var startTime = 0;
export const generateRow = (io, tileLength) => {
    startTime = 0;
    // console.log(tileLength);
    for (let i = 16; i < 20; i++) {
        if (allTiles[i].split(' ')[0] == '#ffffff') {
            allTiles[i] = '#0000ff'
            io.emit("TILE_MISSED");
            let lives = getLives();
            setLives(lives - 1);
            let score=getScore();
            setScore(score-20);
            io.emit("LIVES_UPDATE", getLives())
            io.emit("ADDED_SCORE", -20);
            io.emit("SCORE_UPDATE", getScore());
            if (getLives() <= 0) {
                io.emit("GAME_FAILED");
                setGameFail(true);
                return;
            }
            for (let i = 0; i < 3; i++) {
                let sendTiles = [];
                setTimeout(() => {
                    for (let i = 0; i < 16; i++) {
                        sendTiles.push(allTiles[i]);
                    }
                    for (let i = 16; i < 20; i++) {
                        if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#ff0000');
                        else sendTiles.push('#0000ff')
                    }
                    io.emit("PIANO_TILES", hardwareSendTiles(sendTiles));
                }, 100)
            }
        }
    }

    for (let i = 16; i >= 4; i -= 4) {
        allTiles[i] = allTiles[i - 4];
        allTiles[i + 1] = allTiles[i - 3];
        allTiles[i + 2] = allTiles[i - 2];
        allTiles[i + 3] = allTiles[i - 1];
    }
    if (tileLength == 0) {
        let sendTiles = [];
        for (let i = 0; i < 4; i++) {
            // console.log(allTiles[i+4].split(' ')[1]);
            if (parseInt(allTiles[i + 4].split(' ')[1]) > 0) {
                allTiles[i] = '#ffffff ' + (parseInt(allTiles[i].split(' ')[1]) - 1);
                // console.log(allTiles[i]);
            }
            else {
                allTiles[i] = '#000000';
            }
        }

        for (let i = 0; i < 16; i++) {
            sendTiles.push(allTiles[i]);
        }
        for (let i = 16; i < 20; i++) {
            sendTiles.push('#0000ff');
        }
        io.emit('PIANO_TILES', hardwareSendTiles(sendTiles));
        return;
    }
    for (let i = 0; i < 4; i++) {
        // console.log(allTiles[i+4].split(' ')[1]);
        if (parseInt(allTiles[i + 4].split(' ')[1]) > 0) {
            allTiles[i] = '#ffffff ' + (parseInt(allTiles[i].split(' ')[1]) - 1);
            // console.log(allTiles[i]);
        }
        else allTiles[i] = '#000000';
    }
    let pos = Math.trunc(Math.random() * 4);
    while (allTiles[pos].split(' ')[0] == '#ffffff' || allTiles[pos+4].split(' ')[0]=='#ffffff') {
        pos = Math.trunc(Math.random() * 4);
    }

    allTiles[pos] = `#ffffff ${(parseInt(tileLength) - 1)}`;

    let sendTiles = [];

    for (let i = 0; i < 16; i++) {
        sendTiles.push(allTiles[i]);
    }
    for (let i = 16; i < 20; i++) {
        sendTiles.push('#0000ff');
    }
    io.emit("PIANO_TILES", hardwareSendTiles(sendTiles));
    return allTiles;
}

export const handleTileClick = (io, index) => {
    const endTime = new Date().getTime()
    const elapsedTime = endTime - startTime;
    // console.log("here", index)
    if (index > 15 || index < 12) return;
    let score = getScore();
    setScore(score + 10);
    if (allTiles[index + 4].split(' ')[0] == '#ffffff') {
        if (elapsedTime > 167){
            allTiles[index] = '#00ff0a'
            allTiles[index + 4] = '0000ff'
            io.emit("SCORE_UPDATE", getScore());
            io.emit("ADDED_SCORE", 10)
        }
    }
    else if (allTiles[index].split(' ')[0] == '#ffffff') {
        // allTiles[index - 4].concat('30');
        allTiles[index] = '#00ff0a'
        io.emit("SCORE_UPDATE", getScore());
        io.emit("ADDED_SCORE", 10)
    }
    const sendTiles = [];
    for (let i = 0; i < 16; i++)sendTiles.push(allTiles[i]);
    let toggleLife = false;
    for (let i = 16; i < 20; i++) {
        if (allTiles[i].split(' ')[0] == '#ffffff') {
            allTiles[i]= '#0000ff'
            io.emit("TILE_MISSED");
            if (!toggleLife) {
                let lives = getLives();
                setLives(lives - 1);
                let score=getScore();
                setScore(score-20);

                io.emit("LIVES_UPDATE", getLives())
                io.emit("ADDED_SCORE", -20)
                io.emit("SCORE_UPDATE", getScore());
                if (getLives() <= 0) {
                    io.emit("GAME_FAILED");
                    setGameFail(true);
                    return;
                }
                toggleLife = true;
            }
            for (let i = 0; i < 3; i++) {
                let sendTiles = [];
                setTimeout(() => {
                    for (let i = 0; i < 16; i++) {
                        sendTiles.push(allTiles[i]);
                    }
                    for (let i = 16; i < 20; i++) {
                        if (allTiles[i].split(' ')[0] == '#ffffff') sendTiles.push('#ff0000');
                        else sendTiles.push('#0000ff')
                    }
                    io.emit("PIANO_TILES", hardwareSendTiles(sendTiles));
                }, 100)
            }
            sendTiles.push('#ff0000');
        }
        else sendTiles.push('#0000ff');

    }
    io.emit("PIANO_TILES", hardwareSendTiles(sendTiles));
    return;
    // return;
}

const hardwareSendTiles = (sendTiles) => {
    const finalTiles = [];
    for (let i = 0; i < sendTiles.length / 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (i % 2 == 0) finalTiles.push(sendTiles[4 * i + j].split(' ')[0]);
            else finalTiles.push(sendTiles[4 * i + 3 - j].split(' ')[0]);
        }
    }
    return finalTiles;
}