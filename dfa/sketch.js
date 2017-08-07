var w = window.innerWidth,
	h = window.innerHeight;

var states,
	stateNum,
	radius,
	menuActive,
	initialState,
	selectedState,
	targetState,
	xx, xy, yx, yy,
	transitions,
	toolbox,
	selectedTool,
	controls;


function setup() {

	controls = ['Select', 'State', 'Transition', 'Delete'];
	setup_controls();

	createCanvas(w-300, h);
	prevRight();

	states = [];
	stateNum = 0;
	radius = 50;
	menuActive = null;
	initialState = null;
	selectedState = null;
	targetState = null;
	xx = xy = yx = yy = 0;
	transitions = [];
	selectedTool = 0;
}

function draw() {

	background(55);

	for (var i=0; i<states.length; i++) {
		states[i].show();
		for (var j=0; j<states[i].transitions.length; j++) {
			states[i].transitions[j].show();
		}
	}

	stroke(200);
	if (xx != 0 && yx != 0 && selectedTool == 2) line(xx, xy, yx, yy);
}

function mousePressed() {

	xx = mouseX;
	xy = mouseY;

	switch (mouseButton) {

		case LEFT:

			var curState = getTarget(mouseX, mouseY);
			if (curState == null)
				if (newStatePossible(mouseX, mouseY))
					states.push(new State(mouseX, mouseY, stateNum++));

			if (selectedTool == 3 && curState != null) {
				curState.delete();
			}

			if (menuActive) {
				menuActive.menu = false;
				menuActive = null;
			}
		break;

		case RIGHT:
			if (selectedTool == 0) {
				if (menuActive) {
					menuActive.menu = false;
					menuActive = null;
				}

				targetState = getTarget(mouseX, mouseY);
				if (targetState) {
					targetState.menu = true;
					menuActive = targetState;
				}
			}

		break;
	}
}

function mouseDragged() {

	yx = mouseX;
	yy = mouseY;

	if (selectedState != null && selectedTool == 0) {
		selectedState.pos.x = mouseX;
		selectedState.pos.y = mouseY;
	}
}

function mouseReleased() {

	xx = xy = yx = yy = 0;
	var sstate = selectedState;
	targetState = getTarget(mouseX, mouseY);
	if (targetState != null) {
		if(sstate != null && selectedTool == 2) 
			new Transition(sstate, targetState);
	}
	selectedState = null;
}

function newStatePossible(x, y) {

	if (selectedTool != 1) return false;
	var poss = true;

	for (var i=0; i<states.length; i++) {
		if (abs(states[i].pos.x -x) < radius && abs(states[i].pos.y - y) < radius) {
			poss = false;
		}
	}

	return poss;
}

function getTarget(x,y) {

	
	for (var i=0; i<states.length; i++) {
		if (states[i].menu) {
			if (states[i].pos.x+20 < x && states[i].pos.x+20+70 > x) {
				if (states[i].pos.y+25 < y && states[i].pos.y+45 > y ){
					states[i].setInitial();
					return states[i];
				}
				if (states[i].pos.y+45 < y && states[i].pos.y+65 > y){
					states[i].isFinal = !states[i].isFinal;
					return states[i];
				}
			}
		}
		if (abs(states[i].pos.x -x) < radius/2 && abs(states[i].pos.y - y) < radius/2) {
			if (selectedState)
				selectedState.isSelected = false;
			selectedState = states[i];
			return states[i];
		}
	}

	return null;
}

function updateTool(event) {

	var tools = document.getElementById('controls').children;
	tools[selectedTool].removeAttribute('class');
	event.setAttribute('class', 'active');
	selectedTool = event.value;
}

// prevent right-click context menu
function prevRight() {
	var c = document.getElementById('defaultCanvas0');
	if (c.addEventListener) {

		c.addEventListener('contextmenu', function(e) {
			e.preventDefault();
		});
	} else {
		c.attachEvent('oncontextmenu', function() {
			window.event.returnValue = false;
		});
	}
}


function setup_controls() {

	var el = document.createElement('div');
	el.setAttribute('id','container');

	// control box
	var nd = document.createElement('div');
	nd.setAttribute('id','controls')
	for (var i=0; i<controls.length; i++) {
		var b = document.createElement('button');
		b.setAttribute('id', 'toolBut');
		b.setAttribute('onclick', 'updateTool(this)');
		b.setAttribute('value', i);
		if (i==0) {
			b.setAttribute('class','active');
		}
		b.innerHTML = controls[i]; 
		nd.appendChild(b);
	}
	el.appendChild(nd);

	// string test
	nd = document.createElement('div');
	nd.setAttribute('id', 'stringTest');
	var a = document.createElement('b');
	a.innerHTML = "String Check";
	nd.appendChild(a);
	nd.appendChild(document.createElement('br'));
	a = document.createElement('input');
	a.setAttribute('type', 'text');
	a.setAttribute('id', 'string');
	nd.appendChild(a);
	nd.appendChild(document.createElement('br'));
	a = document.createElement('button');
	a.setAttribute('onclick', 'testString()');
	a.innerHTML = "Check";
	nd.appendChild(a);
	el.appendChild(nd);

	// string results
	nd = document.createElement('div');
	nd.setAttribute('id', 'stringResults');
	el.appendChild(nd);

	document.body.appendChild(el);
}


function testString() {

	if (initialState == null) {
		alert('No starting state!!');
		return;
	}

	var hasFinal = false;
	for (var i=0; i<states.length; i++) {
		if (states[i].isFinal) {
			hasFinal = true;
			break;
		}
	}

	if (!hasFinal) {
		alert('No final state!!');
		return;
	}

	var string = document.getElementById('string').value;

	var curState = initialState,
		i = 0;

	while (i < string.length && curState != null) {
		curState = doTransition(curState, string.substr(i++, 1));
	}

	if (curState && curState.isFinal) {
		//alert('Accepted!');
		document.getElementById('stringResults').innerHTML = '<br><p><b>'+string+' | '+'</b><b id="accept">Accepted!</b></p>' + document.getElementById('stringResults').innerHTML; 
	}
	else {
		//alert('Rejected!');
		document.getElementById('stringResults').innerHTML = '<br><p><b>'+string+' | '+'</b><b id="reject">Rejected!</b></p>' + document.getElementById('stringResults').innerHTML 
	}
}

function doTransition(state, char) {

	if (state != null) {
		for (var i=0; i<state.transitions.length; i++) {
			if (state.transitions[i].letter.indexOf(char) > -1)
				return state.transitions[i].stateB;
		}
		if (char == "") return state;
		else return null;
	}
}