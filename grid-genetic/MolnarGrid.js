var MolnarGrid = Backbone.Model.extend({
	, idAttribute: 'dna'
	, chromosomes: 16
	, children = []
	// options for number of "genes"
	, initialize: function(attr, options) {

		if(attr.parents) {
			this.parents = attr.parents;
		}

		if(!attr.dna) {
			this.set('dna', _randomDna(this.chromosomes));
		}
	}

	// will evaluate fitness based on desired 
	, evaluateFitness: function(desired) {
		var dna = this.get('dna')
				, granularFitness
				, overallFitness;

		if(!_.isArray(desired) || desired.length !== dna.length) {
			throw new Error('Desired DNA is not valid!');
		}

		// granular fitness contains the diference between
		// the desired outcome and the current dna
		granularFitness = dna.map(function(value, index) {
			return Math.abs(desired[index] - value);
		});

		// overall fitness simply adds all of those values
		// together
		overallFitness = granularFitness.reduce(function(mem, value, i) {
			return mem + value;
		});

		this.set('granularFitness', granularFitness);
		this.set('overallFitness', overallFitness);

		return this;
	}


	// mate with another molnar grid
	, mateWith: function(lover) {
		var child
				, childDna
				, myDna
				, loverDna
				, mutations = 0;

		// no inter-species sex here
		if(!(lover instanceof MolnarGrid)) {
			throw new Error("That's disgusting!");
		}

		// eggs & sperm
		myDna = this.get('dna');
		loverDna = lover.get('dna');

		childDna = myDna.map(function(value, index) {
			// randomly either set to my chromosome or leave undefined
			return (Math.random() < 0.5) ? value : undefined;
		});

		// now fill empty slots with lovers' chromosomes if they fit	
		childDna.forEach(function(value, index) {
			if(_.isUndefined(value) && childDna.indexOf(loverDna[index]) === -1) {
				childDna[index] = loverDna[index];
			}
		});

		// now fill in the rest of the blanks. these will be mutations
		if(childDna.length < myDna.length) {
			myDna.forEach(function(value) {
				var nextEmpty;
				if(childDna.indexOf(value) === -1) {
					nextEmpty = childDna.indexOf(undefined);
					childDna[nextEmpty] = value;
					mutations++
				}
			})
		}

		// the miracle of birth!
		child = new MolnarGrid({
			dna: childDna
			, mutations: mutations
			, parents: [self, lover]
		});

		this.children.push(child);

		return child;

	} 

	// set dna to random value
	, _randomDna: function(size) {
		var dna = [];

		for(var i = 0; i < size; i++) {
			dna[i] = i;
		}

		return _.shuffle(dna);
	}
});