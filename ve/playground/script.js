const ac = new AudioContext();
let osc = null;
const gainNode = ac.createGain();
const gainNode2 = ac.createGain();

const masterGain = 0.0;

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

const biquadFilter = ac.createBiquadFilter();
biquadFilter.connect(gainNode2);

document.addEventListener('click', function (event) {
  if (osc == null) {
    osc = ac.createOscillator();

    osc.connect(gainNode);
    osc.start();

    whiteNoise.connect(biquadFilter);


    if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
      var constraints = { video: { width: 1280, height: 720, facingMode: 'user' } };
      navigator.mediaDevices.getUserMedia( constraints ).then( function ( stream ) {
        // apply the stream to the video element used in the texture
        video.srcObject = stream;
        video.play();
      } ).catch( function ( error ) {
        console.error( 'Unable to access the camera/webcam.', error );
      } );
    } else {
      console.error( 'MediaDevices interface not available.' );
    }
  }
});

class Sequencer {
  constructor({ seq, offset, update }) {
    this.seq = seq;
    this.offset = offset;
    this.updateImpl = update;
    this.index = 0;
    this.lastT = 0;
    this.tDeltaMillis = 500;

    this.randomAmount = 30;
    this.randomSeq = new Array(seq.length);
    for (let n = 0; n < this.randomAmount; n++) {
      this.randomSeq[n] = [];
      for (let i = 0; i < this.seq.length; i++) {
        this.randomSeq[n][i] = Math.floor(Math.random() * 16 - 8);
      }
    }
  }

  update(t) {
    let offset0 = this.offset[this.index];
    let offset1 = this.offset[(this.index - 1 + this.offset.length) % this.offset.length];
    let count0 = Math.floor(t / this.tDeltaMillis + offset0);
    let count1 = Math.floor(this.lastT / this.tDeltaMillis + offset1);
    if (count0 - count1 > 0) {
      this.lastT = t;
      this.index = (this.index + 1) % this.seq.length;
      this.updateImpl(this);
    }
  }

  getNote(t, i) {
    let offset0 = this.offset[this.index];
    let offset1 = this.offset[(this.index - 1 + this.offset.length) % this.offset.length];
    let tDiff = t - this.lastT;
    let tOffsetDiff = (1 - offset0 + offset1) * this.tDeltaMillis;
    let rate = EasingFunctions.easeInOutQuint(tDiff / tOffsetDiff);

    if (i == undefined) {
      let note1 = this.seq[this.index];
      let note0 = this.seq[(this.index - 1 + this.seq.length) % this.seq.length];
      return note0 * (1 - rate) + note1 * rate;
    }
    else {
      let note1 = this.randomSeq[i][this.index];
      let note0 = this.randomSeq[i][(this.index - 1 + this.seq.length) % this.seq.length];
      return note0 * (1 - rate) + note1 * rate;
    }
  }
}

const seq0 = new Sequencer({
  seq: [2, 3, 4, 0, 2, 0, 4, 5],//, 2, 3, 4, 0, 2, 0, 4, 5],
  offset: [0.0, 0.0, 0.25, 0.0, 0.0, 0.25, 0.25, 0.0],
  update: (self) => {
    if (osc) {
      osc.stop();
      osc.disconnect();
      osc = ac.createOscillator();

      // osc.type = 'square';
      osc.connect(gainNode);

      osc.start();
      osc.frequency.value = 400 + self.seq[self.index] / 6 * 3000;
      if (self.seq[self.index] > 0) {
        gainNode.gain.value = 0.3 * masterGain;
      }
      else {
        gainNode.gain.value = 0;
      }
      gainNode.gain.setTargetAtTime(0, ac.currentTime, 0.075);

      if (Math.random() > 0.85) {
        if (Math.random() > 0.1) {
          self.seq[self.index] = Math.floor(Math.random() * 4) + 1;
        }
        else {
          self.seq[self.index] = 0;
        }
        // self.offset[self.index] = Math.floor(Math.random() * 4) * 0.1;
      }
    }
  }
})

const seq1 = new Sequencer({
  seq: [1, 1, 0, 1, 1, 0, 1, 1],
  offset: [0.0, 0.25, 0.0, 0.0, 0.25, 0.0, 0.0, 0.25],
  update: (self) => {
    if (whiteNoise) {
      if (self.seq[self.index] > 0) {
        gainNode2.gain.value = 0.3 * masterGain;
      }
      else {
        gainNode2.gain.value = 0;
      }
      gainNode2.gain.setTargetAtTime(0, ac.currentTime, 0.075);
      biquadFilter.frequency.setValueAtTime(1500, ac.currentTime);
      biquadFilter.gain.setValueAtTime(25, ac.currentTime);
      if (Math.random() > 0.85) {
        if (Math.random() > 0.5) {
          self.seq[self.index] = 1;
        }
        else {
          self.seq[self.index] = 0;
        }
        self.offset[self.index] = Math.floor(Math.random() * 4) * 0.1;
      }
    }
  }
})

