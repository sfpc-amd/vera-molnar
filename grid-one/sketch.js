var gridSize = 4;
var gridSpacing;
var totalLines;
var points = [];
var vertices = [];
function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	noFill();
	stroke(255);

	gridSpacing = min(width/(gridSize+1), height/(gridSize+1));
	totalLines = gridSize*gridSize;

	points = generatePoints();

	translate(gridSpacing, gridSpacing);

	drawSimpleGrid();

	drawLines();
}

function generateVertices(points) {
	var v = [];

	points.forEach(function(p) {
		// c^2 = a^2 + b^2
		var len = sqrt(sq(p.x) + sq(p.y))
				// number of segments
				, seg = len / (gridSpacing/2)
				, segLen = len/seg;

		for(var i=0; i<seg; i++) {
			v.push(createVector())
		}

	});

	return v;

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

	return p;

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
	return createVector(floor(random(gridSize)), floor(random(gridSize)));
}

function drawLine(startPoint, endPoint) {
	console.log('drawLine', startPoint, endPoint);
	line(startPoint.x*gridSpacing, startPoint.y*gridSpacing, endPoint.x*gridSpacing, endPoint.y*gridSpacing);
}

function drawSimpleGrid() {
	for (var i = 0; i<gridSize; i++ ) {
		for(var j = 0; j<gridSize; j++ ) {
			point(i*gridSpacing, j*gridSpacing);
		}
	}
}