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
function update_plots(x, y, div_list, index){
	Plotly.react( div_list[index], [{
	x: x,
	y: y }], {
	margin: { t: 0 } } );
}
function initialize_plots(div_list){
	for(let i=0; i<div_list.length; i++){
		Plotly.newPlot( div_list[i], [{
				x: [1, 2, 3, 4, 5],
				y: [1, 2, 4, 8, 16]}], {
			margin: { t: 0 } } );
	}
}
// function prepare_and_start_msg(){
// 	console.log("Starting");
// 	client.emit("start");
// }

function fastSpotLight(spotLight, x, y, z){
	spotLight.position.set( x, y, z);
	spotLight.angle = Math.PI/128;
	spotLight.penumbra = .5;
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 5;
	spotLight.shadow.camera.far = 5;
	spotLight.shadow.camera.fov = 5;	
	scene.add( spotLight );
}
function gradual_spotlight_color(data){
	// let start_time = new Date();
	var default_orange = [255, 0, 0];
	var default_blue = [0,198,255];
	var spotlight_array = [];
	for(var i=0; i<data.length; i++){
		let current_loop_data=data[i][data.length];
		// There are some magic numbers here so let me explain.  The first if statement is simple if the eeg datapoint is above 0.5:
		// normalize that range to 0 to 1 and subtract the resulting normalized value by 1 this is because we want the higher numbers to be more orange
		// and multiply that value by the difference between default orange and 255 so as the number goes down it gets whiter
		// The second if statement does not subtract by 1 because the smaller the number the more blue it should be.
		if(current_loop_data >= 0.5){
			var orange_percent = 2.0*(current_loop_data-0.5);
			var inv_per = 1-orange_percent;
			var orange_diff = [255-default_orange[0], 205-default_orange[1], 89-default_orange[2]];

			// setRGB does not 0 to 255, it takes 0 to 1.  So another normalization occurs... 
			// should really just make a helper function for this...
			let red = (default_orange[0]+inv_per*orange_diff[0])/(255);
			let green = (default_orange[1]+inv_per*orange_diff[1])/(255);
			let blue = (default_orange[2]+inv_per*orange_diff[2])/(255);
			spotlight_array.push([red, 
				green, 
				blue]);
		} else if (current_loop_data < 0.5){
			var blue_percent = (2.0*current_loop_data);
			var blue_diff = [80-default_blue[0], 211-default_blue[1], 255-default_blue[2]];

			// setRGB does not take 0 to 255, it takes 0 to 1.  So another normalization occurs... 
			// should really just make a helper function for this...
			let red = (default_blue[0]+blue_percent*blue_diff[0])/(255.0);
			let green = (default_blue[1]+blue_percent*blue_diff[1])/(255.0);
			let blue = (default_blue[2]+blue_percent*blue_diff[2])/(255.0); 
			spotlight_array.push([red, 
				green, 
				blue]);
		}
	}
	return spotlight_array
}
function update_spotlights(color_array){
	let start_time = new Date();
	Fp1.color.setRGB(color_array[0][0],color_array[0][1],color_array[0][2]);
	Fp2.color.setRGB(color_array[1][0],color_array[1][1],color_array[1][2]);
	C3.color.setRGB(color_array[2][0],color_array[2][1],color_array[2][2]);
	C4.color.setRGB(color_array[3][0],color_array[3][1],color_array[3][2]);
	P7.color.setRGB(color_array[4][0],color_array[4][1],color_array[4][2]);
	P8.color.setRGB(color_array[5][0],color_array[5][1],color_array[5][2]);
	O1.color.setRGB(color_array[6][0],color_array[6][1],color_array[6][2]);
	O2.color.setRGB(color_array[7][0],color_array[7][1],color_array[7][2]);
	F7.color.setRGB(color_array[8][0],color_array[8][1],color_array[8][2]);
	F8.color.setRGB(color_array[9][0],color_array[9][1],color_array[9][2]);
	F3.color.setRGB(color_array[10][0],color_array[10][1],color_array[10][2]);
	F4.color.setRGB(color_array[11][0],color_array[11][1],color_array[11][2]);
	T7.color.setRGB(color_array[12][0],color_array[12][1],color_array[12][2]);
	T8.color.setRGB(color_array[13][0],color_array[13][1],color_array[13][2]);
	P3.color.setRGB(color_array[14][0],color_array[14][1],color_array[14][2]);
	P4.color.setRGB(color_array[15][0],color_array[15][1],color_array[15][2]);
	let elapsed_time = new Date();
	elapsed_time = elapsed_time.getMilliseconds()-start_time.getMilliseconds();
	console.log(elapsed_time);
}

var plot_list=document.getElementsByClassName('Brainwaves');
// var amp_plot=document.getElementsByClassName('amp');

// initialize_plots(amp_plot);
initialize_plots(plot_list);

