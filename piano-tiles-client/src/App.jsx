import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useEffect, useRef } from 'react'
// import MidiPlayer from 'midi-player-js';
import { newObj } from '../../server/doraemon'
import socket from './socket'
import { EVENT_TYPES } from './constants'
import doraemon from './assets/41033.wav';
import sunflower from './assets/sunflower.mp3';
import tunak_tunak from './assets/tunak_tunak.mp3';
import buffer from './assets/buffer.wav';
import JaiJaiShivShankar from './assets/Jai_Jai_Shiv_Shankar.mp3';
import DevaDeva from './assets/Deva_Deva.mp3';
import chhogada from './assets/chhogada2.mp3'
import starboy from './assets/starboy.mp3'
import saki_saki from './assets/saki_saki.mp3'
import { defaultRows, defaultColumns } from './constants.jsx'
// import fs from 'fs'


function App() {
  const [nxtRow, setNxtRow] = useState(0)  // let score = 0;
  const [notes, setNotes] = useState({});
  const [score, setScore] = useState(null);
  const [lives, setLives] = useState(null);
  const [mouseInside, setMouseInside] = useState(false);
  const [index, setIndex] = useState(null);
  const audio = new Audio(starboy);
  const tempAudio = new Audio(buffer);
  let gameover = false;
  const generateRow = (note) => {
    let row = new Array(4).fill("white");
    let pos = Math.trunc(Math.random() * 4);
    // console.log
    row[pos] = `black ${note.note} ${(parseInt(note.tiles) - 1)}`;

    return row;
  }

  const songStartHandler = () => {
    tempAudio.pause();
    tempAudio.currentTime = 0;
    audio.play();
  }
  const fillRows = () => {
    const newRows = []
    for (let i = 0; i < 4; i++) {
      let currRow = generateRow(newObj[i]);
      // newRows.unshift(currRow);
      for (let i = 0; i < 4; i++) {
        newRows.unshift(currRow[i]);
      }
    }
    // console.log(currRow)

    for (let i = 0; i < 4; i++) {
      newRows.push('blue');
    }
    return newRows;
  }

  const [rows, setRows] = useState(fillRows())
  const tapped = (i, j) => {
    // console.log(rows)
    if (i != rows.length - 1 || rows[i][j] == "white") {
      gameover = true;
    } else {
      var newRows = rows;
      newRows.splice(3);
      var rowToBeAdded = generateRow(newObj[nxtRow + 4]);
      for (let j = 0; j < 4; j++) {
        if (parseInt(newRows[0][j].split(' ')[2]) > 0) {
          rowToBeAdded[j] = 'black ' + newRows[0][j].split(' ')[1] + ' ' + (parseInt(newRows[0][j].split(' ')[2]) - 1);
        }
      }
      newRows = [rowToBeAdded, ...newRows];
      setNxtRow(nxtRow => { return nxtRow + 1; })
      console.log("here", rowToBeAdded)
      setRows(newRows);
    }
  }
  const handleHeaderClick = async () => {
    tempAudio.play();
    // console.log("clicked")
    socket.emit("GAME_START");
  }

  const handleMouseEnter = (i) => {
    handleTileClick(i);
    setIndex(i);
  }
  const handleMouseLeave = () => {
    // socket.emit("TILE_CLICKED", i);
    setIndex(null);
  }
  const handleTileClick = (i) => {
    console.log("clicked", i)
    socket.emit("TILE_CLICKED", i);
  }

  const handleGameFail = () => {
    console.log("here");
    audio.pause();
    audio.currentTime = 0;
  }

  useEffect(() => {

    const onDisconnect = () => {
      console.log('Socket disconnected successfull!');
      audio.pause();
      audio.currentTime = 0;
      tempAudio.pause();
      tempAudio.currentTime = 0;
    };
    const onConnect = () => {
      console.log('Socket connected successfull!');
      // if(hasGameStarted)return;

    };
    const handlePianoTiles = (allTiles) => {
      if (index != null) {
        console.log("here")
        handleTileClick(index)
      }
      setRows(allTiles)
    }

    const handleScoreUpdate = (score) => {
      setScore(score);
    }
    const handleLivesUpdate = (lives) => {
      setLives(lives);
    }

    const handlePianoKey = (data) => {
      console.log(data.start, ": ");
      data.noteInfo.forEach(noteInfo => {
        const audio = new Audio(notes[noteInfo.note]);
        audio.play();
      });
    }

    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'ArrowUp':
        case 's':
        case 'S':
          handleTileClick((defaultRows - 1) * defaultColumns + 1);
          break;
        case 'ArrowDown':
        case 'k':
        case 'K':
          handleTileClick((defaultRows) * defaultColumns - 2);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          handleTileClick((defaultRows - 1) * defaultColumns);
          break;
        case 'ArrowRight':
        case 'l':
        case 'L':
          handleTileClick((defaultRows) * defaultColumns - 1);
          break;
        default:
          // Do nothing for other keys
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    socket.on(EVENT_TYPES.CONNECT, onConnect);
    socket.on("PIANO_KEY", handlePianoKey);
    socket.on(EVENT_TYPES.DISCONNECT, onDisconnect);
    socket.on("PIANO_TILES", handlePianoTiles)
    socket.on("START_SONG", songStartHandler)
    socket.on("SCORE_UPDATE", handleScoreUpdate);
    socket.on("LIVES_UPDATE", handleLivesUpdate);
    socket.on("GAME_FAILED", handleGameFail)
    // socket.on("STOP_SONG", songStartHandler)
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      socket.off(EVENT_TYPES.CONNECT, onConnect);
      socket.off("PIANO_KEY", handlePianoKey);
      socket.off(EVENT_TYPES.DISCONNECT, onDisconnect);
      socket.off("PIANO_TILES", handlePianoTiles)
      socket.off("START_SONG", songStartHandler)
      socket.off("SCORE_UPDATE", handleScoreUpdate);
      socket.off("LIVES_UPDATE", handleLivesUpdate);
      // socket.off("STOP_SONG", songStartHandler)

    }
  }, []);
  // fillRows();
  return (
    <div className='app'>
      <div className="header" onClick={() => handleHeaderClick()}>
        <h4>Piano Tiles</h4>
        <h4>Lives: {lives}</h4>
        <h4>Score: {score}</h4>
      </div>
      <div className="game grids" style={{
        gridTemplateRows: `repeat(${defaultRows}, 1fr)`,
        gridTemplateColumns: `repeat(${defaultColumns}, 1fr)`
      }
      }>
        {rows?.map((tile, i) => (
          <div key={i} className='grid' style={{ backgroundColor: tile.split(' ')[0] }}
          // onMouseEnter={() => handleMouseEnter(i)}

          />
        ))}
      </div>
    </div >
  )
}

export default App
