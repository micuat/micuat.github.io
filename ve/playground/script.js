const ac = new AudioContext();
let osc = null;
const gainNode = ac.createGain();
const gainNode2 = ac.createGain();

const bufferSize = 2 * ac.sampleRate,
    noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate),
    output = noiseBuffer.getChannelData(0);
for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
}

// https://noisehack.com/generate-noise-web-audio-api/
const whiteNoise = ac.createBufferSource();
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

const biquadFilter = ac.createBiquadFilter();
biquadFilter.connect(gainNode2);

document.addEventListener('click', function(event) {
  if(osc == null) {
    osc = ac.createOscillator();

    osc.connect(gainNode);
    osc.start();

    whiteNoise.connect(biquadFilter);
  }
});

const seq = [2, 3, 4, 0, 2, 0, 4, 5];//, 2, 3, 4, 0, 2, 0, 4, 5];
const offset = [0.1, 0.1, 0.3, 0.1, 0.1, 0.3, 0.1, 0.1];
let index1 = 0;
let lastT = 0;
let lastT2 = 0;

const seq2 = [1, 1, 0, 1, 1, 0, 1, 1];
const offset2 = [0.1, 0.1, 0.3, 0.1, 0.1, 0.3, 0.1, 0.1];
let index2 = 0;

setInterval(() => {
  let d = new Date();
  let t = d.getTime();
  if(Math.floor(t/100+offset[index1]) - Math.floor(lastT/100+offset[(index1+offset.length-1)%offset.length]) > 0) {
    lastT = t;
    if(osc) {
      osc.stop();
      osc.disconnect();
      osc = ac.createOscillator();
    
      osc.type = 'square';
      osc.connect(gainNode);
    
      osc.start();
      osc.frequency.value = 400 + seq[index1] / 6 * 3000;
      if(seq[index1] > 0)
        gainNode.gain.value = 0.3;
      else
        gainNode.gain.value = 0;
      index1 = (index1 + 1) % seq.length;
      gainNode.gain.setTargetAtTime(0, ac.currentTime, 0.075);

      if(Math.random() > 0.85) {
        if(Math.random() > 0.1)
          seq[index1] = Math.floor(Math.random()*4) + 1;
        else seq[index1] = 0;
        offset[index1] = Math.floor(Math.random() * 4) * 0.1;
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

{
// three.js animataed line using BufferGeometry

let renderer, scene, camera;

let line;
const MAX_POINTS = 500;
let drawCount;
let tween = 0;

init();
animate();

function init() {
	// renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	// scene
	scene = new THREE.Scene();

	// camera
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 0, 1000 );

	// geometry
	var geometry = new THREE.BufferGeometry();

	// attributes
	var positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
	geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

	// drawcalls
	drawCount = 2; // draw the first 2 points, only
	geometry.setDrawRange( 0, drawCount );

	// material
	var material = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 2 } );

	// line
	line = new THREE.Line( geometry,  material );
	scene.add( line );

	// update positions
	updatePositions();

}

// update positions
function updatePositions() {
  tween = seq[index1] * 0.5 + 0.5 * tween;
	let positions = line.geometry.attributes.position.array;

	let x = y = z = index = 0;

	for ( let i = 0, l = MAX_POINTS; i < l; i ++ ) {
		x = Math.cos(i*0.1+drawCount*0.1) * 50 * tween;
		y = Math.sin(i*0.1+drawCount*0.1) * 50 * tween;
		z = 0;

		positions[ index ++ ] = x;//*0.01+0.99*positions[ index ];
		positions[ index ++ ] = y;//*0.01+0.99*positions[ index ];
		positions[ index ++ ] = z;//*0.01+0.99*positions[ index ];


	}

}

// render
function render() {

	renderer.render( scene, camera );

}

// animate
function animate() {

	requestAnimationFrame( animate );

	drawCount = ( drawCount + 1 ) % MAX_POINTS;

	line.geometry.setDrawRange( 0, MAX_POINTS );


		// periodically, generate new data

		updatePositions();

		line.geometry.attributes.position.needsUpdate = true; // required after the first render

		line.material.color.setHSL( 0.7, 1, 0.5 );

	

	render();

}
}