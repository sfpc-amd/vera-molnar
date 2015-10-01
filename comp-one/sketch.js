// big thanks to gene kogen for helping work this out!
var frameInterval  = 15;

var outerRect;
var innerRect;
var gridMargin;

var m;

function setup() {
	createCanvas(windowWidth, windowHeight);
	setupBackground();

	// createOrder();
	lastToDraw = 1;
	frameInterval = 15;
	noFill();
	// background(0);
	stroke(0);
	strokeWeight(1);

	gridMargin = innerRect.w/10;
	m = new MolnarGrid(
		4
		, 4
		, innerRect.x+gridMargin
		, innerRect.y+gridMargin
		, innerRect.w - (gridMargin*2)
		, innerRect.h - (gridMargin*2)
		, [0, 13, 14, 3, 11, 6, 5, 8, 7, 10, 9, 4, 12, 1, 2, 15]
	);

	// m.createOrder();


}

function draw() {
	drawBackground();
	m.draw();
}

function setupBackground() {
	outerRect = {
			x: 0
			, y: 0
			, w: width/2
			, h: 4*height/5
			, c: color(235, 182, 116)
		}

	outerRect.x = width/2 - outerRect.w/2;
	outerRect.y = height/2 - outerRect.h/2;

	innerRect = {
			x: 0
			, y: 0
			, w: min(width/4, height/4)
			, h: min(width/4, height/4)
			, c: color(233, 196, 141)
		};

	innerRect.x = width/2 - innerRect.w/2;
	innerRect.y = height/2 - innerRect.h/2;

	console.log(outerRect, innerRect);
}

function drawBackground() {
	push();
		background(238);
		noStroke()

		// draw outer rectangle
		fill(outerRect.c);
		rect(outerRect.x, outerRect.y, outerRect.w, outerRect.h);

		// draw inner rectangle
		fill(innerRect.c);
		rect(innerRect.x, innerRect.y, innerRect.w, innerRect.h);
	pop();
}

/**
 * Convenience function to get the x/y of any indexed vertex
 */
function MolnarGrid(gridSizeX, gridSizeY, gridX, gridY, gridWidth, gridHeight, order) {
	this.gridSizeX = gridSizeX;
	this.gridSizeY = gridSizeY;
	this.lastToDraw = 1;
	this.order = order || [];


	this.draw = function() {
 		// add 1 to lastToDraw every 10 frames
		var frameRemainder = frameCount % frameInterval;
		if(frameRemainder == 0) {
			this.lastToDraw = this.lastToDraw + 1;
			// we don't want lastToDraw to exceed the number
			// of elements in our array
			this.lastToDraw = min(this.lastToDraw, this.gridSizeX*this.gridSizeY);
		}

		// this will draw all the current vertices
		beginShape();
		for(var i=0; i<this.lastToDraw; i++) {

			var position = this.getPosition(this.order[i]);

			// draw the vertex
			vertex(position.x, position.y);
		}
		// stop drawing shape
		endShape();

		if(this.lastToDraw < this.gridSizeX*this.gridSizeY - 1) {

			// we can use lerp to interpolate between the last current vertex
			// and the next current vertex.
			// frameRemainder / 15 is our amount to interpolate
			var t = frameRemainder / frameInterval;
			var indexCurrent = this.order[this.lastToDraw - 1];
			var indexNext = this.order[min(this.lastToDraw, this.gridSizeX*this.gridSizeY)];

			// print("interp between " + indexCurrent + " " + indexNext);

			// let's interpolate between (x, y) at indexCurrent and (x, y)
			// at indexNext
			var positionCurrent = this.getPosition(indexCurrent);
			var positionNext = this.getPosition(indexNext);

			var x_next = lerp(positionCurrent.x, positionNext.x, t);
			var y_next = lerp(positionCurrent.y, positionNext.y, t);

			line(positionCurrent.x, positionCurrent.y, x_next,y_next);
		}
	}

	this.getPosition = function(index) {

			// use modulo (remainder) to get x position
			var col = index % this.gridSizeY;
			var row = floor(index / this.gridSizeX);

			// map our rows/cols to x/y coordinates
			var x = map(col, 0, this.gridSizeX-1, gridX, gridX + gridWidth);
			var y = map(row, 0, this.gridSizeY-1, gridY, gridY + gridHeight);

			return {
				x: x
				, y: y
			}	
	}

/**
 * Create a permeatation of the array of indexes
 * corresponding to our 16 points
 */
	this.createOrder = function() {
		// clear order
		this.order = [];
		// make new array of indexes to sample from
		var all = [];

		for(var k=0; k<this.gridSizeX*this.gridSizeY; k++) {
			all.push(k)
		}

		var len = all.length;

		// take a random element from all and append it to order, remove it from all
		for(var i=0; i<this.gridSizeX*this.gridSizeY; i++) {
			// pick a random index
			var index = floor(random(all.length));

			// append that element from all into order
			this.order.push(all[index]);

			// remove sampled element from all 
			all.splice(index, 1);

			println("Order: "+this.order);
			println("All: "+all);
		}		
	}

}


function windowResized() {
	// resizeCanvas(windowWidth, windowHeight);
	// setupBackground();
}
