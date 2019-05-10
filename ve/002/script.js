// Camera Properties
let camera_angle = 0;
const camera_range = -10;
const camera_speed = 0.05 * Math.PI / 180;
const camera_target = new THREE.Vector3(0, 0, 0);

const plane_width = 1.8;
const plane_height = 1.8 * 240/320;
const plane_position = { x: 0, y: 0, z: 0 };

class Sketch {
    constructor({color, words}) {
        this.colors = [];
        {
            let cs = color.split("-");
            for(let i in cs) {
                this.colors.push(parseInt("0x" + cs[i]));
            }
        }
        this.words = words;
    }

    color (i) {
        return this.colors[i];
    }

    mesh () {
        var triangles = 100;
        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array( triangles * 3 * 3 );
        var normals = new Float32Array( triangles * 3 * 3 );
        var colors = new Float32Array( triangles * 3 * 3 );
        var color = new THREE.Color();
        var n = 800, n2 = n / 2;	// triangles spread in the cube
        var d = 250, d2 = d / 2;	// individual triangle size
        var pA = new THREE.Vector3();
        var pB = new THREE.Vector3();
        var pC = new THREE.Vector3();
        var cb = new THREE.Vector3();
        var ab = new THREE.Vector3();
        for ( var i = 0; i < positions.length; i += 9 ) {
            // positions
            var x = Math.random() * n - n2;
            var y = Math.random() * n - n2;
            var z = Math.random() * n - n2;
            var ax = x + Math.random() * d - d2;
            var ay = y + Math.random() * d - d2;
            var az = z + Math.random() * d - d2;
            var bx = x + Math.random() * d - d2;
            var by = y + Math.random() * d - d2;
            var bz = z + Math.random() * d - d2;
            var cx = x + Math.random() * d - d2;
            var cy = y + Math.random() * d - d2;
            var cz = z + Math.random() * d - d2;
            positions[ i ] = ax;
            positions[ i + 1 ] = ay;
            positions[ i + 2 ] = az;
            positions[ i + 3 ] = bx;
            positions[ i + 4 ] = by;
            positions[ i + 5 ] = bz;
            positions[ i + 6 ] = cx;
            positions[ i + 7 ] = cy;
            positions[ i + 8 ] = cz;
            // flat face normals
            pA.set( ax, ay, az );
            pB.set( bx, by, bz );
            pC.set( cx, cy, cz );
            cb.subVectors( pC, pB );
            ab.subVectors( pA, pB );
            cb.cross( ab );
            cb.normalize();
            var nx = cb.x;
            var ny = cb.y;
            var nz = cb.z;
            normals[ i ] = nx;
            normals[ i + 1 ] = ny;
            normals[ i + 2 ] = nz;
            normals[ i + 3 ] = nx;
            normals[ i + 4 ] = ny;
            normals[ i + 5 ] = nz;
            normals[ i + 6 ] = nx;
            normals[ i + 7 ] = ny;
            normals[ i + 8 ] = nz;
            // colors
            var vx = ( x / n ) + 0.5;
            var vy = ( y / n ) + 0.5;
            var vz = ( z / n ) + 0.5;
            let ci = Math.floor(vx*5);
            color.setHex(this.colors[ci]);
            colors[ i ] = color.r;
            colors[ i + 1 ] = color.g;
            colors[ i + 2 ] = color.b;
            colors[ i + 3 ] = color.r;
            colors[ i + 4 ] = color.g;
            colors[ i + 5 ] = color.b;
            colors[ i + 6 ] = color.r;
            colors[ i + 7 ] = color.g;
            colors[ i + 8 ] = color.b;
        }
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
        geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
        geometry.computeBoundingSphere();
        var material = new THREE.MeshPhongMaterial( {
            color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
            side: THREE.DoubleSide, vertexColors: THREE.VertexColors
        } );
        let mesh = new THREE.Mesh( geometry, material );
        mesh.scale.set(0.001,0.001,0.001);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }
}

const sketches = [
    new Sketch({color: "ea8c55-c75146-bb0a21-81171b-540804", words: ["lava", "blood", "emergence", "脈"]}),
    new Sketch({color: "d6e681-fcfcfc-f6f930-2f2f2f-000000", words: ["orbit", "axis", "stability", "回転"]}),
    new Sketch({color: "104f55-93e1d8-32746d-01200f-011502", words: ["rubber", "sticky", "執着"]}),
    new Sketch({color: "668586-82aeb1-93c6d6-a7acd9-9e8fb2", words: ["metal", "unaligned", "rotation", "齟齬"]}),
    new Sketch({color: "78c0e0-449dd1-192bc2-150578-0e0e52", words: ["curve", "cold", "sting", "貫通"]}),
    new Sketch({color: "ffcab1-ecdcb0-c1d7ae-8cc084-968e85", words: ["landscape", "artificial", "calm", "整然"]}),
];

// New renderer
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x247ba0, 1);

// Add the renderer to the DOM
document.body.appendChild(renderer.domElement);

// Create the scene
let scene = new THREE.Scene();

