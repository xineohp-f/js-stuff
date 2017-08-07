function Transition(stateA, stateB) {

	this.stateA = stateA;
	this.stateB = stateB;
	this.letter = '';
	this.curve = 0;

	for (var i=0; i<this.stateA.transitions.length; i++) {
		if (this.stateA.transitions[i].stateB.name == this.stateB.name) {
			this.stateA.transitions[i].addLetter();
			return;
		}
	}

	for (var j=0; j<this.stateB.connectedStates.length; j++) {
		if (this.stateA == this.stateB.connectedStates[j]) { 
		for (var i=0; i<this.stateB.transitions.length; i++) {
			if (this.stateB.transitions[i].stateB == this.stateA) {
				this.stateB.transitions[i].curve = 1;
				this.curve = -1;
			}
		}
	}
	}

	this.stateA.transitions.push(this);
	this.stateA.connectedStates.push(this.stateB);

	this.addLetter = function() {
		value = prompt("Enter transition alphabet");
		if (value != null) {
			this.letter += ',' + value;
		}
	}

	this.getLetter = function() {

		value = prompt("Enter transition alphabet");
		if (value != null) {
			this.letter = value;
		}
		else {
			for (var i=this.stateA.transitions.length-1; i>=0; i--) {
				if (this == this.stateA.transitions[i]) {
					this.stateA.transitions.splice(i, 1);
				}
			}
		}
	}

	/*
	this.show = function() {

		var px = this.stateA.pos.x,
			py = this.stateA.pos.y,
			qx = this.stateB.pos.x,
			qy = this.stateB.pos.y;

		var rx = (px + qx) / 2,
			ry = py;

		stroke(255);
		noFill();
		arc(rx, ry, qx-px, 20, PI, TWO_PI);


	}
	*/
	
	this.show = function() {

		if (this.letter == '') {
			this.getLetter();
			return;
		}

		if (this.stateA == this.stateB) {

			var svx = this.stateA.pos.x + radius/2*cos(14*PI/8),
				svy = this.stateA.pos.y + radius/2*sin(14*PI/8),
				fvx = this.stateA.pos.x + radius/2*cos(10*PI/8),
				fvy = this.stateA.pos.y + radius/2*sin(10*PI/8),
				dfx = (fvx - svx)/100,
				dfy = (fvy - svy)/100,
				vy = 2,
				posx, posy;
		}
		else {

			var svx = this.stateA.pos.x,
				svy = this.stateA.pos.y,
				fvx = this.stateB.pos.x,
				fvy = this.stateB.pos.y,
				posx, posy;

			var dx = fvx-svx,
				dy = fvy-svy;

			svx += radius/2*cos(atan2(dy,dx));
			svy += radius/2*sin(atan2(dy,dx));
			if (this.curve == 0) {
				fvx -= radius/2*cos(atan2(dy,dx));
				fvy -= radius/2*sin(atan2(dy,dx));
			}
			else {
				fvx -= radius/2*cos(atan2(dy,dx)+0.5);
				fvy -= radius/2*sin(atan2(dy,dx)+0.5);
			}

			var vy = this.curve,
				dfx = (fvx - svx)/100,
				dfy = (fvy - svy)/100;
		}

		noFill();
		stroke(255);
		beginShape();

		vertex(svx, svy);
		for (var i=1; i<99; i++) {
			svx += dfx;
			svy += dfy;
			if (abs(this.stateA.pos.x - this.stateB.pos.x) < abs(this.stateA.pos.y - this.stateB.pos.y))
				svx -= vy;
			else svy -= vy;
			if (i == 51) {
				vy *= -1;
				posx = svx;
				posy = svy;
			}
			else {
				if (i > 51) {
					vy *= 1.05;
				}
				else {
					vy *= 0.95;
				}
			}
			vertex(svx, svy);				
		}
		vertex(fvx, fvy);

		endShape();

		stroke(255);
		fill(255);
		textSize(11);
		textAlign(CENTER);
		if (abs(this.stateA.pos.x - this.stateB.pos.x) < abs(this.stateA.pos.y - this.stateB.pos.y))
			posx -= 10;
		else posy -= 10;
		text(this.letter,posx, posy);

		push();
		var delx = fvx - svx;
		var dely = fvy - svy;
		translate(fvx, fvy);
		rotate(3*PI/2+atan2(dely, delx));
		fill(255);
		triangle(-6, -6, 0, 0, 6, -6);
		pop();
	}
	
}
