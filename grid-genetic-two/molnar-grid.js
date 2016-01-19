var _ = require('lodash');

var MolnarGrid = function(dnaOrSize, options) {
	if (_.isArray(dnaOrSize)) {
		this.dna = dnaOrSize;
	} else if (_.isNumber(dnaOrSize)) {
		this.dna = randomDna(dnaOrSize);
	} else {
		throw new Error('Invalid constructor arguments', arguments);
	}

	function randomDna(size) {
		var dna = [];
		for(var i = 0; i < size; i++) {
			dna[i] = i;
		}
		return _.shuffle(dna);		
	}
}

MolnarGrid.prototype.getFitness = function(compareDna) {
	return _(this.getGranularFitness(compareDna)).reduce(function(mem, value) {
		return mem + value;
	});
}

MolnarGrid.prototype.getGranularFitness = function(compareDna) {
	return _(this.dna).map(function(value, index) {
			return Math.abs(compareDna[index] - value);		
	});
}


MolnarGrid.prototype.mateWith = function(lover) {
	var childDna = [];

	childDna = _(this.dna).chain()
		.map(function(value, index) {
			// randomly either set to my chromosome or leave undefined
			return (Math.random() < 0.50) ? value : undefined;
		})
		// now fill empty slots with lovers' chromosomes if they fit	
		.forEach(function(value, index) {
			if(_.isUndefined(value) && childDna.indexOf(lover.dna[index]) === -1) {
				childDna[index] = lover.dna[index];
			}
		})
		.value();

	// now fill in the rest of the blanks.
	_(this.dna).forEach(function(value) {
		var nextEmpty;
		if(childDna.indexOf(value) === -1) {
			nextEmpty = childDna.indexOf(undefined);
			childDna[nextEmpty] = value;
		}
	});

	return new MolnarGrid(childDna);

}

MolnarGrid.prototype.mutate = function() {
	var aIndex = randIndex(this.dna)
		, bIndex = randIndex(this.dna);

	// make sure they're not the same
	while(aIndex === bIndex) { bIndex = randIndex(this.dna); }

	swapValues(this.dna, aIndex, bIndex);

	function randIndex(arr) {
		return Math.floor(Math.random(arr.length));
	}

	function swapValues(arr, ai, bi) {
		var a = arr[ai];
		arr[ai] = arr[bi];
		arr[bi] = a;
	}

	return this;
}

module.exports = MolnarGrid;