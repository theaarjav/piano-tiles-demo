import { useState, useEffect } from 'react'
import heart from './assets/heart.png'
import ellipse from './assets/ellipse.svg'
import headphones from './assets/Headphones.svg'
import headphonesLost from './assets/headphonesLivesLost.svg'
import background from './assets/2.mp4'
import song_bar from './assets/song_bar.svg'
import song_poster from './assets/songPosters/sunflower.jpg'
import { EVENT_TYPES } from './constants'
import socket from './socket'
import './App.css'
function App() {
  // const [count, setCount] = useState(0)
  // const [gameFail, setGameFail] = useState(false)
  const [score, setScore] = useState(10)
  const [audioWidth, setaudioWidth] = useState(40)
  const [addedScore, setAddedScore] = useState(null)
  const [addedScoreVisible, setAddedScoreVisible] = useState(false)
  // const [fileUploaded, setFileUploaded] = useState(false)
  const [lives, setLives] = useState(3)
  // const lives = 5;
  const handleGameFail = () => {
    setGameFail(true);
  }
  useEffect(() => {

    const onDisconnect = () => {
      console.log('Socket disconnected successfull!');
      // audio.pause();
      // audio.currentTime = 0;
    };
    const onConnect = () => {
      console.log('Socket connected successfull!');
      // if(hasGameStarted)return;

    };

    const handleScoreUpdate = (score) => {
      setScore(score);
    }
    const handleLivesUpdate = (lives) => {
      setLives(lives);
    }
    const handleAudioWidth=(width)=>{
      setaudioWidth(width);
    }
    const handleAddedScore=(added)=>{
      setAddedScore(added);
      setAddedScoreVisible(true)
      setTimeout(() => {
        setAddedScoreVisible(false);
      }, 500);
    }

    socket.on(EVENT_TYPES.CONNECT, onConnect);
    socket.on(EVENT_TYPES.DISCONNECT, onDisconnect);
    // socket.on("START_SONG", songStartHandler)
    socket.on("SCORE_UPDATE", handleScoreUpdate);
    socket.on("LIVES_UPDATE", handleLivesUpdate);
    socket.on("GAME_FAILED", handleGameFail)
    socket.on("SET_AUDIO_WIDTH", handleAudioWidth);
    socket.on("ADDED_SCORE", handleAddedScore);
    // socket.on("STOP_SONG", songStartHandler)
    return () => {
      socket.off(EVENT_TYPES.CONNECT, onConnect);
      socket.off(EVENT_TYPES.DISCONNECT, onDisconnect);
      // socket.off("START_SONG", songStartHandler)
      socket.off("SCORE_UPDATE", handleScoreUpdate);
      socket.off("LIVES_UPDATE", handleLivesUpdate);
      socket.off("GAME_FAILED", handleGameFail)
      socket.off("SET_AUDIO_WIDTH", handleAudioWidth);
      socket.off("ADDED_SCORE", handleAddedScore);
      // socket.off("STOP_SONG", songStartHandler)

    }
  }, []);
  return (
    <div>
      <video className='background' loop autoPlay muted>
        <source src={background} type='Video/mp4'/>
      </video>
      <div className='song-name-and-icon'>
        <div className="song-info">

          <img src={song_bar} className='song-icon' />
          <img src={song_poster} className='song-poster' />
          <div className="song-name">
            <p className="heading">
              Sunflower
            </p>
            <p className="author">
              Post Malone
            </p>
          </div>
        </div>
        <div className="audio-timer">

          <div className="audio-tracker" style={{width:`${audioWidth}%`}}>
            <div className="time-circle">

            </div>
          </div>
          <div className="tot-line">

          </div>
        </div>
      </div>
      <div className="scoreboard">


        <div className="container ellipse-items">
          <img src={ellipse} className='ellipse' />
          <div className="score">
            <div className='text'>
              SCORE
            </div>
            <div className='curr'>
              {score}
            </div>
            <div className={`added  ${addedScoreVisible ? 'visible' : 'fade-out'}`} style={{
              color:addedScore>0?'#00ff0a':'#ff000a'
            }}>
              {addedScore>0?'+ '+ addedScore: addedScore}
            </div>

          </div>
          {/* <div className="song">

            <div className="file-upload" id="upload" onDragOver="event.preventDefault()">
              <h1>
                
              <label className="custom-file-input">
                  <input type="file" id="file" />
                  select file
                </label>
              </h1>
            </div>
            
            <div class="audio-controls" id="audioControls">
            </div>
            
          </div> */}
        </div>
        <div className="livesLeftContainer">
          <div className="lives-left-image">
            {Array.from({ length: 5 }, (_, index) => index + 1).map((i) => {
              return <span key={i} className={i > lives ? "lives-lost" : "lives-left"}>

                <img src={i > lives ? headphonesLost : headphones} className={i > lives ? 'livesLostImage' : 'livesLeftImage'} />
              </span>;
            })}
          </div>
          <span className='lives-text'>
            LIVES
          </span>
        </div>

      </div>
    </div>
  )
}

export default App
