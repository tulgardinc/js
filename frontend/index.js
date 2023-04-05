var osc = new Tone.Oscillator(440, "sine");
osc.partials = new Array(8).fill(0).map(() => Math.random());

var pitchShift = new Tone.PitchShift();
var vol = new Tone.Volume().toMaster();
osc.connect(vol);
//create an autofilter and start it's LFO
//const autoFilter = new Tone.AutoFilter().toMaster();
//var lowPassFreq = new Tone.Signal(300, Tone.Frequency);
//autoFilter.set({
//frequency: lowPassFreq.value,
//type: "sine",
//});

pitchShift.connect(vol);
osc.connect(pitchShift);

var triggered = false;

var pitch = 450;

document.onclick = () => {
  triggered = !triggered;
  if (triggered) {
    osc.start();
  } else {
    osc.stop();
  }
};

async function receiveVals() {
  const response = await fetch("http://localhost:7070/vals");
  const vals = await response.json();
  pitchShift.pitch += parseInt(vals.y);
  vol.volume.value += parseInt(vals.x);
  //lowPassFreq.value += parseInt(vals.x);
  //autoFilter.set({
  //  frequency: lowPassFreq.value,
  //});
  //console.log(lowPassFreq.value);
}

window.addEventListener("load", function () {
  // Your document is loaded.
  var fetchInterval = 100; // 5 seconds.

  // Invoke the request every 5 seconds.
  setInterval(receiveVals, fetchInterval);
});
