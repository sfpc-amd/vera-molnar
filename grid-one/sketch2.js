// order is our final permeatation
var order = [];
var current = [];

function setup() {
	createCanvas(500, 500);
	createOrder();
}

function draw() {
	beginShape();
	for(var i=0; i<order.length; i++) {
		var index = order[i];

		// use modulo (remainder) to get x position
		var col = index % 4;
		var row = floor(index / 4);

		var x = map(col, 0, 3, 0, width);
		var y = map(row, 0, 3, 0, height);

		vertex(x, y);
	}
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