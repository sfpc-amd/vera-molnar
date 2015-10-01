// requires d3
var GenerationView = function(container, options) {
	console.log('GenerationViewer', arguments);


	this.container = container;
	this.width = options.width;
	this.height = options.height;
	this.gridSize = options.gridSize;
	this.gridMargins = options.gridMargins;

	this.setup = function(data) {
		this.data = data;

		console.log('viewer data', data);

		this.svg = d3.select(this.container)
									.append('svg:svg')
										.attr('width', this.width)
										.attr('height', this.height)
										.append('svg:g')
											.attr('class', 'wrapper')

	};

	// nested data
	// http://bost.ocks.org/mike/nest/
	this.update = function(data) {

		// this will set the output range of our grid
		var gridPoints = 4;
		var gridSize = this.gridSize;
		var gridMargins = this.gridMargins;

		if(data) {
			this.data = data;
		}


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
										.data(function(d) { return d })//, function(d) { return d.id })
										.enter()
											.append('svg:g')
											.attr('class', 'molnar-grid')
											.attr('transform', function(d, i) {
													var x = i * (gridSize + gridMargins.left)// + gridMargins.right)
													return 'translate('+x+',0)';
											})
											.append('svg:path')
												.attr('class', 'molnar-grid-path')
												.attr('title', function(d) { return d.id })
												.attr('d', function(d) {
													return gridLine(d.get('dna'));
												});


		// now what??


	};



};