setInterval(() => {
  let d = new Date();
  let t = d.getTime();

  seq0.update(t);
  seq1.update(t);
}, 5);

// Camera Properties
let camera_angle = 0;
const camera_range = -10;
const camera_speed = 0.05 * Math.PI / 180;
const camera_target = new THREE.Vector3(0, 0, 0);

const plane_width = 1.8;
const plane_height = 1.8 * 240 / 320;
const plane_position = { x: 0, y: 0, z: 0 };

// New renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x247ba0, 1);

// Add the renderer to the DOM
document.body.appendChild(renderer.domElement);

// Create the scene
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.05);

let camera;
{
  const camera_focal = 70;
  const camera_near = 0.1;
  const camera_far = 50;
  // Set some camera defaults
  camera = new THREE.PerspectiveCamera(camera_focal, window.innerWidth / window.innerHeight, camera_near, camera_far);
  camera.position.set(0, camera_range, 4);
  camera.lookAt(camera_target);
}

scene.add(new THREE.AmbientLight(0xBBBBBB));

// Add directional light
const light_spot_positions = [{ x: -3, y: -3, z: 5.5 }, { x: 4, y: 2, z: 5.5 }]
const light_colors = [0xDDDDDD, 0xDDDDDD]
// const light_colors = [0x990000, 0x000099]
for (let i = 0; i < 2; i++) {
  let spot_light = new THREE.SpotLight(light_colors[i], 0.5);
  spot_light.position.set(light_spot_positions[i].x, light_spot_positions[i].y, light_spot_positions[i].z);
  spot_light.target = scene;
  spot_light.castShadow = true;
  spot_light.receiveShadow = true;
  spot_light.shadow.camera.near = 0.15;
  spot_light.shadow.mapSize.width = 1024 * 2; // default is 512
  spot_light.shadow.mapSize.height = 1024 * 2; // default is 512	
  scene.add(spot_light);
}

{
  fragmentShader = `
  #include <common>

  uniform vec3 iResolution;
  uniform float iTime;
  uniform sampler2D iChannel0;

  // By Daedelus: https://www.shadertoy.com/user/Daedelus
  // license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  #define TIMESCALE 0.25 
  #define TILES 8
  #define COLOR 0.7, 1.6, 2.8

  varying vec2 vUv;
  varying vec4 vPosition;

  void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv.x *= iResolution.x / iResolution.y;
    
    vec4 noise = texture2D(iChannel0, uv);
    fragColor = vec4(vec3(sin(vPosition.y * 100.0) * 0.5 + 0.5), 1.0);// * noise.r;
  }

  void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
  }
  `;
  vertexShader = `
    varying vec2 vUv;
    varying vec4 vPosition;
    void main() {
      vUv = uv;
      vPosition = modelViewMatrix * vec4( position, 1.0 );
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `;

  uniforms = {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector3(1, 1, 1) },
    // iChannel0: { value: texture },
  };
}

const textureVig = new THREE.TextureLoader().load("vig.png");
const tile_material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
});
const video = document.getElementById( 'video' );
const webcamTexture = new THREE.VideoTexture( video );
const floor_material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, map: webcamTexture });

const theBoxes0 = [];
const theBoxes1 = [];

{
  const plane_geometry = new THREE.PlaneGeometry(2 * 10, 2 * 10, 1, 1);
  const plane_mesh = new THREE.Mesh(plane_geometry, floor_material);
  // plane_mesh.position.set(j * 2, i * 2, -1);
  plane_mesh.position.set(0, 0, -1);
  plane_mesh.receiveShadow = true;
  scene.add(plane_mesh);
}


// for(let i = -5; i <= 5; i++) {
//     for(let j = -5; j <= 5; j++) {
//         {
//             const plane_geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
//             const plane_mesh = new THREE.Mesh(plane_geometry, floor_material);
//             plane_mesh.position.set(j * 2, i * 2, -1);
//             plane_mesh.receiveShadow = true;
//             scene.add(plane_mesh);
//         }
//     }
// }
for (let i = -2.5; i <= 2.5; i++) {
  for (let j = -2.5; j <= 2.5; j++) {
    if (Math.random() > 0.5 && theBoxes0.length < 30 && theBoxes1.length < 30) {
      const box_geometry = new THREE.BoxGeometry(0.25 * 8, 0.25 * 8, 0.25 * 0.25);
      const box_mesh = new THREE.Mesh(box_geometry, tile_material);
      box_mesh.castShadow = true;
      box_mesh.receiveShadow = true;
      box_mesh.position.set(j * 2, i * 2, Math.floor(Math.random() * 3));
      // scene.add(box_mesh);
      if (Math.random() > 0.5)
        theBoxes0.push(box_mesh);
      else
        theBoxes1.push(box_mesh);
    }
  }
}

