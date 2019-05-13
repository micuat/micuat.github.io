const ac = new AudioContext();
var osc = null;
var gainNode = ac.createGain();
var gainNode2 = ac.createGain();

var bufferSize = 2 * ac.sampleRate,
    noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate),
    output = noiseBuffer.getChannelData(0);
for (var i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
}

// https://noisehack.com/generate-noise-web-audio-api/
var whiteNoise = ac.createBufferSource();
whiteNoise.buffer = noiseBuffer;
whiteNoise.loop = true;
whiteNoise.start(0);

gainNode.connect(ac.destination);
gainNode.gain.value = 0;
gainNode2.connect(ac.destination);
gainNode2.gain.value = 0;

// var distortion = ac.createWaveShaper();
// distortion.connect(gainNode);

// function makeDistortionCurve(amount) {
//   var k = typeof amount === 'number' ? amount : 50,
//     n_samples = 44100,
//     curve = new Float32Array(n_samples),
//     deg = Math.PI / 180,
//     i = 0,
//     x;
//   for ( ; i < n_samples; ++i ) {
//     x = i * 2 / n_samples - 1;
//     curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
//   }
//   return curve;
// };
// function makeDistortionCurve(amount) {
//   var k = amount,
//       n_samples = typeof sampleRate === 'number' ? sampleRate : 44100,
//       curve = new Float32Array(n_samples),
//       deg = Math.PI / 180,
//       i = 0,
//       x;
//   for ( ; i < n_samples; ++i ) {
//       x = i * 2 / n_samples - 1;
//       curve[i] = (3 + k)*Math.atan(Math.sinh(x*0.25)) / (Math.PI + k * Math.abs(x));
//   }
//   return curve;
// }

// distortion.curve = makeDistortionCurve(400);
// distortion.oversample = '4x';

var biquadFilter = ac.createBiquadFilter();
biquadFilter.connect(gainNode2);

document.addEventListener('click', function(event) {
  if(osc == null) {
    osc = ac.createOscillator();

    osc.connect(gainNode);
    osc.start();

    whiteNoise.connect(biquadFilter);
  }
});

var seq = [2, 3, 4, 0, 2, 0, 4, 5];//, 2, 3, 4, 0, 2, 0, 4, 5];
var offset = [0.1, 0.1, 0.3, 0.1, 0.1, 0.3, 0.1, 0.1];
var index = 0;
var lastT = 0;
var lastT2 = 0;

var seq2 = [1, 1, 0, 1, 1, 0, 1, 1];
var offset2 = [0.1, 0.1, 0.3, 0.1, 0.1, 0.3, 0.1, 0.1];
var index2 = 0;

setInterval(() => {
  let d = new Date();
  let t = d.getTime();
  if(Math.floor(t/100+offset[index]) - Math.floor(lastT/100+offset[(index+offset.length-1)%offset.length]) > 0) {
    lastT = t;
    if(osc) {
      osc.stop();
      osc.disconnect();
      osc = ac.createOscillator();
    
      // osc.type = 'square';
      osc.connect(gainNode);
    
      osc.start();
      osc.frequency.value = 400 + seq[index] / 6 * 3000;
      if(seq[index] > 0)
        gainNode.gain.value = 0.3;
      else
        gainNode.gain.value = 0;
      index = (index + 1) % seq.length;
      gainNode.gain.setTargetAtTime(0, ac.currentTime, 0.075);

      if(Math.random() > 0.85) {
        if(Math.random() > 0.1)
          seq[index] = Math.floor(Math.random()*4) + 1;
        else seq[index] = 0;
        offset[index] = Math.floor(Math.random() * 4) * 0.1;
      }
    }
  }

  if(Math.floor(t/100+offset2[index2]) - Math.floor(lastT2/100+offset2[(index2+7)%8]) > 0) {
    lastT2 = t;
    if(whiteNoise) {
      if(seq2[index2] > 0)
        gainNode2.gain.value = 0.3;
      else
        gainNode2.gain.value = 0;
      index2 = (index2 + 1) % seq2.length;
      gainNode2.gain.setTargetAtTime(0, ac.currentTime, 0.075);
      biquadFilter.frequency.setValueAtTime(1500, ac.currentTime);
      biquadFilter.gain.setValueAtTime(25, ac.currentTime);
      if(Math.random() > 0.85) {
        if(Math.random() > 0.5)
          seq2[index2] = 1;
        else seq2[index2] = 0;
        offset2[index2] = Math.floor(Math.random() * 4) * 0.1;
      }
    }
  }
}, 5);
