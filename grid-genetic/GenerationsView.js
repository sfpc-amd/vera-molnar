// requires d3
var GenerationView = function(container, options) {
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