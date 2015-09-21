var gridSize = 4;
var gridSpacing;
var totalLines;
var points = [];
var vertices = [];
var animationSegmentLength;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	noFill();
	stroke(255);

	gridSpacing = min(width/(gridSize+1), height/(gridSize+1));
	totalLines = gridSize*gridSize;
	animationSegmentLength = gridSpacing;

	points = generatePoints();
	vertices = generateVertices(points);

	translate(gridSpacing, gridSpacing);

	drawSimpleGrid();

	drawLines();
}

function draw() {
	// drawVertices(vertices);
}


function generateVertices(points) {
	var v = [];

	points.forEach(function(p) {
		// c^2 = a^2 + b^2
		var xLen = p[1].x*gridSpacing - p[0].x*gridSpacing
				, yLen = p[1].y*gridSpacing - p[0].y*gridSpacing
				, len = sqrt(sq(xLen) + sq(yLen))
				// number of segments
				, angle = sin(yLen, len)
				// total segments
				, seg = len / animationSegmentLength;

		// console.log(p, yLen, xLen, len, degrees(angle), seg);

		for(var i=0; i<seg; i++) {
			// sin(angle) = y/(segLen*i)
			// y = sin(angle) * (segLen*i)
			v.push({
				x: sin(angle)*animationSegmentLength*i
				, y: cos(angle)*animationSegmentLength*i
			});
		}

	});


	// console.log(v);
	return v;

}

function drawVertices(vertices) {

	if(frameCount > vertices.length) {
		len = vertices.length;
	} else {
		len = frameCount;
	}

	beginShape();
	for(var i = 0; i<len; i++) {
		vertex(vertices[i].x, vertices[i].y);
	}
	endShape();
}

function generatePoints() {
	var p = []
		, startPoint = randomPoint()
		, endPoint = randomPoint();

	for(var i = 0; i<totalLines; i++) {
		p.push([startPoint, endPoint])
		startPoint = endPoint;
		endPoint = randomPoint();
	}
	// console.log('points', p);

	return p;

}

function createVectors() {
	var v = [];

	for(var i = 0; i<gridSize; i++) {
		for(var j = 0; j < gridSize; j++) {
			v.push(createVector(i*gridSpacing, j*gridSpacing));
		}
	}

	return v;
}

function drawLines() {
	var startPoint = randomPoint()   
		, endPoint = randomPoint();

	console.log(startPoint, endPoint, totalLines);
	for(var i = 0; i<totalLines; i++) {
		drawLine(startPoint, endPoint)
		startPoint = endPoint;
		endPoint = randomPoint();
	}
}

function randomPoint() {
	return {
		x: floor(random(gridSize))*gridSpacing
		, y: floor(random(gridSize))*gridSpacing
	};
}

function drawLine(startPoint, endPoint) {
	line(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
}

function drawSimpleGrid() {
	for (var i = 0; i<gridSize; i++ ) {
		for(var j = 0; j<gridSize; j++ ) {
			point(i*gridSpacing, j*gridSpacing);
		}
	}
}