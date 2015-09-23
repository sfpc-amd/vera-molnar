

var GenerationViewer = function(container, options) {
	console.log('GenerationViewer', arguments);


	this.container = container;
	this.width = options.width;
	this.height = options.height;

	this.setup = function(data) {
		this.data = data;

		console.log('viewer data', data);

		this.svg = d3.select(this.container)
									.append('svg:svg')
									.attr('width', this.width)
									.attr('height', this.height)
									.append('g');

	};

	this.update = function(data) {
		if(data) {
			this.data = data;
		}


		// now what??


	};
};

(function(root, undefined) {
	var desired = [0, 13, 14, 3, 11, 6, 5, 8, 7, 10, 9, 4, 12, 1, 2, 15]
		, initialGeneration = new MolnarGridGeneration([], {desired: desired})
		, secondGeneration;

	initialGeneration.createPopulation(16);
	secondGeneration = initialGeneration.mate();

	viewer = new GenerationViewer('#home', {
		width: 500
		, height: 500
	});
	viewer.setup([initialGeneration.exportDna(), secondGeneration.exportDna()]);
	viewer.update();

})(this);