let camera;
{
    const camera_focal = 70;
    const camera_near = 0.1;
    const camera_far = 50;
    // Set some camera defaults
    camera = new THREE.PerspectiveCamera(camera_focal, window.innerWidth / window.innerHeight, camera_near, camera_far);
    camera.position.set(0, camera_range, 0);
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

const textureVig = new THREE.TextureLoader().load( "vig.png" );
const tile_material = new THREE.MeshLambertMaterial({ color: 0xdddddd, map: textureVig });

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

const plane_geometry = new THREE.PlaneGeometry(plane_width, plane_height, 40, 40);
const plane_materials = [];

for(let i = 0; i < sketches.length; i++) {
    plane_materials[i] = new THREE.MeshStandardMaterial({ color: 0xffffff, displacementBias: 0.5, displacementScale: -0.5 });
    // plane_materials[i] = new THREE.MeshStandardMaterial({ color: sketches[i].color(0), displacementBias: 0.5, displacementScale: -0.5 });
}

for(let i = -2.5; i <= 2.5; i++) {
    for(let j = -2; j <= 2; j++) {
        if(Math.random() > 0.875) {
            const box_geometry = new THREE.BoxGeometry(2, 0.125, 3);
            const box_mesh = new THREE.Mesh(box_geometry, tile_material);
            box_mesh.castShadow = true;
            box_mesh.receiveShadow = true;
            box_mesh.position.set(j * 2, i * 2, 0.5);
            scene.add(box_mesh);

            {
                const index = Math.floor(Math.random() * plane_materials.length);
                const plane_mesh = new THREE.Mesh(plane_geometry, plane_materials[index]);
                plane_mesh.position.set(j * 2, i * 2 - 0.1, 0.5);
                plane_mesh.rotation.x = Math.PI / 2;
                // plane_mesh.rotation.y = Math.PI / 2;
                plane_mesh.receiveShadow = false;//true;
                scene.add(plane_mesh);
                const mesh = sketches[index].mesh();
                mesh.rotation.x = Math.PI / 2;
                mesh.position.set(j * 2, i * 2 - 0.5, 0.5);
                scene.add(mesh)
            }
            {
                const index = Math.floor(Math.random() * plane_materials.length);
                const plane_mesh = new THREE.Mesh(plane_geometry, plane_materials[index]);
                plane_mesh.position.set(j * 2, i * 2 + 0.1, 0.5);
                plane_mesh.rotation.x = Math.PI / 2;
                plane_mesh.rotation.y = -Math.PI;
                plane_mesh.receiveShadow = false;//true;
                scene.add(plane_mesh);
                const mesh = sketches[index].mesh();
                mesh.rotation.x = Math.PI / 2;
                mesh.rotation.y = -Math.PI;
                mesh.position.set(j * 2, i * 2 + 0.5, 0.5);
                scene.add(mesh)
            }
        }
    }
}

for(let i = -2; i <= 2; i++) {
    for(let j = -2.5; j <= 2.5; j++) {
        if(Math.random() > 0.875) {
            const box_geometry = new THREE.BoxGeometry(0.125, 2, 3);
            const box_mesh = new THREE.Mesh(box_geometry, tile_material);
            box_mesh.castShadow = true;
            box_mesh.receiveShadow = true;
            box_mesh.position.set(j * 2, i * 2, 0.5);
            scene.add(box_mesh);

            {
                const index = Math.floor(Math.random() * plane_materials.length);
                const plane_mesh = new THREE.Mesh(plane_geometry, plane_materials[index]);
                plane_mesh.position.set(j * 2 - 0.1, i * 2, 0.5);
                plane_mesh.rotation.x = Math.PI / 2;
                plane_mesh.rotation.y = -Math.PI / 2;
                plane_mesh.receiveShadow = false;//true;
                scene.add(plane_mesh);
                const mesh = sketches[index].mesh();
                mesh.rotation.x = Math.PI / 2;
                mesh.rotation.y = -Math.PI / 2;
                mesh.position.set(j * 2 - 0.5, i * 2, 0.5);
                scene.add(mesh)
            }
            {
                const index = Math.floor(Math.random() * plane_materials.length);
                const plane_mesh = new THREE.Mesh(plane_geometry, plane_materials[index]);
                plane_mesh.position.set(j * 2 + 0.1, i * 2, 0.5);
                plane_mesh.rotation.x = Math.PI / 2;
                plane_mesh.rotation.y = Math.PI / 2;
                plane_mesh.receiveShadow = false;//true;
                scene.add(plane_mesh);
                const mesh = sketches[index].mesh();
                mesh.rotation.x = Math.PI / 2;
                mesh.rotation.y = Math.PI / 2;
                mesh.position.set(j * 2 + 0.5, i * 2, 0.5);
                scene.add(mesh)
            }
        }
    }
}

{
    const box_geometry = new THREE.BoxGeometry(11.5, 11.5, 0.125);
    const box_mesh = new THREE.Mesh(box_geometry, tile_material);
    box_mesh.castShadow = true;
    box_mesh.receiveShadow = true;
    box_mesh.position.set(0, 0, 2);
    scene.add(box_mesh);
}

// Render loop
const textures = [];
const render = function () {
    for(tex of textures)
        tex.needsUpdate = true;

    camera_angle += camera_speed;
    camera.position.x = Math.cos(camera_angle) * camera_range;
    camera.position.y = Math.sin(camera_angle) * camera_range;
    camera.up.set(0, 0, 1);
    camera.lookAt(camera_target);

    requestAnimationFrame(render);

    renderer.render(scene, camera);
};


const checkExist = setInterval(function() {
    let failed = true;
    for(let i = 0; i < sketches.length; i++) {
        if (document.getElementById('webm_element' + i) != null) {
            textures[i] = new THREE.Texture(document.getElementById('webm_element' + i));
            if(textures[i].image.width < 256)
                textures[i].minFilter = THREE.NearestFilter;
            plane_materials[i].map = textures[i];
            plane_materials[i].displacementMap = textures[i];
            failed = false;
        }
    }
    if (failed == false) {
        render();
        clearInterval(checkExist);
    }
 }, 100);