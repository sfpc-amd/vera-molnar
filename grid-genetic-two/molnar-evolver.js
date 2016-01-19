var _ = require('lodash')
	, Genetic = require('genetic-js');

var _defaultOpts = {

}

function MolnarEvolver(target, opts, cb) {

	// set basics
	this.target = target;
	this.opts = _.extend({}, _defaultOpts, (opts||{}));

	this.ga = Genetic.create();

	// extend additional properties
	_.extend(this.ga, _proto);


	// set notification
	this.ga.notification = _.bind(function(pop, generation, stats, isFinished) {
		if(cb && typeof cb === 'function') {
			cb.apply(this, arguments);
		}
	}, this);
}

MolnarEvolver.prototype.start = function() {
	var data = { targetDna: this.target }
	this.ga.evolve(this.opts, data);
};

var _proto = {
	optimize: Genetic.Optimize.Maximize
	, select1: Genetic.Select1.RandomLinearRank
	, select2: Genetic.Select2.RandomLinearRank	
	// , idCounter: 0

	, seed: function seed() {
		var grid = {
			dna: this._randomDna(this.userData.targetDna.length)
			, id: this.idCounter++
		};
		return grid;
	}

	, mutate: function(grid) {
		grid.dna = this._mutate(grid.dna);

		// console.log('mutate', grid);

		return grid;
	}


	, crossover: function(mother, father) {
		var son = this._mate(mother, father)
			, daughter = this._mate(father, mother);

		// console.log('crossover', son, daughter);

		return [son, daughter];
	}


	, fitness: function(grid) {
		// var granular = this._getGranularFitness(grid.dna);
		// var fitness = granular.reduce(function(m, v) { return m + v; });
		var dna = grid.dna
			, size = grid.dna.length
			, target = this.userData.targetDna
			, matches = 0;

		for(var i =0; i < dna.length; i++) {
			if(dna[i] === target[i]) matches++;
		}

		return matches/size;
	}

	, generation: function(pop, generation, stats) {
			var test = pop[0].entity.dna.join('') !== this.userData.targetDna.join('');
			// console.log('generation', test);
			return test;
	}


	, _mate: function(parent1, parent2) {
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

		child.parentIds = [parent1.id, parent2.id];
		child.id = this.idCounter++;

		return child;
	}

	, _randomDna: function(size) {
		var dna = [];

		for(var i = 0; i < size; i++) {
			dna[i] = i;
		}

		// shuffle
		dna = dna.sort(function() { return 0.5 - Math.random() });
		return dna;	
	}

, _getGranularFitness: function(dna) {
		var target = this.userData.targetDna;
		return dna.map(function(v, i) {
			return Math.abs(target[i] - v);
		});
	}


, _mutate: function(dna) {
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

}



module.exports = MolnarEvolver;