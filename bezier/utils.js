var utils = {
	norm: function(val, min, max) {
		return (val - min) / (max - min);
	},

	lerp: function(val, min, max) {
		return (max - min) * val + min;
	},

	map: function(val, x1, y1, x2, y2) {
		return this.lerp(this.norm(val, x1, y1), x2, y2);
	},

	clamp: function(val, min, max) {
		return Math.max(Math.min(min, max), Math.min(Math.max(min,max), val));
	},

	degreesToRads: function(degrees) {
		return degrees / 180 * Math.PI;
	},

	radsToDegrees: function(radians) {
		return radians * 180 / Math.PI;
	},

	roundToPlaces: function(value, places) {
		var mult = Math.pow(10, places);
		return Math.round(value * mult) / mult;
	},

	roundToNearest: function(valuse, nearest) {
		return Math.round(value * nearest) / nearest;
	},

	randomRange: function(min, max) {
		return min + Math.random() * (max - min + 1);
	},

	distance: function(p0, p1) {
		var dx = p1.x - p0.x,
			dy = p1.y - p0.y;
		return Math.sqrt(dx * dx + dy * dy);
	},

	distanceXY: function(x0, y0, x1, y1) {
		var dx = x1 - x0,
			dy = y1 - y0;
		return Math.sqrt(dx * dx + dy * dy);
	},

	circleCollision: function(c0, c1) {
		return utils.distance(c0, c1) <= c0.radius + c1.radius;
	},

	circlePointCollision: function(x, y, circle) {
		return utils.distanceXY(x, y, circle.x, circle.y) < circle.radius;
	},

	rectPointCollision: function(x, y, rect) {
		return this.inRange(x, rect.x, rect.x + rect.width) && this.inRange(y, rect.y, rect.y + rect.height);
	},

	rectCollision: function(r0, r1) {
		return this.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) && this.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
	},

	rangeIntersect: function(min0, max0, min1, max1) {
		return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0,max0) <= Math.max(min1, max1);
	},

	inRange: function(val, min, max) {
		return val >= Math.min(min, max) && val <= Math.max(min, max);
	}
}