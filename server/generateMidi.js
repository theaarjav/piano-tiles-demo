// const fs = require('fs');
import fs, { write } from 'fs';
import tonejs from '@tonejs/midi'
// import wavPlayer from 'node-wav-player';
import { generateRow, getGameOn, setGameOn } from './src/getTiles.js';
import { getHexColors, initNotes } from './src/shared.js';
// import { generateRow, getHexColors } from './generateRandomTile.js';
import { rows, columns } from './src/constants.js';
import { getMode, getSong, tcp } from './index.js';
import { generateRowComp, compInitNotes, setCompGameOn, getCompGameOn, backToPrev as backToPrevComp } from './src/competition.js';
import { midCol } from './src/getTiles.js';
import { songSelect } from './songMapping.js';
import { intervals } from './intervalMapping.js';
import { backToPrev } from './demoMode.js';
const players = 1;
const Midi = tonejs.Midi;
let song="Jamal Kudu";
export const setSong=(selectedSong)=>{
  song=selectedSong;
}
const midiData = fs.readFileSync('./midis/starboy.mid');
const midi = new Midi(midiData);
const piano_note_to_key_file = {
  "A0": "0-a", "A#0": "0-as", "B0": "0b",
  "C1": "1-c", "C#1": "1-cs", "D1": "1-d", "D#1": "1-ds", "E1": "1-e", "F1": "1-f", "F#1": "1-fs", "G1": "1-g", "G#1": "1-gs", "A1": "1-a", "A#1": "1-as", "B1": "1b",
  "C2": "2-c", "C#2": "2-cs", "D2": "2-d", "D#2": "2-ds", "E2": "2-e", "F2": "2-f", "F#2": "2-fs", "G2": "2-g", "G#2": "2-gs", "A2": "2-a", "A#2": "2-as", "B2": "2b",
  "C3": "3-c", "C#3": "3-cs", "D3": "3-d", "D#3": "3-ds", "E3": "3-e", "F3": "3-f", "F#3": "3-fs", "G3": "3-g", "G#3": "3-gs", "A3": "3-a", "A#3": "3-as", "B3": "3b",
  "C4": "4-c", "C#4": "4-cs", "D4": "4-d", "D#4": "4-ds", "E4": "4-e", "F4": "4-f", "F#4": "4-fs", "G4": "4-g", "G#4": "4-gs", "A4": "4-a", "A#4": "4-as", "B4": "4b",
  "C5": "5-c", "C#5": "5-cs", "D5": "5-d", "D#5": "5-ds", "E5": "5-e", "F5": "5-f", "F#5": "5-fs", "G5": "5-g", "G#5": "5-gs", "A5": "5-a", "A#5": "5-as", "B5": "5b",
  "C6": "6-c", "C#6": "6-cs", "D6": "6-d", "D#6": "6-ds", "E6": "6-e", "F6": "6-f", "F#6": "6-fs", "G6": "6-g", "G#6": "6-gs", "A6": "6-a", "A#6": "6-as", "B6": "6b",
  "C7": "7-c", "C#7": "7-cs", "D7": "7-d", "D#7": "7-ds", "E7": "7-e", "F7": "7-f", "F#7": "7-fs", "G7": "7-g", "G#7": "7-gs", "A7": "7-a", "A#7": "7-as", "B7": "7b",
  "C8": "8-c"
}

// // Path to the folder containing WAV samples
const wavFolderPath = './piano-88-notes';

// // Assuming piano is on track 0
// const pianoTrack = midi.tracks[0];

// const newObj = [];
// // Sample data representing piano notes

// pianoTrack.notes.forEach(async (note) => {
//   // console.log(`Note: ${note.name}, Start Time: ${note.time.toFixed(2)} seconds, Duration: ${(note.duration).toFixed(2)} seconds`);
//   newObj.push({
//     note: note.name,
//     start: note.time,
//     duration: (note.duration),
//     tiles: Math.min((parseInt(note.duration) / (tileInterval/1000)), 4)
//   })
// });
// console.log(newObj);
// // Function to organize notes into an object
function organizeNotes(notesData, tileInterval) {
  // Initialize an object to store organized notes
  const organizedNotes = {};
  var startEnd;
  console.log(notesData);
  // Iterate through the notesData
  for (const noteData of notesData) {
    const startTime = noteData.start;
    startEnd = noteData.start;
    // Check if there is an array for the startTime, if not, create one
    if (!organizedNotes[startTime]) {
      organizedNotes[startTime] = [];
    }

    // Add the note data to the corresponding array
    organizedNotes[startTime].push({
      note: piano_note_to_key_file[noteData.note],
      duration: noteData.duration,
      tiles: Math.max(1, (parseInt(noteData.duration) / 0.25))
    });
  }
  for (let i = 1; i <= rows; i++) {
    organizedNotes[(parseFloat(startEnd) + i * (tileInterval/1000)).toString()] = 'blank_tiles'
  }
  return organizedNotes;
}

// Call the function and get the result
// let song=getSong();
let tileInterval = intervals["Starboy"];
let result = songSelect["Starboy"];
let currentIndex = 0;
let keysArray = Object.keys(result);
let currTime = parseFloat(keysArray[0]);
let startEnd = parseFloat(keysArray[keysArray.length-1]);
for (let i = 1; i <= rows; i++) {
  result[(parseFloat(startEnd) + i * (tileInterval/1000)).toString()] = 'blank_tiles'
}
export const setResultAndInterval = ({ res, int }) => {
  let startEnd = parseFloat(keysArray[keysArray.length-1]);
  tileInterval = int
  // result = organizeNotes(res,int);
  result=res;
  for (let i = 1; i <= rows; i++) {
    result[(parseFloat(startEnd) + i * (tileInterval/1000)).toString()] = 'blank_tiles'
  }
  // console.log(result, tileInterval);
  currentIndex = 0;
  keysArray = Object.keys(result);
  currTime = parseFloat(keysArray[0]);
}
// console.log(result);

