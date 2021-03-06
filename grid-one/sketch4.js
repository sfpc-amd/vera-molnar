// order is the 16-element array of all of our corners
var order = [];
// we want to draw the ordered vertices from 0 to lastToDraw
var lastToDraw;
var frameInterval;

function setup() {
	createCanvas(500, 500);
	createOrder();
	lastToDraw = 1;
	frameInterval = 15;
	frameRate(5);
}

function draw() {

	// add 1 to lastToDraw every 10 frames
	var frameRemainder = frameCount % frameInterval;
	if(frameRemainder == 0) {
		lastToDraw = lastToDraw + 1;
		// we don't want lastToDraw to exceed the number
		// of elements in our array
		lastToDraw = min(lastToDraw, 16);
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

	// we can use lerp to interpolate between the last current vertex
	// and the next current vertex.
	// frameRemainder / 15 is our amount to interpolate
	var t = frameRemainder / 15;
	var indexCurrent = order[lastToDraw - 1];
	var indexNext = order[min(lastToDraw, 15)];

	print("interp between " + indexCurrent + " " + indexNext);

	// let's interpolate between (x, y) at indexCurrent and (x, y)
	// at indexNext
	var positionCurrent = getPosition(indexCurrent);
	var positionNext = getPosition(indexNext);

	var x_next = lerp(positionCurrent.x, positionNext.x, t);
	var y_next = lerp(positionCurrent.y, positionNext.y, t);

	line(positionCurrent.x, positionCurrent.y, x_next,y_next);
}


/**
 * Convenience function to get the x/y of any indexed vertex
 */
function getPosition(index) {

		// use modulo (remainder) to get x position
		var col = index % 4;
		var row = floor(index / 4);

		// map our rows/cols to x/y coordinates
		var x = map(col, 0, 3, 100, width-100);
		var y = map(row, 0, 3, 100, height-100);

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
	var all = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

	// take a random element from all and append it to order, remove it from all
	for(var i=0; i<16; i++) {
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