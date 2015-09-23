(function(root, undefined) {
	var desired = [0, 13, 14, 3, 11, 6, 5, 8, 7, 10, 9, 4, 12, 1, 2, 15]
		, initialGeneration = new MolnarGridGeneration([], {desired: desired})
		, secondGeneration;

	initialGeneration.createPopulation(16);

	console.log('initial generation', initialGeneration);

	secondGeneration = initialGeneration.mate();

	console.log('second generation', secondGeneration);

})(this);