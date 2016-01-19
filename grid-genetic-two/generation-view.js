var d3 = require('d3');

// requires d3
function GenerationView(container, options) {
	// console.log('GenerationView::constructor', this, arguments);

	this.container = container;
	this.width = options.width;
	this.gridSize = options.gridSize;
	this.gridMargins = options.gridMargins;
	this.height = this.gridSize;
	this.data = [];
};



GenerationView.prototype.setup = function(data) {
	// console.log('GenerationView::setup', arguments);
	this.setData(data);

	// console.log('viewer data', data);

	this.svg = d3.select(this.container)
								.append('svg:svg')
									.attr('width', this.width)
									.attr('height', this.height)
									.append('svg:g')
										.attr('class', 'wrapper');

	this.generations = this.svg
										.append('svg:g')
										.attr('class', 'generations');

};

GenerationView.prototype.setData = function(data) {
	this.data = data.map(function(g) { return g.population });
}

GenerationView.prototype.updateHeight = function() {
	var rows = this.data.length;
	this.height = rows*(this.gridSize);

	// update svg container size	
	d3.select(this.container).select('svg').attr('height', this.height);
}


// nested data
// http://bost.ocks.org/mike/nest/
GenerationView.prototype.update = function(data) {
	console.log('GenerationView::update', arguments);

	// this will set the output range of our grid
	var gridPoints = 4;
	var gridSize = this.gridSize;
	var gridMargins = this.gridMargins;

	if(data) {
		this.setData(data);
	}

	this.updateHeight();

	var gridXRange = d3.scale.linear()
											.domain([0, gridPoints-1])
											.range([gridMargins.left, gridSize+gridMargins.left-gridMargins.right]);

	var gridYRange = d3.scale.linear()
											.domain([0, gridPoints-1])
											.range([gridMargins.top, gridSize+gridMargins.top-gridMargins.bottom]);


	var colorRange = d3.interpolate(d3.rgb(255, 0, 0), d3.rgb(0, 0, 255));

	// https://github.com/mbostock/d3/wiki/SVG-Shapes#line
	var gridLine = d3.svg.line()
									// thank you gene kogan!
									.x(function(d, i) { return gridXRange(d % 4); })
									.y(function(d, i) { return gridYRange(Math.floor(d / 4)) })
									.interpolate('linear');

	var row = this.generations.selectAll('.generation-row')
									.data(this.data)
									.enter()
											.append('svg:g')
											.attr('class', function(d, i) { return 'generation-row generation'+i })
											.attr('transform', function(d, i) {
												// var y = i * (gridSize + gridMargins.top + gridMargins.bottom);
												var y = i * gridSize;
												return 'translate(0,'+y+')';
											});

	var grid = row.selectAll('.molnar-grid')
									.data(function(d) { return d })
									.enter()
										.append('svg:g')
										.attr('class', 'molnar-grid')
										// .attr('data-id', function(d) { return d.entity.id })
										.attr('transform', function(d, i) {
												// var x = i * (gridSize + gridMargins.left)// + gridMargins.right)
												var x = i * gridSize;
												return 'translate('+x+',0)';
										})
										.append('svg:path')
											.attr('class', 'molnar-grid-path')
											// .attr('title', function(d) { return d.entity.dna.join('') +' '+ d.fitness})
											// .style('opacity', function(d) { return d.fitness + 0.2; })
											.style('stroke', function(d) { return colorRange(d.fitness)})
											.attr('d', function(d) {
												return gridLine(d.entity.dna);
											});
};

module.exports = GenerationView;
