var MolnarGridGeneration = Backbone.Collection.extend({
	model: MolnarGrid

	// when we sort we compare by overall fitness
	, comparator: function(grid) {
		return grid.get('overallFitness');
	}

	// include options for mating settings
	, initialize: function(models, options) {
		// console.log('MolnarGridGeneration#initialize', arguments);
		options = options || {};

		if(options.desired) {
			this.desired = options.desired;
		}
	}

	// create a population of `count` MolnarGrid instances
	, createPopulation: function(count) {
		var initialPopulation = []

		// don't do it if there already is a population
		if(this.length > 0) {
			throw new Error('Population already created!');
		}

		for(var i = 0; i < count; i++) {
			initialPopulation.push(new MolnarGrid());
		}

		this.add(initialPopulation);

		return this;
	} 

	// returns a collection of children based on mating settings
	, mate: function() {
		var nextGeneration = []
			, dnaSamples
			, pairs = []
			, child;

		// evaluate fitness on the population
		this.forEach(function(grid) {
			grid.evaluateFitness(this.desired);
		}, this);

		// sort the collection
		this.sort();

		// now theat the collection is sorted by fitness, mate
		// each member of the population with the one next to it
		this.forEach(function(grid, index) {
			var parent1 = grid
				, parent2 = this.at(index);

			// this should be false for the very last iteration
			if(parent1 && parent2) {
				nextGeneration.push(parent1.mateWith(parent2));
			}
		}, this);

		// add some randomly generated grids to the end
		while(nextGeneration.length < this.length) {
			nextGeneration.push(new MolnarGrid())
		}

		// return the new generation as a collection
		return new MolnarGridGeneration(
			nextGeneration,
			{ desired: this.desired }
		);

	}

	, exportDna: function() {
		return this.map(function(grid) {
			return grid.get('dna');
		});
	}

});