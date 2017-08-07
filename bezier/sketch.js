var points, paths, selected;

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);
	points = [];
	paths = [];
	selected = null;
	radius = 40;
}

function draw() {
	background(60);
	for(var i=0; i<paths.length; i++) {
		paths[i].render();
	}
	for(var i=0; i<points.length; i++) {
		points[i].render();
	}
}

function Path(pointA, pointB) {
	this.pointA = pointA.pos;
	this.pointC = pointB.pos;
	this.pointB = createVector((this.pointA.x + this.pointC.x) / 2, (this.pointA.y + this.pointC.y) / 2);

	this.render = function() {
		noFill();
		stroke(200);
		beginShape();
		for(var t=0; t<=1.05; t+=0.05) {
			var x = (1-t)*((1-t)*this.pointA.x + t*this.pointB.x) + t*((1-t)*this.pointB.x + t*this.pointC.x);
			var y = (1-t)*((1-t)*this.pointA.y + t*this.pointB.y) + t*((1-t)*this.pointB.y + t*this.pointC.y);
			vertex(x,y);
		}
		endShape();

	}

	this.mouseOver = function() {
		return (mouseX > this.pointB.x && mouseX < this.pointB.x+30 && mouseY > this.pointB.y && mouseY < this.pointB.y+30);
	}
}

function Point(x,y,r) {
	this.pos = createVector(x, y);
	this.r = r;

	this.render = function() {
		fill(250,90,80);
		stroke(50);
		
		ellipse(this.pos.x, this.pos.y, this.r, this.r);
	}

	this.mouseOver = function() {

	}
}