import { audioInit, audioUpdate } from './audio.js';
import { renderUpdate } from './render.js';


function loop() {
  let freqData = audioUpdate();
  renderUpdate(freqData);
  
  requestAnimationFrame(loop);
}

function init(file) {
  console.log("Uploading file");

  if (!file) return;
  // console.log(file)
  let fileBlob = URL.createObjectURL(file);

  document.getElementById("upload").style.display = "none";

  audioInit(fileBlob);
  requestAnimationFrame(loop);
}

// Uploading the file is the trigger to start

// Drag and Drop upload
document.getElementById("upload").addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  init(file);
});

// Manual upload
document.getElementById("file").addEventListener("change", (e) => {
  e.preventDefault();
  // console.log(e);
  const file = e.target.files[0];
  init(file);
});