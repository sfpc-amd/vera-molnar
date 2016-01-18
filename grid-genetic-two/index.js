// 3rd party dependencies
var _ = require('lodash')
	, domready = require('domready')
	, Genetic = require('genetic-js');

// includes
var GenerationView = require('./generation-view.js');

// this is the desired genetid sequence
var TARGET_DNA = [0, 13, 14, 3, 11, 6, 5, 8, 7, 10, 9, 4, 12, 1, 2, 15]
		, config = {
			size: 16
			, iterations: 1000
			, mutation: 0.5
			// , crossover: 0
		}
		, data = {
			targetDna: TARGET_DNA
		}

var generations = [];

var genetic = Genetic.create();

genetic.optimize = Genetic.Optimize.Maximize;
genetic.select1 = Genetic.Select1.RandomLinearRank;
genetic.select2 = Genetic.Select2.RandomLinearRank;

genetic.seed = function() {
	var grid = {
		dna: this._randomDna(this.userData.targetDna.length)
	};
	return grid;
}


genetic.mutate = function(grid) {
	grid.dna = this._mutate(grid.dna);

	// console.log('mutate', grid);

	return grid;
}


genetic.crossover = function(mother, father) {
	var son = this._mate(mother, father)
		, daughter = this._mate(father, mother);

	// console.log('crossover', son, daughter);

	return [son, daughter];
}


genetic.fitness = function(grid) {
	// var granular = this._getGranularFitness(grid.dna);
	// var fitness = granular.reduce(function(m, v) { return m + v; });
	var dna = grid.dna
		, target = this.userData.targetDna
		, fitness = 0;

	for(var i =0; i < dna.length; i++) {
		if(dna[i] === target[i]) fitness++;
	}

	// console.log('fitness', fitness, grid.dna);
	return fitness;
}

genetic.generation = function(pop, generation, stats) {
		var test = pop[0].entity.dna.join('') !== this.userData.targetDna.join('');
		// console.log('generation', test);
		return test;
}

genetic.notification = function(pop, generation, stats, isFinished) {
	console.log('notification', arguments);
	// console.log(pop[0].entity.dna, this.userData.targetDna);
	generations.push({
		population: pop
		, generation: generation
		, stats: stats
		, isFinished: isFinished
	});
	if(isFinished) {
		console.log('data', generations);
	}
}


genetic._mate = function(parent1, parent2) {
	var child = {};

	// we start by randomly filling in with parent1's chromosomes
	child.dna = parent1.dna.map(function(value, index) {
		// randomly either set to my chromosome or leave undefined
		return (Math.random() < 0.50) ? value : undefined;
	});


	// now fill empty slots with lovers' chromosomes if they fit	
	child.dna.forEach(function(value, index) {
		// if slot is undefined and value doesn't already exist in child dna
		if(value === void 0 && child.dna.indexOf(parent2.dna[index]) === -1) {
			child.dna[index] = parent2.dna[index];
		}
	})

	// now fill in the rest of the blanks.
	parent1.dna.forEach(function(value) {
		var nextEmpty;
		if(child.dna.indexOf(value) === -1) {
			nextEmpty = child.dna.indexOf(undefined);
			child.dna[nextEmpty] = value;
		}
	});

	return child;
}

genetic._randomDna = function(size) {
	var dna = [];

	for(var i = 0; i < size; i++) {
		dna[i] = i;
	}

	// shuffle
	dna = dna.sort(function() { return 0.5 - Math.random() });
	return dna;	
}

genetic._getGranularFitness = function(dna) {
	var target = this.userData.targetDna;
	return dna.map(function(v, i) {
		return Math.abs(target[i] - v);
	});
}


genetic._mutate = function(dna) {
	var mutatedDna = []
		, aIndex = randIndex(dna)
		, bIndex = randIndex(dna);

	// console.log('_mutate', dna);

	// make sure they're not the same
	if(aIndex === bIndex) {
		bIndex = randIndex(dna);
	}

	function randIndex(arr) {
		return Math.floor(Math.random()*arr.length);
	}

	function swapValues(originalArray, ai, bi) {
		var arr = originalArray.slice(0) 
			, a = arr[ai];
		arr[ai] = arr[bi];
		arr[bi] = a;
		return arr;
	}

	// console.log('swap indices', aIndex, bIndex);

	mutatedDna = swapValues(dna, aIndex, bIndex);	

	// console.log('mutatedDna', mutatedDna, dna);

	return mutatedDna;
}

domready(function() {
	var body = document.getElementsByTagName('body')[0]
		, button = document.createElement('button')
		, txt = document.createTextNode('Go!');

	button.appendChild(txt);
	body.appendChild(button);

	button.onclick = function() {
		genetic.evolve(config, data);
	}

});

