var client = io("http://localhost:3000");
var current_description = "cyton_daisy"
// document.getElementById('simulated').hidden = true

document.getElementById("clickMe").onclick = selection;
document.getElementById("clickMe2").onclick = end_session_msg;

function selection(){
	var element_sel=document.querySelector('#board_choice');
	if(element_sel.value==="select"){
		window.alert("Please select a board before starting the stream.");
		return
	}
	console.log("Starting");
	var board_selection=element_sel.value;
	client.emit(board_selection)
}
function end_session_msg(){
	client.emit("stop");
}
function hide_descriptions(value){
	var original = document.getElementById(current_description);
	original.style.visibility= "hidden";
	original.hidden=true;
	if(value != 'select'){
		current_description=value;
		var current = document.getElementById(current_description);
		current.style.visibility= "visible";
		current.hidden=false;
	}
	// console.log(t1, typeof t1, t2, typeof t2)
}