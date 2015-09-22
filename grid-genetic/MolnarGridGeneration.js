var MolnarGridGeneration = Backbone.Collection.extend({
	model: MolnarGrid

	// include options for mating settings
	, initialize: function(models, options) {

	}

	// create a population of `count` MolnarGrid instances
	, createPopulation: function(count) {

		// don't do it if there already is a population
		if(this.length > 0) {
			throw new Error('Population already created!');
		}

		// more code here
	} 

	// returns a collection of children based on mating settings
	, mate: function() {


	}

});