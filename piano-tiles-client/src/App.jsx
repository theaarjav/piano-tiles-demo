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
import starboy2 from './assets/starboy_louder.mp3'
import starboy from './assets/starboy_final.mp3'
import jamal_kudu from './assets/jamal_kudu_new.mp3'
import saki_saki from './assets/saki_saki.mp3'
import { defaultRows, defaultColumns } from './constants.jsx'
// import fs from 'fs'


let song = "Jamal Kudu"
// const [mode, setMode] = useState("demo");
let mode="demo";
function App() {
  const [nxtRow, setNxtRow] = useState(0)  // let score = 0;
  const [notes, setNotes] = useState({});
  const [scores, setScores] = useState([0, 0]);
  const [lives, setLives] = useState([5, 5]);
  // const [song, setSong] = useState("Jamal Kudu");
  const [index, setIndex] = useState(null);

  const jamal = new Audio(jamal_kudu);
  const saki = new Audio(saki_saki);
  const sf = new Audio(sunflower)
  const chh = new Audio(chhogada)
  const star = new Audio(starboy)

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
    // audio.play();
    console.log(mode, song);
    if (mode == "demo") {
      jamal.play();
    }
    else {
      if (song == "Sunflower") {
        sf.play()
      } else if (song == "Saki Saki") {
        saki.play()
      } else if (song == "Chhogada") {
        chh.play()
      } else if (song == "Starboy") {
        star.play()
      } else {
        jamal.play()
      }
    }
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
    // console.log("clicked", i)
    socket.emit("TILE_CLICKED", i);
  }
  const modeChangeHandler = (e) => {
    // console.log(e.target.value);
    // setMode(e.target.value)
    mode=e.target.value;
    socket.emit("MODE_CHANGE", e.target.value)
  }
  const handleGameFail = () => {
    console.log("here");
    if (mode == "demo") {
      jamal.pause();
      jamal.currentTime = 0;
    }
    else {

      if (song == "Sunflower") {
        sf.pause()
        sf.currentTime = 0;
      } else if (song == "Saki Saki") {
        saki.pause()
        saki.currentTime = 0;
      } else if (song == "Chhogada") {
        chh.pause()
        chh.currentTime = 0;
      } else if (song == "Starboy") {
        star.pause()
        star.currentTime = 0;
      } else {
        jamal.pause()
        jamal.currentTime = 0;
      }
    }

  }
  const songChangeHandler = (e) => {
    // console.log(e.target.value);
    // setSong(e.target.value)
    song = e.target.value;
    socket.emit("SELECT_SONG", e.target.value);
  }
  const handleAudioEnded = (song) => {
    setTimeout(() => {
      socket.emit("AUDIO_ENDED");
    }, 3000);
  }
  useEffect(() => {
    socket.emit("MODE_CHANGE", mode)
    socket.emit("SELECT_SONG", song)
  }, [])
  useEffect(() => {

    const onDisconnect = () => {
      console.log('Socket disconnected successfull!');
      if (mode == "demo") {
        jamal.pause()
        jamal.currentTime = 0;
      }
      else {
        if (song == "Sunflower") {
          sf.pause()
          sf.currentTime = 0;
        } else if (song == "Saki Saki") {
          saki.pause()
          saki.currentTime = 0;
        } else if (song == "Chhogada") {
          chh.pause()
          chh.currentTime = 0;
        } else if (song == "Starboy") {
          star.pause()
          star.currentTime = 0;
        } else {
          jamal.pause()
          jamal.currentTime = 0;
        }
      }
      tempAudio.pause();
      tempAudio.currentTime = 0;
    };
    const onConnect = () => {
      console.log('Socket connected successfull!');
      // if(hasGameStarted)return;

    };
    const handlePianoTiles = (allTiles) => {
      if (index != null) {
        // console.log("here")
        handleTileClick(index)
      }
      // console.log(allTiles);
      setRows(allTiles)
    }

    const handleScoreUpdate = (scores) => {
      // console.log(scores);
      setScores(scores);
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
          handleTileClick(79);
          break;
        case 'ArrowDown':
        case 'k':
        case 'K':
          handleTileClick(81);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          handleTileClick(78);
          break;
        case 'ArrowRight':
        case 'l':
        case 'L':
          handleTileClick(82);
          break;
        default:
          // Do nothing for other keys
          break;
      }
    };
    const songPauseHandler = () => {
      // console.log("called");

      jamal.pause()

    }
    const songStopHandler = () => {
      console.log("called");
      if (mode == "demo") {
        jamal.pause()
        jamal.currentTime = 0;
      }
      else {

        if (song == "Sunflower") {
          sf.pause()
          sf.currentTime = 0;
        } else if (song == "Saki Saki") {
          saki.pause()
          saki.currentTime = 0;
        } else if (song == "Chhogada") {
          chh.pause()
          chh.currentTime = 0;
        } else if (song == "Starboy") {
          star.pause()
          star.currentTime = 0;
        } else {
          jamal.pause()
          jamal.currentTime = 0;
        }
      }
    }
    // if (song == "Sunflower") {
      sf.addEventListener("ended", ()=>handleAudioEnded(sf))
    // } else if (song == "Saki Saki") {
      saki.addEventListener("ended", ()=>handleAudioEnded(saki))
    // } else if (song == "Chhogada") {
      chh.addEventListener("ended", ()=>handleAudioEnded(chh))
    // } else if (song == "Starboy") {
      star.addEventListener("ended", ()=>handleAudioEnded(star))
    // } else {
      jamal.addEventListener("ended", ()=>handleAudioEnded(jamal))
    // }
    document.addEventListener('keydown', handleKeyPress);
    socket.on(EVENT_TYPES.CONNECT, onConnect);
    socket.on("PIANO_KEY", handlePianoKey);
    socket.on(EVENT_TYPES.DISCONNECT, onDisconnect);
    socket.on("PIANO_TILES", handlePianoTiles)
    socket.on("START_SONG", songStartHandler)
    socket.on("SCORE_UPDATE", handleScoreUpdate);
    socket.on("LIVES_UPDATE", handleLivesUpdate);
    socket.on("GAME_FAILED", handleGameFail)
    socket.on("PAUSE_SONG", songPauseHandler)
    socket.on("STOP_SONG", songStopHandler)
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      socket.off(EVENT_TYPES.CONNECT, onConnect);
      socket.off("PIANO_KEY", handlePianoKey);
      socket.off(EVENT_TYPES.DISCONNECT, onDisconnect);
      socket.off("PIANO_TILES", handlePianoTiles)
      socket.off("START_SONG", songStartHandler)
      socket.off("SCORE_UPDATE", handleScoreUpdate);
      socket.off("LIVES_UPDATE", handleLivesUpdate);
      socket.off("PAUSE_SONG", songPauseHandler)
      socket.off("STOP_SONG", songStopHandler)

    }
  }, []);
  // fillRows();
  return (
    <div className='app'>
      <div className="header" onClick={() => handleHeaderClick()}>
        <h4>Piano Tiles</h4>
        <h4>Lives 1: {lives[0]}</h4>
        <h4>Lives 2: {lives[1]}</h4>
        <h4>Score 1: {scores[0]}</h4>
        <h4>Score 2: {scores[1]}</h4>
      </div>
      <div className="game grids" style={{
        gridTemplateRows: `repeat(${defaultRows}, 1fr)`,
        gridTemplateColumns: `repeat(${defaultColumns}, 1fr)`
      }
      }>
        {rows?.map((tile, i) => (
          <div key={i} className='grid' style={{ backgroundColor: tile.split(' ')[0] }}
            // onMouseEnter={() => handleMouseEnter(i)}
            onClick={() => handleTileClick(i)}
          />
        ))}
      </div>
      <div className="select-bar">
        <select className='songs-container' onChange={songChangeHandler}>
          <option className='sunflower'>Sunflower</option>
          <option className='starboy'>Starboy</option>
          <option className='saki_saki'>Saki Saki</option>
          <option className='chhogada'>Jamal Kudu</option>
          <option className='jamal_kudu'>Chhogada</option>
        </select>
      </div>
      <div className="select-bar">
        <select className='modes-container' onChange={modeChangeHandler}>
          <option className='select'>Select Mode</option>
          <option className='demo'>Demo</option>
          <option className='classic'>Classic</option>
          <option className='competition'>Competition</option>
        </select>
      </div>
    </div >
  )
}

export default App
