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

document.addEventListener('click', function(event) {
  if(osc == null) {
    osc = ac.createOscillator();

    osc.connect(gainNode);
    osc.start();

    whiteNoise.connect(biquadFilter);
  }
});

class Sequencer {
  constructor({seq, offset, update}) {
    this.seq = seq;
    this.offset = offset;
    this.update = update;
    this.index = 0;
    this.lastT = 0;
  }
}

const seq0 = new Sequencer({
  seq: [2, 3, 4, 0, 2, 0, 4, 5],//, 2, 3, 4, 0, 2, 0, 4, 5],
  offset: [0.1, 0.1, 0.3, 0.1, 0.1, 0.3, 0.1, 0.1],
  update: (t, self) => {
    if(Math.floor(t/100+self.offset[self.index]) - Math.floor(self.lastT/100+self.offset[(self.index+self.offset.length-1)%self.offset.length]) > 0) {
      self.lastT = t;
      if(osc) {
        osc.stop();
        osc.disconnect();
        osc = ac.createOscillator();
      
        osc.type = 'square';
        osc.connect(gainNode);
      
        osc.start();
        osc.frequency.value = 400 + self.seq[self.index] / 6 * 3000;
        if(self.seq[self.index] > 0)
          gainNode.gain.value = 0.3 * masterGain;
        else
          gainNode.gain.value = 0;
        self.index = (self.index + 1) % self.seq.length;
        gainNode.gain.setTargetAtTime(0, ac.currentTime, 0.075);
  
        if(Math.random() > 0.85) {
          if(Math.random() > 0.1)
            self.seq[self.index] = Math.floor(Math.random()*4) + 1;
          else self.seq[self.index] = 0;
          self.offset[self.index] = Math.floor(Math.random() * 4) * 0.1;
        }
      }
    }  }
})

const seq1 = new Sequencer({
  seq: [1, 1, 0, 1, 1, 0, 1, 1],
  offset: [0.1, 0.1, 0.3, 0.1, 0.1, 0.3, 0.1, 0.1],
  update: (t, self) => {
    if(Math.floor(t/100+self.offset[self.index]) - Math.floor(self.lastT/100+self.offset[(self.index+7)%8]) > 0) {
      self.lastT = t;
      if(whiteNoise) {
        if(self.seq[self.index] > 0)
          gainNode2.gain.value = 0.3 * masterGain;
        else
          gainNode2.gain.value = 0;
        self.index = (self.index + 1) % self.seq.length;
        gainNode2.gain.setTargetAtTime(0, ac.currentTime, 0.075);
        biquadFilter.frequency.setValueAtTime(1500, ac.currentTime);
        biquadFilter.gain.setValueAtTime(25, ac.currentTime);
        if(Math.random() > 0.85) {
          if(Math.random() > 0.5)
            self.seq[self.index] = 1;
          else self.seq[self.index] = 0;
          self.offset[self.index] = Math.floor(Math.random() * 4) * 0.1;
        }
      }
    }
  }
})

setInterval(() => {
  let d = new Date();
  let t = d.getTime();

  seq0.update(t, seq0);
  seq1.update(t, seq1);
}, 5);

// Camera Properties
let camera_angle = 0;
const camera_range = -10;
const camera_speed = 0.05 * Math.PI / 180;
const camera_target = new THREE.Vector3(0, 0, 0);

const plane_width = 1.8;
const plane_height = 1.8 * 240/320;
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
scene.fog = new THREE.FogExp2( 0x000000, 0.05 );

let camera;
{
    const camera_focal = 70;
    const camera_near = 0.1;
    const camera_far = 50;
    // Set some camera defaults
    camera = new THREE.PerspectiveCamera(camera_focal, window.innerWidth / window.innerHeight, camera_near, camera_far);
    camera.position.set(0, camera_range, 1);
    camera.lookAt(camera_target);
}

scene.add(new THREE.AmbientLight(0xffffff));

// Add directional light
const light_spot_positions = [{ x: -2, y: -2, z: 1.5 },{ x: 3, y: 1, z: 1.5 }]
for(let i = 0; i < 2; i++) {
    let spot_light = new THREE.SpotLight(0xDDDDDD, 0.5);
    spot_light.position.set(light_spot_positions[i].x, light_spot_positions[i].y, light_spot_positions[i].z);
    spot_light.target = scene;
    spot_light.castShadow = true;
    spot_light.receiveShadow = true;
    spot_light.shadow.camera.near = 0.5;
    spot_light.shadow.mapSize.width = 1024 * 2; // default is 512
    spot_light.shadow.mapSize.height = 1024 * 2; // default is 512	
    scene.add(spot_light);
}

const tile_material = new THREE.MeshLambertMaterial({ color: 0xdddddd });

for(let i = -5; i <= 5; i++) {
    for(let j = -5; j <= 5; j++) {
        {
            const plane_geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
            const plane_mesh = new THREE.Mesh(plane_geometry, tile_material);
            plane_mesh.position.set(j * 2, i * 2, -1);
            plane_mesh.receiveShadow = true;
            scene.add(plane_mesh);
        }
    }
}
for(let i = -2.5; i <= 2.5; i++) {
    for(let j = -2.5; j <= 2.5; j++) {
        if(Math.random() > 0.75) {
            const box_geometry = new THREE.BoxGeometry(0.25, 0.25, 3);
            const box_mesh = new THREE.Mesh(box_geometry, tile_material);
            box_mesh.castShadow = true;
            box_mesh.receiveShadow = true;
            box_mesh.position.set(j * 2, i * 2, 0.5);
            scene.add(box_mesh);
        }
    }
}

let line;
const MAX_POINTS = 500;
let drawCount;
let tween = 0;

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

function updatePositions() {
  tween = seq0.seq[seq0.index] * 0.5 + 0.5 * tween;
	let positions = line.geometry.attributes.position.array;

	let x = y = z = index = 0;

	for ( let i = 0, l = MAX_POINTS; i < l; i ++ ) {
		x = Math.cos(i*0.1+drawCount*0.1) * 0.2 * tween;
		z = Math.sin(i*0.1+drawCount*0.1) * 0.2 * tween;
		y = 0;

		positions[ index ++ ] = x;//*0.01+0.99*positions[ index ];
		positions[ index ++ ] = y;//*0.01+0.99*positions[ index ];
		positions[ index ++ ] = z;//*0.01+0.99*positions[ index ];


	}

}

// Render loop
const render = () => {
    camera_angle += camera_speed;
    camera.position.x = Math.cos(camera_angle) * camera_range;
    camera.position.y = Math.sin(camera_angle) * camera_range;
    camera.up.set(0, 0, 1);
    camera.lookAt(camera_target);

    drawCount = ( drawCount + 1 ) % MAX_POINTS;

    line.geometry.setDrawRange( 0, MAX_POINTS );
  
  
    // periodically, generate new data
    updatePositions();
    line.geometry.attributes.position.needsUpdate = true; // required after the first render
    line.material.color.setHSL( 0.7, 1, 0.5 );
  
    requestAnimationFrame(render);

    renderer.render(scene, camera);
};

render();

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
