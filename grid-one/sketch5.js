// order is the 16-element array of all of our corners
var order = [];
// we want to draw the ordered vertices from 0 to lastToDraw
var lastToDraw;
var frameInterval;

var gridSizeX = 4;
var gridSizeY = 4;



function setup() {
	createCanvas(500, 500);
	createOrder();
	lastToDraw = 1;
	frameInterval = 15;
	noFill();
}

function draw() {

	// add 1 to lastToDraw every 10 frames
	var frameRemainder = frameCount % frameInterval;
	if(frameRemainder == 0) {
		lastToDraw = lastToDraw + 1;
		// we don't want lastToDraw to exceed the number
		// of elements in our array
		lastToDraw = min(lastToDraw, gridSizeX*gridSizeY);
	}

	// this will draw all the current vertices
	beginShape();
	for(var i=0; i<lastToDraw; i++) {

		var position = getPosition(order[i]);

		// draw the vertex
		vertex(position.x, position.y);
	}
	// stop drawing shape
	endShape();

	if(lastToDraw < gridSizeX*gridSizeY - 1) {

		// we can use lerp to interpolate between the last current vertex
		// and the next current vertex.
		// frameRemainder / 15 is our amount to interpolate
		var t = frameRemainder / frameInterval;
		var indexCurrent = order[lastToDraw - 1];
		var indexNext = order[min(lastToDraw, gridSizeX*gridSizeY)];

		// print("interp between " + indexCurrent + " " + indexNext);

		// let's interpolate between (x, y) at indexCurrent and (x, y)
		// at indexNext
		var positionCurrent = getPosition(indexCurrent);
		var positionNext = getPosition(indexNext);

		var x_next = lerp(positionCurrent.x, positionNext.x, t);
		var y_next = lerp(positionCurrent.y, positionNext.y, t);

		line(positionCurrent.x, positionCurrent.y, x_next,y_next);
	}
}


/**
 * Convenience function to get the x/y of any indexed vertex
 */
function getPosition(index) {

		// use modulo (remainder) to get x position
		var col = index % gridSizeY;
		var row = floor(index / gridSizeX);

		// map our rows/cols to x/y coordinates
		var x = map(col, 0, gridSizeX-1, 100, width-100);
		var y = map(row, 0, gridSizeY-1, 100, height-100);

		return {
			x: x
			, y: y
		}	
}


/**
 * Create a permeatation of the array of indexes
 * corresponding to our 16 points
 */
function createOrder() {
	// clear order
	order = [];
	// make new array of indexes to sample from
	var all = [];

	for(var k=0; k<gridSizeX*gridSizeY; k++) {
		all.push(k)
	}

	var len = all.length;

	// take a random element from all and append it to order, remove it from all
	for(var i=0; i<gridSizeX*gridSizeY; i++) {
		// pick a random index
		var index = floor(random(all.length));

		// append that element from all into order
		order.push(all[index]);

		// remove sampled element from all 
		all.splice(index, 1);

		println("Order: "+order);
		println("All: "+all);
	}
}

