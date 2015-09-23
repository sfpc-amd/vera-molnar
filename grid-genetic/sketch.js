
(function(root, undefined) {
	var desired = [0, 13, 14, 3, 11, 6, 5, 8, 7, 10, 9, 4, 12, 1, 2, 15]
		, initialGeneration = new MolnarGridGeneration([], {desired: desired})
		, secondGeneration
		, d3Data;

	// create initial population
	initialGeneration.createPopulation(16);

	// now create second generation
	secondGeneration = initialGeneration.mate();

	d3Data = [initialGeneration.exportDna(), secondGeneration.exportDna()];

	// setup and display the viewer
	viewer = new GenerationView('#home', {
		width: 500
		, height: 500
	});
	// setup with data
	viewer.setup(d3Data);
	// update
	viewer.update();

})(this);
