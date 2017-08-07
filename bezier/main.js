window.onload = function() {
	var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		width = canvas.width = window.innerWidth,
		height = canvas.height = window.innerHeight;

	var points = [],
		paths = [],
		pointA = pointB = null,
		makingPath = false,
		mouseX = mouseY = null,
		dragging = false,
		selectedPoint = null;

	document.addEventListener("mousedown", mousePressed);

	draw();

	function mousePressed(evt) {
		evt.preventDefault();
		for (var i=0; i<points.length; i++) {
			if (utils.circlePointCollision(evt.clientX, evt.clientY, points[i])) {
				pointA = points[i];
				mouseX = evt.clientX;
				mouseY = evt.clientY;
				makingPath = true;
				document.addEventListener("mousemove", mouseDragged);
				document.addEventListener("mouseup", mouseUp);
			}
		}

		for (var i=0; i<paths.length; i++) {
			if (utils.circlePointCollision(evt.clientX, evt.clientY, paths[i].midPoint)) {
				selectedPoint = paths[i].midPoint;
				dragging = true;
				document.addEventListener("mousemove", mouseDragged);
				document.addEventListener("mouseup", mouseUp);
			}
		}

		if(!(pointA || selectedPoint)) {
			points.push(point.create(evt.clientX, evt.clientY, 20));
		}
	}

	function mouseDragged(evt) {
		if (pointA) {
			mouseX = evt.clientX;
			mouseY = evt.clientY;
		}
		if (selectedPoint) {
			selectedPoint.x = evt.clientX;
			selectedPoint.y = evt.clientY;
		}
	}

	function mouseUp(evt) {
		if (pointA) {
			for (var i=0; i<points.length; i++) {
				if (utils.circlePointCollision(evt.clientX, evt.clientY, points[i])) {
					pointB = points[i];
					if (pointA != pointB) {
						paths.push(path.create(pointA, pointB));
					}
				}
			}
			makingPath = false;
			pointA = pointB = null;
		}

		if (selectedPoint) {
			selectedPoint.x = evt.clientX;
			selectedPoint.y = evt.clientY;
			selectedPoint = null;
		}

		document.removeEventListener("mousemove", mouseDragged);
		document.removeEventListener("mouseup", mouseUp);
	}

	function draw() {
		ctx.clearRect(0, 0, width, height);

		for (var i=0; i<paths.length; i++) {
			var pt = paths[i];
			ctx.strokeStyle = "#888";
			ctx.moveTo(pt.pointA.x, pt.pointA.y);
			for (var t=0; t<=1; t+=0.05) {
				var p = pt.bezierTo(t);
				ctx.lineTo(p.x, p.y);
				ctx.moveTo(p.x, p.y);
			}
			ctx.lineTo(pt.pointB.x, pt.pointB.y);
			ctx.stroke();

			ctx.fillStyle = "#ad1";
			ctx.beginPath();
			ctx.arc(pt.midPoint.x, pt.midPoint.y, pt.midPoint.radius, 0, Math.PI * 2, false);
			ctx.fill();
		}

		if (makingPath) {
			ctx.strokeStyle = "#888";
			ctx.moveTo(pointA.x, pointA.y);
			ctx.lineTo(mouseX, mouseY);
			ctx.stroke();
		}

		for (var i=0; i<points.length; i++) {
			var pt = points[i];
			ctx.beginPath();
			ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2, false);
			ctx.fillStyle = "#ccff33";
			ctx.strokeStyle = "#888";
			ctx.fill();
			ctx.stroke();
		}

		

		requestAnimationFrame(draw);
	}
}

var point = {
	x: 0,
	y: 0,
	radius: 0,

	create: function(x, y, r) {
		var obj = Object.create(this);
		obj.x = x;
		obj.y = y;
		obj.radius = r;
		return obj;
	}
}

var path = {
	pointA: null,
	pointB: null,
	midPoint: null,

	create: function(a, b) {
		var obj = Object.create(this);
		obj.pointA = a;
		obj.pointB = b;
		obj.midPoint = point.create((a.x + b.x) / 2, (a.y + b.y) / 2, 5);
		return obj;
	},

	bezierTo: function(t) {
		var x = (1-t)*((1-t)*this.pointA.x + t*this.midPoint.x) + t*((1-t)*this.midPoint.x + t*this.pointB.x);
		var y = (1-t)*((1-t)*this.pointA.y + t*this.midPoint.y) + t*((1-t)*this.midPoint.y + t*this.pointB.y);
		
		return {
			x: x,
			y: y
		};
	}
}