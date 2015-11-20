// big thanks to gene kogen for helping work this out!
var canvas;
var frameInterval  = 15;

var outerRect;
var innerRect;
var gridMargin;

var generationDrawingStarted = false;

var m;

function setup() {
	var canvasHeight = windowHeight < windowWidth*.6 ? windowHeight : windowWidth*.6 ;

	canvas = createCanvas(windowWidth, canvasHeight);
	canvas.parent('main');
	setupBackground();
	drawBackground();
	// createOrder();
	lastToDraw = 1;
	frameInterval = 15;
	noFill();
	// background(0);
	stroke(0);
	strokeWeight(1);

	gridMargin = innerRect.w/10;
	m = new P5MolnarGrid(
		4
		, 4
		, innerRect.x+gridMargin
		, innerRect.y+gridMargin
		, innerRect.w - (gridMargin*2)
		, innerRect.h - (gridMargin*2)
		, [0, 13, 14, 3, 11, 6, 5, 8, 7, 10, 9, 4, 12, 1, 2, 15]
	);

	// m.createOrder();
	// drawGenerations();

}

function draw() {

	drawBackground();
	m.draw();

	if(!generationDrawingStarted) {
			drawGenerations();
	}
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
function P5MolnarGrid(gridSizeX, gridSizeY, gridX, gridY, gridWidth, gridHeight, order) {
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


function drawGenerations() {
	var desired = [0, 13, 14, 3, 11, 6, 5, 8, 7, 10, 9, 4, 12, 1, 2, 15]
		, generations = []
		, d3Data
		, firstGen = new MolnarGridGeneration([], { desired: desired })
		, count = 0
		, last
		, maxGenerations = 200;

	generationDrawingStarted = true;

	// create initial population
	generations.push(firstGen.createPopulation(16));

	while(!_.last(generations).checkForCompletion() && count < maxGenerations) {
		last = _.last(generations);

		// eval fitness
		last.forEach(function(g) { g.evaluateFitness(desired); });
		last.sort();
		var fitness = last.map(function(g) { return g.get('overallFitness'); });
		var mutations = last.map(function(g) { return g.get('mutations')});
		console.log('fitness', fitness);
		// console.log('mutations', mutations);

		generations.push(last.mate());
		count++;
	}

	console.log('--->completed?', _.last(generations).checkForCompletion());

	d3Data = generations.map(function(gen) {
		return gen.models;
	});

	var windowSize = getWindowSize();
	var gridMargins = {
		top: 15
		, right: 15
		, bottom: 15
		, left: 15
	}
	var gridSize = (windowSize.w / 16);

	console.log(windowSize, gridSize, gridMargins);

	// throw new Error('STOP');

	// setup and display the viewer
	viewer = new GenerationView('#genetic', {
		width: windowSize.w
		, height: gridSize * maxGenerations
		, gridSize: gridSize
		, gridMargins: gridMargins
	});
	// setup with data
	viewer.setup(d3Data);
	// update
	viewer.update();



	function getWindowSize() {
		var w = window,
	    d = document,
	    e = d.documentElement,
	    g = d.getElementsByTagName('body')[0],
	    w = w.innerWidth || e.clientWidth || g.clientWidth,
	    h = w.innerHeight|| e.clientHeight|| g.clientHeight;

	   return { w:w, h:h };
	}
}