let line;
const MAX_POINTS = 500;
// let drawCount;
let tween = 0;

// geometry
var geometry = new THREE.BufferGeometry();

// attributes
var positions = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
var indices = new Uint16Array(MAX_POINTS * 3); // 3 vertices per tri
geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setIndex(new THREE.BufferAttribute(indices, 1));

// drawcalls
// drawCount = 2; // draw the first 2 points, only
// geometry.setDrawRange(0, drawCount);

// material
var material = new THREE.MeshLambertMaterial({ color: 0xff0000 });

// line
line = new THREE.Mesh(geometry, material);
line.castShadow = true;
scene.add( line ); // hehe

// update positions
updatePositions(0);

function updatePositions(t) {
  let positions = line.geometry.attributes.position.array;
  let indices = line.geometry.index.array;

  let x = y = z = index = 0;

  // for (let i = 0; i < MAX_POINTS; i++) {
  //   // x = Math.cos(i * 0.1 + drawCount * 0.1) * 0.2 * tween;
  //   // z = Math.sin(i * 0.1 + drawCount * 0.1) * 0.2 * tween;
  //   // y = 0;

  //   if(i % 2 == 0) {
  //     iii = Math.floor(i / MAX_POINTS * 30);
  //     x = seq0.getNote(t, iii) * 0.5 ;
  //   }
  //   else {
  //     iii = Math.floor(i / MAX_POINTS * 30);
  //     x = seq1.getNote(t, iii) * 0.5;
  //   }
  //   x-=4.5;
  //   y = (i-25)*0.1;
  //   z = 0;// + i * 0.01;

  //   let d = 0.03;
  //   positions[index++] = x*0;
  //   positions[index++] = y;
  //   positions[index++] = z;

  //   positions[index++] = x + d;
  //   positions[index++] = y;
  //   positions[index++] = z;

  //   positions[index++] = x*0;
  //   positions[index++] = y + d;
  //   positions[index++] = z;

  //   positions[index++] = x + d;
  //   positions[index++] = y;
  //   positions[index++] = z;

  //   positions[index++] = x + d;
  //   positions[index++] = y + d;
  //   positions[index++] = z;

  //   positions[index++] = x*0;
  //   positions[index++] = y + d;
  //   positions[index++] = z;

  // }
  for (let i = 0; i < MAX_POINTS; i++) {
    // x = Math.cos(i * 0.1 + drawCount * 0.1) * 0.2 * tween;
    // z = Math.sin(i * 0.1 + drawCount * 0.1) * 0.2 * tween;
    // y = 0;

    if(i % 2 == 0) {
      iii = Math.floor(i / MAX_POINTS * 30);
      x = seq0.getNote(t, iii) * 0.5 ;
    }
    else {
      iii = Math.floor(i / MAX_POINTS * 30);
      x = seq1.getNote(t, iii) * 0.5;
    }

    indices[index] = index;
    positions[index++] = (i - MAX_POINTS/2)*0.1;
    indices[index] = index;
    positions[index++] = x+Math.random() * 1;
    indices[index] = index;
    positions[index++] = Math.random() * 2;
  }

}

// Render loop
const render = (time) => {
  camera_angle += camera_speed;
  camera.position.x = Math.cos(camera_angle) * camera_range;
  camera.position.y = Math.sin(camera_angle) * camera_range;
  camera.up.set(0, 0, 1);
  camera.lookAt(camera_target);

  line.geometry.setDrawRange(0, MAX_POINTS);

  let d = new Date();
  let t = d.getTime();

  // periodically, generate new data
  updatePositions(t);
  line.geometry.attributes.position.needsUpdate = true; // required after the first render
  line.material.color.setHSL(0.7, 1, 0.5);

  for (let i = 0; i < theBoxes0.length; i++) {
    theBoxes0[i].position.set(seq0.getNote(t, i), theBoxes0[i].position.y, theBoxes0[i].position.z);
  }
  for (let i = 0; i < theBoxes1.length; i++) {
    theBoxes1[i].position.set(seq1.getNote(t, i), theBoxes1[i].position.y, theBoxes1[i].position.z);
  }

  uniforms.iTime.value = time * 0.001;

  requestAnimationFrame(render);

  renderer.render(scene, camera);
};

render();

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
