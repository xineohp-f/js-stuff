var w = window.innerWidth, h = window.innerHeight;

var grid, cell_w, c_width, c_height, h_width, h_height, size, current, stack, generated, solve;

function setup() {

	cell_w = 30;
	grid = [];
	stack = [];
	c_width = 600;
	c_height = 600;
	h_width = cell_w * 2;
	h_height = Math.sqrt(3)/2*h_width;
	generated = false;
	solve = false;

	createCanvas(c_width, c_height);

	size = floor(height/cell_w/4),
		x = -size,
		z = -size;

	while(x <= size) {
		var y = z;
		while (y <= -z) {
			grid.push(new Hex(x, y));
			y+=2;
		}
		x+=1;
		
		if (x > 0)
			z+= 1
		else z-=1
	}


	current = grid[0];
	stack.push(current);
}

function draw() {
	background(55);
	translate(c_width/2, c_height/2);

	for (var i=0; i<grid.length; i++) {
		grid[i].show();
	}
	for (var i=0; i<grid.length; i++) {
		grid[i].drawLine();
	}

	if (!generated) {
		if (stack.length > 0) {
			current.visited = true;
			current.highlight();
			var next = current.getNeighbors();
			if (next) {

				next.visited = true;
				removeWalls(current, next);
				current.paths.push(next);
				next.paths.push(current);
				stack.push(next);
				current = next;
			}
			else {
				current.lineTo = null;
				current = stack.pop();
			}
		} else {
			generated = true;
			current = grid[0];
			stack.push(current);
			grid[0].walls[2] = false;
			grid[grid.length-1].walls[5] = false;
		}
	}
	else if (solve) {
		if (current != grid[grid.length-1]) {
			if (stack.length > 0) {
				current.lineTo = null;
				current.revisited = true;
				var next = current.getNeighbors();
				if (next) {
					if (stack[stack.lenght-1] != current)
						stack.push(current);
					next.revisited = true;
					stack.push(next);
					current.lineTo = next;
					current = next;
				} else {
					current = stack.pop();
				}
			} else {
				solve = false;
			}
		}
	}
}

function mousePressed() {
	solve = true;
}

function removeWalls(a, b) {

	if (a.x == b.x) {
		if (a.y > b.y) {
			a.walls[3] = false;
			b.walls[0] = false;
		}
		else {
			a.walls[0] = false;
			b.walls[3] = false;
		}
	}
	if (a.x > b.x) {
		if (a.y > b.y) {
			a.walls[2] = false;
			b.walls[5] = false;
		}
		else {
			a.walls[1] = false;
			b.walls[4] = false;
		}
	}
	if (a.x < b.x) {
		if (a.y > b.y) {
			a.walls[4] = false;
			b.walls[1] = false;
		}
		else {
			a.walls[5] = false;
			b.walls[2] = false;
		}
	}
}

function getIndex(i, j) {

	if (i<-size || i>size || j<-size*2 || j > size*2 || abs(i)+abs(j) > 2*size) return -1;

	var k = 0;
	for (var ii=0; ii<size+i; ii++) {
		if (ii<=size)
			k += size+ii+1;
		else k += size+(2*size-ii);
	}
	k += floor(size + (j+i)/2);
	if (i > 0)
		k -= 1;
	
	return k;
}

function Hex(i, j) {
	this.x = i;
	this.y = j;
	this.i = i*3/4;
	this.j = j*1/2;
	this.walls = [true, true, true, true, true, true];
	this.visited = false;
	this.revisited = false;
	this.lineTo = null;
	this.paths = [];

	this.highlight = function() {
		fill(255);
		ellipse(this.i*h_width, this.j*h_height, 5, 5);
	}

	this.getNeighbors = function() {

		var neighbours = [];

		if (!generated) {

			var t = grid[getIndex(this.x, this.y-2)];
			var rt = grid[getIndex(this.x+1, this.y-1)];
			var rb = grid[getIndex(this.x+1, this.y+1)];
			var b = grid[getIndex(this.x, this.y+2)];
			var lt = grid[getIndex(this.x-1, this.y-1)];
			var lb = grid[getIndex(this.x-1, this.y+1)];

			if (t && !t.visited)
			neighbours.push(t);
			if (rt && !rt.visited)
				neighbours.push(rt);
			if (rb && !rb.visited)
				neighbours.push(rb);
			if (b && !b.visited)
				neighbours.push(b);
			if (lt && !lt.visited)
				neighbours.push(lt);
			if (lb && !lb.visited)
				neighbours.push(lb);
		}
		else {
			for (var i=0; i<this.paths.length; i++) {
				if (!this.paths[i].revisited)
					neighbours.push(this.paths[i]);
			}
		}
		

		if (neighbours.length > 0) {
			var r = floor(random(0, neighbours.length));
			return neighbours[r];
		} else return undefined;
	}

	this.corners = function(i) {

		return createVector((this.i*h_width)+cell_w*cos(PI/180*60*i), (this.j*h_height)+cell_w*sin(PI/180*60*i));
	}

	this.show = function() {

		var x = this.i*cell_w,
			y = this.j*cell_w;

		var points = [];
		for (var i=0; i<6; i++)
			points.push(this.corners(i+1));

		if (this.visited) {
			fill(55);
		}
		else {
			fill(255, 100, 80);
		}
		noStroke();
		beginShape();
		for (var i=0; i<6; i++)
			vertex(points[i].x, points[i].y);
		endShape();

		stroke(255, 100, 80);
		strokeWeight(2);
		for (var i=0; i<6; i++)
			if (this.walls[i])
				line(points[i].x, points[i].y, points[(i+1)%6].x, points[(i+1)%6].y);
		
	}
	this.drawLine = function() {
		if (this.lineTo != null) {		
			stroke(255);
			strokeWeight(2);
			line(this.i*h_width, this.j*h_height, this.lineTo.i*h_width, this.lineTo.j*h_height);
		}
	}
}