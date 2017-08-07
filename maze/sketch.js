var w = window.innerWidth, h = window.innerHeight;

var cols, rows, cell_w, width, height, stroke_w, grid, current, stack, generated, solve;

function setup() {

	stroke_w = 2;
	width = 1260 + stroke_w;
	height = 600 + stroke_w;
	cell_w = 60;
	cols = floor(width/cell_w);
	rows = floor(height/cell_w);
	grid = [];
	stack = [];
	generated = false;
	solve = false;

	createCanvas(width, height);

	for (var j=0; j<rows; j++) {
		for (var i=0; i<cols; i++) {
			grid.push(new Cell(i,j));
		}
	}

	current = grid[0];
	stack.push(current);

}

function draw() {

	background(55);

	for (var i=0; i < grid.length; i++) {
		grid[i].show();
	}
	for (var i=0; i < grid.length; i++) {
		grid[i].drawLine();
	}

	if (!generated) {
		if (stack.length > 0) {
			current.visited = true;
			current.highlight();
			var next = current.checkNeighbours();
			if (next) {
				next.visited = true;
				removeWalls(current, next);
				stack.push(next);
				current.paths.push(next);
				next.paths.push(current);
				current = next;
			}
			else {
				current = stack.pop();
			}
		} else {
			generated = true;
			current = grid[0];
			grid[0].walls[3] = false;
			grid[grid.length-1].walls[1] = false;
			stack.push(current);
		}
	}
	else if (solve) {
		if (current != grid[grid.length-1]) {
			if (stack.length > 0) {
				current.lineTo = null;
				current.revisited = true;
				var next = current.checkNeighbours();
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
	var x = a.i - b.i;

	if (x === 1) {
		a.walls[3] = false;
		b.walls[1] = false;
	}
	else if (x == -1) {
		a.walls[1] = false;
		b.walls[3] = false;
	}

	var y = a.j - b.j;

	if (y == 1) {
		a.walls[0] = false;
		b.walls[2] = false;
	}
	else if (y == -1) {
		a.walls[2] = false;
		b.walls[0] = false;
	}

}

function getIndex(i, j) {
	if (i < 0 || j < 0 || i > cols-1 || j > rows-1) return -1;
	return i + (j*cols);
}

function Cell(i, j) {
	this.i = i;
	this.j = j;
	this.walls = [true, true, true, true];
	this.visited = false;
	this.revisited = false;
	this.lineTo = false;
	this.paths = [];

	this.highlight = function() {

		fill(255, 100);
		rect(this.i*cell_w, this.j*cell_w, cell_w, cell_w);
	}

	this.checkNeighbours = function() {
		var neighbours = [];

		if (!generated) {

			var top = grid[getIndex(this.i, this.j-1)];
			var right = grid[getIndex(this.i+1, this.j)];
			var bottom = grid[getIndex(this.i, this.j+1)];
			var left = grid[getIndex(this.i-1, this.j)];

			if (top && !top.visited) {
				neighbours.push(top);
			}
			if (right && !right.visited) {
				neighbours.push(right);
			}
			if (bottom && !bottom.visited) {
				neighbours.push(bottom);
			}
			if (left && !left.visited) {
				neighbours.push(left);
			}
		}
		else {
			for (var i=0; i<this.paths.length; i++)
				if (!this.paths[i].revisited)
					neighbours.push(this.paths[i]);
		}

		if (neighbours.length > 0) {
			var r = floor(random(0, neighbours.length));
			return neighbours[r];
		} else return undefined;
	}

	this.drawLine = function() {

		if (this.lineTo != null) {
			var x = this.i*cell_w + stroke_w/2 + cell_w/2,
				y = this.j*cell_w + stroke_w/2 + cell_w/2,
				a = this.lineTo.i*cell_w + stroke_w/2 + cell_w/2,
				b = this.lineTo.j*cell_w + stroke_w/2 + cell_w/2;

			stroke(255);
			strokeWeight(stroke_w);
			line(x, y, a, b);
		}
	}

	this.show = function() {
		var x = this.i * cell_w + stroke_w/2,
			y = this.j * cell_w + stroke_w/2;


		if (!this.visited) {
			fill(255, 100, 70);
		}
		else fill(55);
		noStroke();
		rect(x, y, cell_w, cell_w);

		stroke(255, 100, 70);
		strokeWeight(stroke_w);

		if (this.walls[0]) {
			line(x, y, x+cell_w, y);
		}
		if (this.walls[1]) {
			line(x+cell_w, y, x+cell_w, y+cell_w);
		}
		if (this.walls[2]) {
			line(x+cell_w, y+cell_w, x, y+cell_w);
		}
		if (this.walls[3]) {
			line(x, y+cell_w, x, y);
		}

	}
}