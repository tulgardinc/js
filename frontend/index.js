var osc = new Tone.Oscillator(440, "sine");
var osc2 = new Tone.Oscillator(550, "sine");
osc.partials = new Array(8).fill(0).map(() => Math.random());
osc2.partials = new Array(8).fill(0).map(() => Math.random());

var pitchShift = new Tone.PitchShift().toMaster();
var pitchShift2 = new Tone.PitchShift().toMaster();

//var vol = new Tone.Volume().toMaster();
//osc.connect(vol);
//create an autofilter and start it's LFO
//const autoFilter = new Tone.AutoFilter().toMaster();
//var lowPassFreq = new Tone.Signal(300, Tone.Frequency);
//autoFilter.set({
//frequency: lowPassFreq.value,
//type: "sine",
//});

//pitchShift.connect(vol);
osc.connect(pitchShift);
osc2.connect(pitchShift2);

var triggered = false;

document.onclick = () => {
  triggered = !triggered;
  if (triggered) {
    osc.start();
    osc2.start();
  } else {
    osc.stop();
    osc2.stop();
  }
};

async function receiveVals() {
  const response = await fetch("http://localhost:7070/vals");
  const vals = await response.json();
  console.log(vals);
  if ((pitchShift.pitch += parseInt(vals.y) > 0)) {
    pitchShift.pitch += parseInt(vals.y);
  }
  if ((pitchShift2.pitch += parseInt(vals.x) > 0)) {
    pitchShift2.pitch += parseInt(vals.x);
  }

  //console.log(pitchShift.pitch.value, pitchShift2.pitch);

  //vol.volume.value += parseInt(vals.x);
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
