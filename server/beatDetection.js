import fs from "fs";
import {promisify} from 'util'
// import {createBeatDetector} from 'web-audio-beat-detector'
// import wavPlayer from "node-wav-player";
import meyda from "meyda";
import wav from 'node-wav';
// import decode from 'audio-decode'
// import {toAudioBuffer} from 'pcm-util'
// import Wav from 'wav'
// import AudioBufferToWav from 'audiobuffer-to-wav'
// const readFile = promisify(fs.readFile);
// const writeFile = promisify(fs.writeFile);

async function detectAndEmphasizeBeats(inputFilePath, outputFilePath) {
  try {
    // Read the WAV audio file
    const audioData = fs.readFileSync(inputFilePath);
    const audioBuffer = wav.decode(audioData).channelData[0];

    // Keep track of significant beats and their time instants
    const significantBeats = [];

    // Process audio and detect beats
    let timeInstant = 0;

    // Explicitly set the buffer size (should be a power of 2, e.g., 64, 128, 256, 512, etc.)
    const bufferSize = 512;

    // Create an AudioAnalyzer instance with the specified buffer size
    const analyzer = meyda.createMeydaAnalyzer({
      audioContext: new (window.AudioContext || window.webkitAudioContext)(),
      source: audioBuffer,
      bufferSize: bufferSize,
      featureExtractors: ['rms'],
      callback: (features) => {
        // Check if the current frame is a beat (you may need to adjust the condition)
        if (features.rms > 0.5) {
          console.log('Beat detected at time:', timeInstant);
          // You can emphasize the beat by modifying the audio frame here
        }

        // Increment time instant based on the duration of the audio frame
        timeInstant += bufferSize / meyda.sampleRate;
      },
    });

    // Start the analyzer
    analyzer.start();

    // Save the emphasized beats to a new file
    const wavData = wav.encode([audioBuffer], { sampleRate: meyda.sampleRate, float: true });
    fs.writeFileSync(outputFilePath, wavData);

    console.log('Beat detection and emphasis completed.');
    console.log('Significant beats:', significantBeats);
  } catch (error) {
    console.error('Error detecting beats:', error);
  }
}


// Replace 'input.wav' and 'output_emphasized.wav' with your input and output file paths
detectAndEmphasizeBeats('./sunflower.wav', 'output_emphasized.wav');