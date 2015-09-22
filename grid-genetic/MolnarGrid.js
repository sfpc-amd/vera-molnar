var MolnarGrid = Backbone.Model.extend({
	dna: []

	// options for number of "genes"
	, initialize: function(models, options) {

	}

	// will evaluate fitness based on desired 
	, evaluateFitness: function(desired) {

	}

	// mate with another molnar grid
	, mateWith: function(lover) {

		// no inter-species sex here
		if(!(lover instanceof MolnarGrid)) {
			throw new Error("That's disgusting!");
		}

	} 

	// set dna to random value
	, _randomDna: function() {

	}
});