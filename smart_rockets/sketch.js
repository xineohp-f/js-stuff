var w = window.innerWidth,
	h = window.innerHeight,
	RocketSize,
	population,
	lifespan,
	count,
	target,
	generation,
	maxHit,
	curHit,
	obstacles,
	mousepos,
	draglen,
	setTarget,
	addOb,
	delOb;

function setup() {
	RocketSize = 30;
	lifespan = 200;
	count = maxHit = curHit = 0;
	generation = 1;
	obstacles = [];
	setTarget = addOb = delOb = false;
	createCanvas(w,h);	
	population = new Population();
	target = createVector(w/2, 100);
}

function draw() {
	background(60);
	if(setTarget || addOb || delOb) population.show();
	else {
		population.run();
		count++;
		if (count > lifespan) {
			population.evaluate();
			population.selection();
			if(curHit > maxHit) maxHit = curHit;
			count = curHit = 0;
			generation++;
		}
	}
	stats();
	fill(100,230,140);
	noStroke();
	ellipse(target.x, target.y, 20, 20);
	for (var i=0; i<obstacles.length; i++) {
		obstacles[i].show();
	}
	noFill()
	stroke(100);
	if(draglen > 0 && addOb) rect(mousepos.x, mousepos.y, mouseX - mousepos.x, mouseY - mousepos.y);
	if(setTarget) canvas.style.cursor = "crosshair";
	else canvas.style.cursor = "default";
}

function changeTool(event) {

	switch (event.id) {
		case 'setTarget':
			setTarget = !setTarget;
			if(document.getElementById('setTarget').className != "selected") document.getElementById('setTarget').className = "selected";
			else document.getElementById('setTarget').className = "";
			document.getElementById('addOb').className = "";
			document.getElementById('delOb').className = "";
			addOb = delOb = false;
		break;
		case 'addOb':
			addOb = !addOb;
			if(document.getElementById('addOb').className != "selected") document.getElementById('addOb').className = "selected";
			else document.getElementById('addOb').className = "";
			document.getElementById('setTarget').className = "";
			document.getElementById('delOb').className = "";
			setTarget = delOb = false;
		break;
		case 'delOb':
			delOb = !delOb;
			if(document.getElementById('delOb').className != "selected") document.getElementById('delOb').className = "selected";
			else document.getElementById('delOb').className = "";
			document.getElementById('addOb').className = "";
			document.getElementById('setTarget').className = "";
			addOb = setTarget = false;
		break;
	}
}

function mousePressed() {
	mousepos = createVector(mouseX, mouseY);
	draglen = 0;
	if(delOb) deleteOb(mouseX, mouseY);
}

function mouseDragged() {
	draglen++;
}

function mouseReleased() {
	if (draglen >= 6 && addOb) {
		obstacles.push(new Obstacle(mousepos.x, mousepos.y, mouseX - mousepos.x, mouseY - mousepos.y));
	}
	draglen = 0;
	mousepos = null;
	if (setTarget && mouseX > 270 && mouseY > 200) {
		target.x = mouseX;
		target.y = mouseY;
	}
}

function deleteOb(x, y) {
	for (var i=0; i<obstacles.length; i++) {
		if (x > obstacles[i].pos.x && x < obstacles[i].pos.x + obstacles[i].width &&
			y > obstacles[i].pos.y && y < obstacles[i].pos.y + obstacles[i].height)
			obstacles.splice(i);
	}
}

function Obstacle(x, y, w, h) {
	this.pos = createVector(x,y);
	this.width = w;
	this.height = h;

	this.show = function() {
		noStroke();
		fill(100);
		rect(this.pos.x, this.pos.y, w, h);
	}
}

function stats() {
	document.getElementById('count').innerHTML = count;
	document.getElementById('generation').innerHTML = generation;
	document.getElementById('population').innerHTML = population.popsize;
	document.getElementById('curHit').innerHTML = curHit;
	document.getElementById('maxHit').innerHTML = maxHit;
}

