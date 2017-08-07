var streams, symSize;

function setup() {
	streams = [];
	symSize = 30;
	createCanvas(window.innerWidth, window.innerHeight);
	for (var i=0; i<floor(width/symSize); i++) {
		var stream = new Stream(i*symSize,random(0, height)-height);
		stream.generateSymbols();
		streams.push(stream);
	}
}

function draw() {
	background(0, 80);
	streams.forEach(function(stream) {
		stream.render();
	});
}

function Stream(x, y) {
	this.x = x;
	this.y = y;
	this.speed = round(random(15,25));
	this.symbols = [];

	this.generateSymbols = function() {
		var first = (round(random(0, 5)) == 1)?true:false;
		for (var i=0; i<(round(random(10,50))); i++) {
			var symbol = new Symbol(this.x, this.y-(i*symSize), this.speed, first);
			symbol.setRandomChar();
			this.symbols.push(symbol);
			first = false;
		}
	}

	this.render = function() {
		this.symbols.forEach(function(symbol) {
			symbol.render();
			symbol.update();
		});
	}
}

function Symbol(x, y, speed, first) 
{
	this.x = x;
	this.y = y;
	this.value;
	this.speed = speed;
	this.first = first;
	this.interval = round(random(8,15));

	this.setRandomChar = function() {
		this.value = String.fromCharCode(0x30A0 + round(random(0,96)));
	}

	this.update = function() {
		if (frameCount % this.interval == 0) 
			this.setRandomChar();
		this.y += this.speed;
		this.y %= height;
	}

	this.render = function() {
		textSize(symSize);
		if (this.first)
			fill(200, 255, 200);
		else
			fill(0, 255, 70);
		text(this.value, this.x, this.y);
	}


}