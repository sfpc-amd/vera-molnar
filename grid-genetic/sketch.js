
(function(root, undefined) {
	var desired = [0, 13, 14, 3, 11, 6, 5, 8, 7, 10, 9, 4, 12, 1, 2, 15]
		, generations = []
		, d3Data
		, firstGen = new MolnarGridGeneration([], { desired: desired })
		, count = 0
		, last;

	// create initial population
	generations.push(firstGen.createPopulation(16));

	while(!_.last(generations).checkForCompletion() && count < 200) {
		last = _.last(generations);

		// eval fitness
		last.forEach(function(g) { g.evaluateFitness(desired); });
		last.sort();
		var fitness = last.map(function(g) { return g.get('overallFitness'); });
		var mutations = last.map(function(g) { return g.get('mutations')});
		console.log('fitness', fitness);
		console.log('mutations', mutations);

		generations.push(last.mate());
		count++;
	}

	console.log('--->completed?', _.last(generations).checkForCompletion());

	// d3Data = generations.map(function(gen) {
	// 	gen.exportDna();
	// });

	// // setup and display the viewer
	// viewer = new GenerationView('#home', {
	// 	width: 500
	// 	, height: 500
	// });
	// // setup with data
	// viewer.setup(d3Data);
	// // update
	// viewer.update();



})(this);