function Population() {
	this.rockets = [];
	this.popsize = 30;
	this.matingPool = [];

	for (var i = 0; i < this.popsize; i++) {
		this.rockets[i] = new Rocket();
	}

	this.run = function() {
		for(var i = 0; i < this.popsize; i++) {
			this.rockets[i].update();
			this.rockets[i].show();
		}
	}

	this.show = function() {
		for(var i = 0; i < this.popsize; i++) {
			this.rockets[i].show();
		}
	}

	this.evaluate = function() {
		var maxFit = 0;
		for (var i=0; i<this.popsize; i++) {
			this.rockets[i].calcFitness();
			if (this.rockets[i].fitness > maxFit) maxFit = this.rockets[i].fitness;
		}
		this.matingPool = [];
		for (var i=0; i<this.popsize; i++) {
			var n = Math.ceil(this.rockets[i].fitness * 100);
			for (var j=0; j<n; j++) {
				this.matingPool.push(this.rockets[i]);
			}
		}
	}

	this.selection = function() {
		var newRockets = [];
		for (var i=0; i<this.popsize; i++) {
			var parentA = this.matingPool[floor(random(this.matingPool.length))].dna,
				parentB = this.matingPool[floor(random(this.matingPool.length))].dna;
			var child = parentA.crossOver(parentB);
			child.mutation();
			newRockets[i] = new Rocket(child);
		}
		this.rockets = newRockets;
	}
}

function DNA(genes) {
	if(genes) this.genes = genes;
	else {
		this.genes = [];
		for (var i=0; i<lifespan; i++) {
			this.genes[i] = p5.Vector.random2D();
			this.genes[i].setMag(0.3);
		}
	}

	this.crossOver = function(partner) {
		var newGenes = [],
			n = random(0, this.genes.length);
		for(var i=0; i<this.genes.length; i++) {
			if (i < n) newGenes[i] = this.genes[i];
			else newGenes[i] = partner.genes[i];
		}

		return new DNA(newGenes);
	}

	this.mutation = function() {
		for (var i=0; i<this.genes.length; i++) {
			if (random() < 0.01) {
				this.genes[i] = p5.Vector.random2D();
			}
		}
	}
}

function Rocket(dna) {
	this.pos = createVector(w/2, h);
	this.vel = createVector();
	this.acc = createVector();
	if(dna) this.dna = dna;
	else this.dna = new DNA();
	this.fitness = 0;
	this.completed = false;
	this.crashed = false;

	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.calcFitness = function() {
		var d = dist(this.pos.x, this.pos.y, target.x, target.y);
		this.fitness = map(d, 0, w, 1, 0);
		if (this.completed) this.fitness *= 8;
		if (this.crashed) this.fitness /= 8;
	}

	this.update = function() {
		if (dist(this.pos.x, this.pos.y, target.x, target.y) < 10) {
			if (!this.completed) curHit++;
			this.completed = true;
			this.pos = target;
		}

		for (var i=0; i<obstacles.length; i++) {
			if (this.pos.x >= obstacles[i].pos.x && this.pos.x <= obstacles[i].pos.x + obstacles[i].width &&
				this.pos.y >= obstacles[i].pos.y && this.pos.y <= obstacles[i].pos.y + obstacles[i].height)
				this.crashed = true;
		}

		if (this.pos.x > width || this.pos.x < 0 || this.pos.y < 0 || this.pos.y > height) this.crashed = true;

		if (!this.completed && !this.crashed) {
			this.applyForce(this.dna.genes[count]);
			this.vel.add(this.acc);	
			this.pos.add(this.vel);
			this.acc.mult(0);
		}
	}

	this.show = function() {
		push();
		translate(this.pos.x, this.pos.y);
		rotate(this.vel.heading());
		noStroke();
		fill(255, 150);
		triangle(0, RocketSize/5, 0, -RocketSize/5, RocketSize/1.5, 0);
		triangle(0, RocketSize/5-RocketSize/15, 0, RocketSize/5-2*RocketSize/15, -RocketSize/8, RocketSize/5-2*RocketSize/15);
		triangle(0, RocketSize/15-RocketSize/5, 0, 2*RocketSize/15-RocketSize/5, -RocketSize/8, 2*RocketSize/15-RocketSize/5);
		pop();
	}
}