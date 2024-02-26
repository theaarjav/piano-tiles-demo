import { useState, useEffect } from 'react'
// import heart from './assets/heart.png'
import ellipse from './assets/ellipse.svg'
import headphones from './assets/Headphones.svg'
import headphonesLost from './assets/headphonesLivesLost.svg'
import background from './assets/backgrounds/2.mp4'
import song_bar from './assets/song_bar.svg'
import sunflower from './assets/songPosters/sunflower.jpg'
import starboy from './assets/songPosters/starboy.jpg'
import jamal_kudu from './assets/songPosters/jamal_kudu.webp'
import saki_saki from './assets/songPosters/saki_saki.png'
import chhogada from './assets/songPosters/chhogada.jpg'
import { EVENT_TYPES } from './constants'
import socket from './socket'
import './App.css'
function App() {
  // const [count, setCount] = useState(0)
  // const [gameFail, setGameFail] = useState(false)
  const [score, setScore] = useState(10)
  const [scoresComp, setScoresComp] = useState([10, 10])
  const [audioWidth, setaudioWidth] = useState(40)
  const [addedScore, setAddedScore] = useState(null)
  const [addedScoreLeft, setAddedScoreLeft] = useState(null)
  const [addedScoreRight, setAddedScoreRight] = useState(null)
  const [addedScoreVisible, setAddedScoreVisible] = useState(false)
  const [addedScoreVisibleLeft, setAddedScoreVisibleLeft] = useState(false)
  const [addedScoreVisibleRight, setAddedScoreVisibleRight] = useState(false)
  const [mode, setMode] = useState("demo")
  const [lives, setLives] = useState(3)
  const [livesComp, setLivesComp] = useState([3, 3])
  const [songInfo, setSongInfo] = useState({
    "img":jamal_kudu,
    "songName":"Jamal Kudu",
    "singer":"Harshavardhan Rameshwar"
  })
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
    const handleAudioWidth = (width) => {
      setaudioWidth(width);
    }
    const handleAddedScore = (added) => {
      setAddedScore(added);
      setAddedScoreVisible(true)
      setTimeout(() => {
        setAddedScoreVisible(false);
      }, 500);
    }
    const handleModeChange = (newMode) => {
      console.log(newMode)
      setMode(newMode);
    }
    const handleLivesUpdateComp=(compLives)=>{
      console.log(compLives)
      setLivesComp(compLives);
    }
    const handleScoreUpdateComp=(compScores)=>{
      console.log(compScores)
      setScoresComp(compScores);
    }
    const handleAddedScoreLeft=(addS)=>{
      setAddedScoreLeft(addS);
      setAddedScoreVisibleLeft(true)
      setTimeout(() => {
        setAddedScoreVisibleLeft(false);
      }, 500);
    }
    const handleAddedScoreRight=(addS)=>{
      setAddedScoreRight(addS);
      setAddedScoreVisibleRight(true)
      setTimeout(() => {
        setAddedScoreVisibleRight(false);
      }, 500);
    }

    const handleSongChange=(song)=>{
      if(song=="Sunflower"){
        setSongInfo({
          "img":sunflower,
          "songName":"Sunflower",
          "singer":"Post Malone"
        })
      }else if(song=="Starboy"){
        setSongInfo({
          "img":starboy,
          "songName":"Starboy",
          "singer":"Weeknd"
        })
      }else if(song=="Chhogada"){
        setSongInfo({
          "img":chhogada,
          "songName":"Chhogada",
          "singer":"Darshan Rawal"
        })
      }else if(song=="Saki Saki"){
        setSongInfo({
          "img":saki_saki,
          "songName":"Saki Saki",
          "singer":"Neha Kakkar"
        })
      }else{
        setSongInfo({
          "img":jamal_kudu,
          "songName":"Jamal Kudu",
          "singer":"Harshavardhan Rameshwar"
        })
      }
    }
    socket.on(EVENT_TYPES.CONNECT, onConnect);
    socket.on(EVENT_TYPES.DISCONNECT, onDisconnect);
    // socket.on("START_SONG", songStartHandler)
    socket.on("SCORE_UPDATE", handleScoreUpdate);
    socket.on("LIVES_UPDATE", handleLivesUpdate);
    socket.on("SCORE_UPDATE_COMP", handleScoreUpdateComp);
    socket.on("LIVES_UPDATE_COMP", handleLivesUpdateComp);
    socket.on("GAME_FAILED", handleGameFail)
    socket.on("SET_AUDIO_WIDTH", handleAudioWidth);
    socket.on("ADDED_SCORE", handleAddedScore);
    socket.on("ADDED_SCORE_LEFT", handleAddedScoreLeft);
    socket.on("ADDED_SCORE_RIGHT", handleAddedScoreRight);
    socket.on("SCOREBOARD_MODE_CHANGE", handleModeChange)
    socket.on("SCOREBOARD_SONG_CHANGE", handleSongChange)
    // socket.on("STOP_SONG", songStartHandler)
    return () => {
      socket.off(EVENT_TYPES.CONNECT, onConnect);
      socket.off(EVENT_TYPES.DISCONNECT, onDisconnect);
      // socket.off("START_SONG", songStartHandler)
      socket.off("SCORE_UPDATE", handleScoreUpdate);
      socket.off("LIVES_UPDATE", handleLivesUpdate);
      socket.on("SCORE_UPDATE_COMP", handleScoreUpdateComp);
      socket.on("LIVES_UPDATE_COMP", handleLivesUpdateComp);
      socket.off("GAME_FAILED", handleGameFail)
      socket.off("SET_AUDIO_WIDTH", handleAudioWidth);
      socket.off("ADDED_SCORE", handleAddedScore);
      socket.on("ADDED_SCORE_LEFT", handleAddedScoreLeft);
      socket.on("ADDED_SCORE_RIGHT", handleAddedScoreRight);
      socket.off("SCOREBOARD_MODE_CHANGE", handleModeChange)
      socket.off("SCOREBOARD_SONG_CHANGE", handleSongChange)
      // socket.off("STOP_SONG", songStartHandler)

    }
  }, []);
  return (
    <div>
      <video className='background' loop autoPlay muted>
        <source src={background} type='Video/mp4' />
      </video>
      <div className='song-name-and-icon'>
        <div className="song-info">

          <img src={song_bar} className='song-icon' />
          <img src={songInfo.img} className='song-poster' />
          <div className="song-name">
            <p className="heading">
              {songInfo.songName}
            </p>
            <p className="author">
              {songInfo.singer}
            </p>
          </div>
        </div>
        <div className="audio-timer">

          <div className="audio-tracker" style={{ width: `${audioWidth}%` }}>
            <div className="time-circle">

            </div>
          </div>
          <div className="tot-line">

          </div>
        </div>
      </div>

      {mode == "classic" ?
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
                color: addedScore > 0 ? '#00ff0a' : '#ff000a'
              }}>
                {addedScore > 0 ? '+ ' + addedScore : addedScore}
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
          <div className="livesLeftContainer" style={{
            top:'2vh'
          }}>
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

        : mode == "competition" ?
          <div className="scoreboard-comp">

            <div className='scoreboard' style={{
              width:"50vw",
              justifyContent:'space-around'
            }}>
              <div className="container ellipse-items" style={{
              top:"8vh",
              height:"55vh",
              width:"55vh"
            }}>
                <img src={ellipse} className='ellipse' />
                <div className="score">
                  <div className='text'>
                    SCORE
                  </div>
                  <div className='curr' style={{
                    fontSize:'15vh',
                    lineHeight:'20vh'
                  }}>
                    {scoresComp[0]}
                  </div>
                  <div className={`added  ${addedScoreVisibleLeft ? 'visible' : 'fade-out'}`} style={{
                    color: addedScoreLeft > 0 ? '#00ff0a' : '#ff000a'
                  }}>
                    {addedScoreLeft > 0 ? '+ ' + addedScoreLeft : addedScoreLeft}
                  </div>

                </div>

              </div>
              <div className="livesLeftContainer" style={{
                top:'2vh'
              }}>
                <div className="lives-left-image">
                  {Array.from({ length: 5 }, (_, index) => index + 1).map((i) => {
                    return <span key={i} className={i > livesComp[0] ? "lives-lost" : "lives-left"}>

                      <img src={i > livesComp[0] ? headphonesLost : headphones} className={i > livesComp[0] ? 'livesLostImage' : 'livesLeftImage'} />
                    </span>;
                  })}
                </div>
                <span className='lives-text'>
                  LIVES
                </span>
              </div>
            </div>
            <div className='scoreboard' style={{
              width:"50vw",
              justifyContent:'space-around'
            }}>
              <div className="container ellipse-items" style={{
              top:"8vh",
              height:"55vh",
              width:"55vh"
            }}>
                <img src={ellipse} className='ellipse' />
                <div className="score">
                  <div className='text'>
                    SCORE
                  </div>
                  <div className='curr'
                  style={{
                    fontSize:'15vh',
                    lineHeight:'20vh'
                  }}>
                    {scoresComp[1]}
                  </div>
                  <div className={`added  ${addedScoreVisibleRight ? 'visible' : 'fade-out'}`} style={{
                    color: addedScoreRight > 0 ? '#00ff0a' : '#ff000a'
                  }}>
                    {addedScoreRight > 0 ? '+ ' + addedScoreRight : addedScoreRight}
                  </div>

                </div>

              </div>
              <div className="livesLeftContainer">
                <div className="lives-left-image">
                  {Array.from({ length: 5 }, (_, index) => index + 1).map((i) => {
                    return <span key={i} className={i > livesComp[1] ? "lives-lost" : "lives-left"}>

                      <img src={i > livesComp[1] ? headphonesLost : headphones} className={i > livesComp[1] ? 'livesLostImage' : 'livesLeftImage'} />
                    </span>;
                  })}
                </div>
                <span className='lives-text'>
                  LIVES
                </span>
              </div>
            </div>
          </div>
          :
          <div className='scoreboard'>
            <div className="container ellipse-items">
              <img src={ellipse} className='ellipse' />
              <div className="score">
                <div className='text'>
                  DEMO MODE
                </div>
              </div>
            </div>
          </div>

      }


    </div>
  )
}

export default App
