// 3rd party dependencies
var _ = require('lodash')
	, domready = require('domready')
	, browser = require('browser-size')();

// includes
var GenerationView = require('./generation-view.js')
	, MolnarEvolver = require('./molnar-evolver.js')

// this is the desired genetid sequence
var TARGET_DNA = [0, 13, 14, 3, 11, 6, 5, 8, 7, 10, 9, 4, 12, 1, 2, 15]
// config for genetic js
var config = {
		size: 16
		, iterations: 1000
		, mutation: 0.5
	}
var generations = [];

var gridMargins = {
	top: 15
	, right: 15
	, bottom: 15
	, left: 15
}
var gridSize = ((browser.width-gridMargins.right) / 16);

console.log(browser.width, browser.height, gridSize, gridMargins);

// setup and display the viewer
viewer = new GenerationView('body', {
	width: browser.width
	, height: gridSize * 1000
	, gridSize: gridSize
	, gridMargins: gridMargins
});



var evolver = new MolnarEvolver(TARGET_DNA, config, evolveStep);
var generationsView;

function evolveStep(pop, n, stats, isFinished) {
	generations.push({
		population: pop
		, generation: n
		, stats: stats
		, isFinished: isFinished
	});
	
	viewer.update(generations);
}

domready(function() {
	viewer.setup(generations);
	evolver.start();
});

