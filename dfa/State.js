function State(x, y, num) {

	this.pos = createVector(x, y);
	this.r = radius;
	this.name = 'q' + num;
	this.menu = false;
	this.isInitial = false;
	this.isFinal = false;
	this.transitions = [];
	this.connectedStates = [];

	this.delete = function() {

		var pos = 0;

		for (var i=states.length-1; i>=0; i--) {
			if (states[i].name == this.name)
				pos = i;
			for (var j=states[i].transitions.length-1; j>=0; j--) {
				if (states[i].transitions[j].stateB.name == this.name)
					states[i].transitions.splice(j, 1);
			}

			for (var j=states[i].connectedStates.length-1; j>=0; j--) {
				if (states[i].connectedStates[j].name == this.name)
					states[i].connectedStates.splice(j, 1);
			}
		}

		states.splice(pos, 1);
	}

	this.show = function() {

		noFill();
		stroke(255);
		fill(200,200,50);
		ellipse(this.pos.x, this.pos.y, this.r, this.r);
		fill(55);
		stroke(55);
		textAlign(CENTER);
		textSize(15);
		text(this.name,this.pos.x, this.pos.y+5);

		if (this.menu) {
			noFill();
			textAlign(LEFT);
			fill(55);
			stroke(100);
			rect(this.pos.x+20, this.pos.y+20, 70, 50);
			textSize(12);
			fill(255);
			if (this.isInitial)
				text("[*] Initial", this.pos.x+30, this.pos.y+40);
			else
				text("[ ] Initial", this.pos.x+30, this.pos.y+40);
			if (this.isFinal)
				text("[*] Final", this.pos.x+30, this.pos.y+60);
			else
				text("[ ] Final", this.pos.x+30, this.pos.y+60);
			stroke(255,0,0);
			noFill();
			//rect(this.pos.x+20, this.pos.y+25, 70, 20);
			//rect(this.pos.x+20, this.pos.y+45, 70, 20);
		}

		if (this.isInitial) {
			noFill();
			stroke(255,255,255);
			triangle(this.pos.x-this.r/2, this.pos.y, this.pos.x-this.r/2-15, this.pos.y-15, this.pos.x-this.r/2-15, this.pos.y+15);
		}

		if (this.isFinal) {
			noFill();
			stroke(20);
			ellipse(this.pos.x, this.pos.y, this.r-5, this.r-5);
		}
	}

	this.setInitial = function() {

		if (this.isInitial) {
			this.isInitial = false;
			initialState = null;
			return;
		}
		else {
			if (initialState != null)
				initialState.isInitial = false;
			this.isInitial = true;
			initialState = this;
		}
	}
}