let time = 0;

let score = 0, lives = 5;
export const getScore = () => { return score; }
export const getLives = () => { return lives; }
export const setScore = (s) => { score = s; }
export const setLives = (l) => { lives = l; }
// console.log(keysArray.length);
// console.log(keysArray[0]);
let gameFail = false;
export const getGameFail = () => { return gameFail; }
export const setGameFail = (status) => { gameFail = status; }
const failedNotes = [];
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < columns; j++)failedNotes.push("#ff0000");
}



export const stopSongClassic = (io) => {
  console.log("called");
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
  setGameOn(false)
  currentIndex = 0;
  keysArray = Object.keys(result);
  currTime = parseFloat(keysArray[0]);
  time = 0;
  score = 0, lives = 5;

  return;
}

export const stopSongComp = (io) => {
  io.emit("GAME_STOP_TO_CLIENT")
  const sendTiles = [];
  for (let i = 0; i < rows * columns; i++) {
    sendTiles.push('#ffff00')
  }
  for (let i = 0; i < (rows - 2) * columns; i++) {
    if (i % columns == 0 || i % columns == columns - 1 || (i % columns > 2 && i % columns < columns - 3)) {
      compInitNotes[i] = '#ffff00';
    }
    else compInitNotes[i] = '#000000';
  }
  for (let i = (rows - 2) * columns; i < rows * columns; i++) {
    if (i % columns == 0 || i % columns == columns - 1 || (i % columns > 2 && i % columns < columns - 3)) {
      compInitNotes[i] = '#ffff00';
    }
    else compInitNotes[i] = '#000033';
  }
  compInitNotes[(rows - 2) * columns + 2] = '#00ff00'
  compInitNotes[(rows - 2) * columns + columns - 2] = '#00ff00'
  tcp.sendControlData(sendTiles, rows, columns)
  io.emit("PIANO_TILES", sendTiles);
  io.emit("STOP_SONG");
  setCompGameOn(false);
  currentIndex = 0;
  keysArray = Object.keys(result);
  currTime = parseFloat(keysArray[0]);

  return;
}

export const printNotes = (io) => {
  if (io) {
    if (gameFail) {
      io.emit("PIANO_TILES", failedNotes);
      tcp.sendControlData(getHexColors(
        failedNotes
      ))
      return;
    }
    if (getMode() == 'classic' && !getGameOn()) return;
    else if (getMode() == 'competition' && !getCompGameOn()) return;

    console.log("here", currentIndex, keysArray.length);
    if (currentIndex >= keysArray.length) {
      if (getMode() == 'classic') {
        stopSongClassic(io);
        backToPrev();
      }
      else {
        stopSongComp(io);
        backToPrevComp();
      }
      return;
    }
    io.emit("LIVES_UPDATE", lives);
    io.emit("SCORE_UPDATE", score);
    const currentTimeInterval = parseFloat(currTime);
    const endTimeInterval = (parseFloat(currTime) + (tileInterval / 1000));
    let highestNote = null;
    // io.emit("GAME_START_TO_CLIENT");
    if (result[keysArray[currentIndex]] == 'blank_tiles' || (parseFloat(keysArray[currentIndex]).toFixed(2) < parseFloat(currentTimeInterval).toFixed(2) ||
      parseFloat(keysArray[currentIndex]).toFixed(2) >= parseFloat(endTimeInterval).toFixed(2))) {
      // console.log("here", keysArray[currentIndex], endTimeInterval, currentTimeInterval);
      // currentIndex++;

      if (getMode() == 'competition') {
        generateRowComp(io, 0);
      }
      else {
        generateRow(io, 0);
      }
      if (result[keysArray[currentIndex]] == 'blank_tiles' || parseFloat(keysArray[currentIndex]) < currentTimeInterval) currentIndex++;
      else {
        currTime = endTimeInterval;
        // console.log(currTime, endTimeInterval);
      }
      // setTimeout(() => printNotes( io), tileInterval); // Set the timeout to tileInterval milliseconds for the next interval
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
        console.log(currentIndex, currKey, currValue);
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
      // if (longestNote) {
      //   io.emit("PIANO_KEY", longestNote);
      // }
      // console.log(longestNote);
      if (getMode() == 'competition') {
        if (highestNote) generateRowComp(io, highestNote.noteInfo.tiles);
        else generateRowComp(io, 0);
      }
      else {
        // console.log("here");
        if (highestNote) generateRow(io, highestNote.noteInfo.tiles);
        else generateRow(io, 0);
      }
      currTime = endTimeInterval;
    }
    time += (tileInterval / 1000);
    const per = (Math.max(time / 60) * 100, 100);
    io.emit("SET_AUDIO_WIDTH", per);
    setTimeout(() => printNotes(io), tileInterval); // Set the timeout to tileInterval milliseconds for the next interval
  }
};

function compareNotes(note1, note2) {
  const pitch1 = note1.charAt(note1.length - 1);
  const pitch2 = note2.charAt(note2.length - 1);

  if (pitch1 > pitch2) {
    return 1;
  } else if (pitch1 < pitch2) {
    return -1;
  } else {
    const octave1 = parseInt(note1.charAt(0));
    const octave2 = parseInt(note2.charAt(0));
    return octave1 - octave2;
  }
}
printNotes();

// fs.writeFileSync('./jamal_kudu.js', 'export const result=' + JSON.stringify(result))