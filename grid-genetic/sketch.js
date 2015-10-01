
(function(root, undefined) {
	var desired = [0, 13, 14, 3, 11, 6, 5, 8, 7, 10, 9, 4, 12, 1, 2, 15]
		, generations = []
		, d3Data
		, firstGen = new MolnarGridGeneration([], { desired: desired })
		, count = 0
		, last
		, maxGenerations = 200;

	// create initial population
	generations.push(firstGen.createPopulation(16));

	while(!_.last(generations).checkForCompletion() && count < maxGenerations) {
		last = _.last(generations);

		// eval fitness
		last.forEach(function(g) { g.evaluateFitness(desired); });
		last.sort();
		var fitness = last.map(function(g) { return g.get('overallFitness'); });
		var mutations = last.map(function(g) { return g.get('mutations')});
		console.log('fitness', fitness);
		// console.log('mutations', mutations);

		generations.push(last.mate());
		count++;
	}

	console.log('--->completed?', _.last(generations).checkForCompletion());

	d3Data = generations.map(function(gen) {
		return gen.models;
	});

	var windowSize = getWindowSize();
	var gridMargins = {
		top: 10
		, right: 10
		, bottom: 10
		, left: 10
	}
	var gridSize = (windowSize.w / 16);

	console.log(windowSize, gridSize, gridMargins);

	// throw new Error('STOP');

	// setup and display the viewer
	viewer = new GenerationView('#home', {
		width: windowSize.w
		, height: gridSize * maxGenerations
		, gridSize: gridSize
		, gridMargins: gridMargins
	});
	// setup with data
	viewer.setup(d3Data);
	// update
	viewer.update();



	function getWindowSize() {
		var w = window,
	    d = document,
	    e = d.documentElement,
	    g = d.getElementsByTagName('body')[0],
	    w = w.innerWidth || e.clientWidth || g.clientWidth,
	    h = w.innerHeight|| e.clientHeight|| g.clientHeight;

	   return { w:w, h:h };
	}


})(this);
