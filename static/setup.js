import * as THREE from 'https://unpkg.com/three@0.149.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.149.0/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from 'https://unpkg.com/three@0.149.0/src/loaders/TextureLoader';
import { OrbitControls } from 'https://unpkg.com/three@0.149.0/examples/jsm/controls/OrbitControls.js';

// Please forgive me future reader, I am learning JS as I am doing this project.

// Stack overflow solution to making a format string in a similar vein to python's f-strings.  
// Beautifully convenient especially with the goofiness
// I'll be doing with colors



// Wacky functions
String.prototype.format = function () {
	var i = 0, args = arguments;
	return this.replace(/{}/g, function () {
	  return typeof args[i] != 'undefined' ? args[i++] : '';
	});
  };


var elements_of_buttons = document.getElementsByClassName("cyton_daisy_buttons");
var mouseover_listeners = [];
var mouseoff_listeners= [];
var number_of_nodes=elements_of_buttons.length;
var node_list = [];
var timeout_id=null;

function setup_new_buttons(classname){
	elements_of_buttons = document.getElementsByClassName("{}_buttons".format(classname));
	mouseover_listeners = [];
	mouseoff_listeners= [];
	number_of_nodes=elements_of_buttons.length;
	node_list = [];
	for (let i = 0; i<number_of_nodes; i++){
		node_list[i]=  new THREE.SpotLight( "rgb({},{},{})".format("255", "255", "255"), intensity);
	}

	for(let i = 0; i < elements_of_buttons.length; i++){
		// making listeners for each button
		mouseover_listeners[i] = elements_of_buttons[i].addEventListener("mouseover", (event)=>{
			if(timeout_id != null){
				clearTimeout(timeout_id);
			}
			for(let j = 0; j < node_list.length; j++){
				if(i===j){
					node_list[j].intensity=0.5;
				}else{
					node_list[j].intensity=0.01;
				}
			}
		});
		
		mouseoff_listeners[i] = elements_of_buttons[i].addEventListener("mouseout", (event)=>{
			timeout_id = setTimeout(() => {
				for(let j = 0; j < node_list.length; j++){
					node_list[j].intensity=0.5
				}
			}, 500);
		});
}}

setup_new_buttons("cyton_daisy");

function fastSpotLight(spotLight, x, y, z){
	spotLight.position.set( x, y, z);
	spotLight.angle = Math.PI/(128*2);
	spotLight.penumbra = .5;
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 5;
	spotLight.shadow.camera.far = 5;
	spotLight.shadow.camera.fov = 5;	
	scene.add( spotLight );
}

function spotlights_railed(data){
	let max_railed=Math.max(...data);
	console.log(max_railed)
	let color_array=[];
	for(let i=0; i<data.length; i++){
		if(data[i]==max_railed){
			color_array.push([255,0,0]);
		}else{
			color_array.push([0,255,0]);
		}
	}
	return color_array
}

function update_spotlights(color_array){
	for(let i=0; i<color_array.length; i++){
		node_list[i].color.setRGB(color_array[i][0],color_array[i][1],color_array[i][2]);
	}
}

var client = io("http://localhost:3000");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, (innerWidth/2)/(innerHeight/1.5), 0.2, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
const gltfLoader = new GLTFLoader();

// Body of Script

gltfLoader.load('/static/scene.gltf', function(gltf){
	const root = gltf.scene;
	scene.add(root);
console.log(gltf);
}, function(xhr){
	console.log((xhr.loaded/xhr.total * 100)+ "%loaded")
}, function(error){
	console.log("an error occured");
});


const texture = new THREE.TextureLoader().load( "static/lab_texture.JPG" );
texture.wrapS = THREE.ClampToEdgeWrapping;
texture.wrapT = THREE.ClampToEdgeWrapping;
// texture.repeat.set( 4, 4 );

scene.background = texture;

const ambient_light = new THREE.AmbientLight( 0xffffff ); // soft white light
ambient_light.intensity=0.25;
scene.add( ambient_light );

var intensity = 0.5;


fastSpotLight(node_list[0], 3, 15, 8.2);
fastSpotLight(node_list[1], -3, 15, 8.2);
fastSpotLight(node_list[2], 4, 15, 0);
fastSpotLight(node_list[3], -4, 15, 0);
fastSpotLight(node_list[4], 10, 15, -2);
fastSpotLight(node_list[5], -10, 15, -2);
fastSpotLight(node_list[6], 3, 15, -7);
fastSpotLight(node_list[7], -3, 15, -7);
fastSpotLight(node_list[8], 6, 15, 6.2);
fastSpotLight(node_list[9], -6, 15, 6.2);
fastSpotLight(node_list[10], 2, 15, 4.7);
fastSpotLight(node_list[11], -2, 15, 4.7);
fastSpotLight(node_list[12], 10, 10, 3);
fastSpotLight(node_list[13], -10, 10, 3);
fastSpotLight(node_list[14], 3.5, 15, -4);
fastSpotLight(node_list[15], -3.5, 15, -4);



renderer.setSize(innerWidth/2, innerHeight/1.5); 	
document.querySelector('#test').appendChild( renderer.domElement);

renderer.render(scene, camera);
camera.position.y = 5;
controls.update();

// Events
client.on('connect_error', function(err){
	console.log("Waiting for stream.")
});
function request_eeg_data(){
	client.emit("send_data");
}
client.on("startup_successful", (args)=>{
	console.log("hello?");
	console.log(args);
	delay(1000).then(() => request_eeg_data());
	
})
client.on("connect", () => {
	console.log("connected");
})


var data_array_history=[];
client.on("sent_data", (args) => {
	if (data_array_history.length==0){
		data_array_history=Array.from(args.data);
	} else if(data_array_history[0].length>1000){	
		for(let i=0; i<args.data.length; i++){
			data_array_history[i]=data_array_history[i].slice(0, 1000);
			console.log("Here", data_array_history[i].length);
		}
	}
	

	console.log("Length: ", data_array_history[0].length);
	for(let i=0; i<args.data.length; i++){
		let cancatenating_data=Array.from(args.data[i]);
		data_array_history[i]=cancatenating_data.concat(data_array_history[i]);
	}
	console.log(args.railed)

	var spotlight_array=spotlights_railed(args.railed);

	try{
		update_spotlights(spotlight_array);
	}
	catch(error){
		console.error(error);
	}
})
window.addEventListener( 'resize', function() {
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.setSize(width/2,height/1.5);
	camera.aspect = (width/2)/(height/1.5);
	camera.updateProjectionMatrix()
});

function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}

function animate(){
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();