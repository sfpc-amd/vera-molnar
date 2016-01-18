var d3 = require('d3');

// requires d3
function GenerationView(container, options) {
	console.log('GenerationView::constructor', this, arguments);

	this.container = container;
	this.width = options.width;
	this.height = options.height;
	this.gridSize = options.gridSize;
	this.gridMargins = options.gridMargins;
};



GenerationView.prototype.setup = function(data) {
	console.log('GenerationView::setup', arguments);
	this.setData(data);

	console.log('viewer data', data);

	this.svg = d3.select(this.container)
								.append('svg:svg')
									.attr('width', this.width)
									.attr('height', this.height)
									.append('svg:g')
										.attr('class', 'wrapper')

};

GenerationView.prototype.setData = function(data) {
	this.data = data.map(function(g) { return g.population });
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

	console.log('')

	var gridXRange = d3.scale.linear()
											.domain([0, gridPoints-1])
											.range([gridMargins.left, gridSize+gridMargins.left-gridMargins.right]);

	var gridYRange = d3.scale.linear()
											.domain([0, gridPoints-1])
											.range([gridMargins.top, gridSize+gridMargins.top-gridMargins.bottom]);


	// https://github.com/mbostock/d3/wiki/SVG-Shapes#line
	var gridLine = d3.svg.line()
									// thank you gene kogan!
									.x(function(d, i) { return gridXRange(d % 4); })
									.y(function(d, i) { return gridYRange(Math.floor(d / 4)) })
									.interpolate('linear');


	var generations = this.svg
										.append('svg:g')
										.attr('class', 'generations');

	var row = generations.selectAll('.generation-row')
									.data(this.data)
									.enter()
											.append('svg:g')
											.attr('class', function(d, i) { return 'generation-row generation'+i })
											.attr('transform', function(d, i) {
												var y = i * (gridSize + gridMargins.top + gridMargins.bottom);
												return 'translate(0,'+y+')';
											});

	var grid = row.selectAll('.molnar-grid')
									.data(function(d) { console.log(d); return d })//, function(d) { return d.id })
									.enter()
										.append('svg:g')
										.attr('class', 'molnar-grid')
										.attr('transform', function(d, i) {
												var x = i * (gridSize + gridMargins.left)// + gridMargins.right)
												return 'translate('+x+',0)';
										})
										.append('svg:path')
											.attr('class', 'molnar-grid-path')
											.attr('title', function(d) { return d.entity.dna.join('') +' '+ d.fitness})
											.attr('d', function(d) {
												return gridLine(d.entity.dna);
											});
};

module.exports = GenerationView;