var client = io("http://localhost:3000");
const scene = new THREE.Scene();
console.log(scene)
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
// Doing it this way has cost me dearly, but I do not feel like fixing this now. hip hip horray for repeated code.
const Fp1 = new THREE.SpotLight( "rgb({},{},{})".format("255", "255", "255"), intensity);
const Fp2 = new THREE.SpotLight( "rgb({},{},{})".format("255", "255", "255"), intensity);
const C3 = new THREE.SpotLight( "rgb({},{},{})".format("255", "255", "255"), intensity);
const C4 = new THREE.SpotLight( "rgb({},{},{})".format("255", "255", "255"), intensity);
const P7 = new THREE.SpotLight( "rgb({},{},{})".format("255", "255", "255"), intensity);
const P8 = new THREE.SpotLight( "rgb({},{},{})".format("255", "255", "255"), intensity);
const O1 = new THREE.SpotLight( "rgb({},{},{})".format("255", "255", "255"), intensity);
const O2 = new THREE.SpotLight( "rgb({},{},{})".format("255", "255", "255"), intensity);
const F7 = new THREE.SpotLight( "rgb({},{},{})".format("255", "255", "255"), intensity);
const F8 = new THREE.SpotLight( "rgb({},{},{})".format("255", "255", "255"), intensity);
const F3 = new THREE.SpotLight( "rgb({},{},{})".format("255", "255", "255"), intensity);
const F4 = new THREE.SpotLight( "rgb({},{},{})".format("255", "255", "255"), intensity);
const T7 = new THREE.SpotLight( "rgb({},{},{})".format("255", "255", "255"), intensity);
const T8 = new THREE.SpotLight( "rgb({},{},{})".format("255", "255", "255"), intensity);
const P3 = new THREE.SpotLight( "rgb({},{},{})".format("255", "255", "255"), intensity);
const P4 = new THREE.SpotLight( "rgb({},{},{})".format("255", "255", "255"), intensity);






fastSpotLight(Fp1, 3, 15, 8.2);
fastSpotLight(Fp2, -3, 15, 8.2);
fastSpotLight(C3, 4, 15, 0);
fastSpotLight(C4, -4, 15, 0);
fastSpotLight(P7, 10, 15, -2);
fastSpotLight(P8, -10, 15, -2);
fastSpotLight(O1, 3, 15, -7);
fastSpotLight(O2, -3, 15, -7);
fastSpotLight(F7, 6, 15, 6.2);
fastSpotLight(F8, -6, 15, 6.2);
fastSpotLight(F3, 2, 15, 4.7);
fastSpotLight(F4, -2, 15, 4.7);
fastSpotLight(T8, 10, 10, 3);
fastSpotLight(T7, -10, 10, 3);
fastSpotLight(P3, 3.5, 15, -4);
fastSpotLight(P4, -3.5, 15, -4);



renderer.setSize(innerWidth/2, innerHeight/1.5); 	
document.querySelector('#test').appendChild( renderer.domElement);

renderer.render(scene, camera);
camera.position.y= 5;
controls.update();

// Events

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
	}
	if(data_array_history[0].length>1000){
		
		for(let i=0; i<args.data.length; i++){
			data_array_history[i]=data_array_history[i].slice(0, 1000);
			console.log("Here", data_array_history[i].length);
		}
	}
	console.log("Length: ", data_array_history[0].length);
	for(let i=0; i<args.data.length; i++){
		let temp_data=Array.from(args.data[i]);
		data_array_history[i]=temp_data.concat(data_array_history[i]);
	}
	console.log(data_array_history)
	function async_func_call(time){
		// Set Timeout is here because I can't figure out how to just have it run as it is... oh well
		// Having a millisecond delay doesn't hurt
		return new Promise(resolve=>setTimeout(resolve, time));
	}


	for(let i=0; i<plot_list.length; i++){
		async_func_call(1).then(()=>update_plots([...Array(data_array_history[i].length).keys()], data_array_history[i], plot_list, i));
	}
	

	let start_time = new Date();
	// async_func_call(1).then(()=>{
	// 	update_plots(args.frequency, args.amplitude[0], amp_plot, 0);

	// 	// Doing this all at once massively improves performance
	// 	// Plotly.addTraces(amp_plot[0], [
	// 	// 	{y: args.amplitude[1]},
	// 	// 	{y: args.amplitude[2]},
	// 	// 	{y: args.amplitude[3]},
	// 	// 	{y: args.amplitude[4]},
	// 	// 	{y: args.amplitude[5]},
	// 	// 	{y: args.amplitude[6]},
	// 	// 	{y: args.amplitude[7]},
	// 	// 	{y: args.amplitude[8]},
	// 	// 	{y: args.amplitude[9]},
	// 	// 	{y: args.amplitude[10]},
	// 	// 	{y: args.amplitude[11]},
	// 	// 	{y: args.amplitude[12]},
	// 	// 	{y: args.amplitude[13]},
	// 	// 	{y: args.amplitude[14]},
	// 	// 	{y: args.amplitude[15]}
	// 	// ]);
	// });
	let elapsed_time = new Date();
	elapsed_time = elapsed_time.getMilliseconds()-start_time.getMilliseconds();

	var spotlight_array=gradual_spotlight_color(args.data);

	try{
		update_spotlights(spotlight_array);
	}
	catch(error){
		console.error(error);
	}
})
window.addEventListener('resize', function() {
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.setSize(width/2,height/1.5);
	camera.aspect = (width/2)/(height/1.5);
	camera.updateProjectionMatrix()
});
document.getElementById("clickMe").onclick = selection;
document.getElementById("clickMe2").onclick = end_session_msg;


function selection(){
	console.log("Starting");
	var element_sel=document.querySelector('#board_choice');
	var board_selection=element_sel.value;
	client.emit(board_selection)
}
function request_eeg_data(){
	client.emit("send_data");
}
function end_session_msg(){
	client.emit("stop");
}
function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}

function animate(){
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();