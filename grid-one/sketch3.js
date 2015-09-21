// order is the 16-element array of all of our corners
var order = [];
// we want to draw the ordered vertices from 0 to lastToDraw
var lastToDraw;

function setup() {
	createCanvas(500, 500);
	createOrder();
	lastToDraw = 0;
}

function draw() {

	// add 1 to lastToDraw every 10 frames
	if(frameCount % 10 == 0) {
		lastToDraw = lastToDraw + 1, 16;
		// we don't want lastToDraw to exceed the number
		// of elements in our array
		lastToDraw = min(lastToDraw, 16);
	}

	// start drawing a shape with vertexes
	beginShape();
	for(var i=0; i<lastToDraw; i++) {
		// grab the index
		var index = order[i];

		// use modulo (remainder) to get x position
		var col = index % 4;
		var row = floor(index / 4);

		// map our rows/cols to x/y coordinates
		var x = map(col, 0, 3, 100, width-100);
		var y = map(row, 0, 3, 100, height-100);

		// draw the vertex
		vertex(x, y);
	}
	// stop drawing shape
	endShape();
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