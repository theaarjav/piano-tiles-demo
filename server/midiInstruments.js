const fs = require('fs');
const { Midi } = require('@tonejs/midi');

// Function to determine if an instrument is a piano or a guitar
const isPiano = (midiNumber) => midiNumber >= 1 && midiNumber <= 8;
const isGuitar = (midiNumber) => midiNumber >= 25 && midiNumber <= 32;

const midiData = fs.readFileSync('./41033.mid');
const midi = new Midi(midiData);

// Separate piano and guitar notes
const pianoNotes = [];
const guitarNotes = [];

// Iterate through tracks
midi.tracks.forEach((track, trackIndex) => {
    // Iterate through notes in the track
    track.notes.forEach((note, noteIndex) => {
        const instrumentNumber = note.midi;

        // Check if the instrument is a piano or a guitar
        if (isPiano(instrumentNumber)) {
            pianoNotes.push({ note, trackIndex, noteIndex });
        } else if (isGuitar(instrumentNumber)) {
            guitarNotes.push({ note, trackIndex, noteIndex });
        }
    });
});

// Log piano notes
console.log('Piano Notes:');
pianoNotes.forEach(({ note, trackIndex, noteIndex }) => {
    const beat = note.time / midi.header.tempos[0].bpm;
    console.log(`  Track ${trackIndex + 1}, Note ${noteIndex + 1}: Beat ${beat.toFixed(2)}`);
});

// Log guitar notes
console.log('\nGuitar Notes:');
guitarNotes.forEach(({ note, trackIndex, noteIndex }) => {
    const beat = note.time / midi.header.tempos[0].bpm;
    console.log(`  Track ${trackIndex + 1}, Note ${noteIndex + 1}: Beat ${beat.toFixed(2)}`);
});
