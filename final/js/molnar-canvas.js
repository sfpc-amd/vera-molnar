var p5 = require('p5');

function MolnarCanvas() {
	this.sketch = function(p) {
		// big thanks to gene kogen for helping work this out!
		var canvas;
		var frameInterval  = 15;

		var outerRect;
		var innerRect;
		var gridMargin;

		var generationDrawingStarted = false;

		var m;

		p.setup = function() {
			var canvasHeight = p.windowHeight < p.windowWidth*.6 ? p.windowHeight : p.windowWidth*.6 ;

			canvas = p.createCanvas(p.windowWidth, canvasHeight);
			canvas.parent('main');
			p.setupBackground();
			p.drawBackground();
			// createOrder();
			lastToDraw = 1;
			frameInterval = 15;
			p.noFill();
			// background(0);
			p.stroke(0);
			p.strokeWeight(1);

			gridMargin = innerRect.w/10;
			m = new P5MolnarGrid(
				4
				, 4
				, innerRect.x+gridMargin
				, innerRect.y+gridMargin
				, innerRect.w - (gridMargin*2)
				, innerRect.h - (gridMargin*2)
				, [0, 13, 14, 3, 11, 6, 5, 8, 7, 10, 9, 4, 12, 1, 2, 15]
			);

			// m.createOrder();
			// drawGenerations();

		}

		p.draw = function() {

			p.drawBackground();
			m.draw();
			
		}

		p.setupBackground = function() {
			outerRect = {
					x: 0
					, y: 0
					, w: p.width/2
					, h: 4*p.height/5
					, c: p.color(235, 182, 116)
				}

			outerRect.x = p.width/2 - outerRect.w/2;
			outerRect.y = p.height/2 - outerRect.h/2;

			innerRect = {
					x: 0
					, y: 0
					, w: p.min(p.width/4, p.height/4)
					, h: p.min(p.width/4, p.height/4)
					, c: p.color(233, 196, 141)
				};

			innerRect.x = p.width/2 - innerRect.w/2;
			innerRect.y = p.height/2 - innerRect.h/2;

			console.log(outerRect, innerRect);
		}

		p.drawBackground = function() {
			p.push();
				p.background(238);
				p.noStroke()

				// draw outer rectangle
				p.fill(outerRect.c);
				p.rect(outerRect.x, outerRect.y, outerRect.w, outerRect.h);

				// draw inner rectangle
				p.fill(innerRect.c);
				p.rect(innerRect.x, innerRect.y, innerRect.w, innerRect.h);
			p.pop();
		}

	/**
	 * Convenience function to get the x/y of any indexed vertex
	 */
	function P5MolnarGrid(gridSizeX, gridSizeY, gridX, gridY, gridWidth, gridHeight, order) {
		this.gridSizeX = gridSizeX;
		this.gridSizeY = gridSizeY;
		this.lastToDraw = 1;
		this.order = order || [];


		this.draw = function() {
	 		// add 1 to lastToDraw every 10 frames
			var frameRemainder = p.frameCount % frameInterval;
			if(frameRemainder == 0) {
				this.lastToDraw = this.lastToDraw + 1;
				// we don't want lastToDraw to exceed the number
				// of elements in our array
				this.lastToDraw = p.min(this.lastToDraw, this.gridSizeX*this.gridSizeY);
			}

			// this will draw all the current vertices
			p.beginShape();
			for(var i=0; i<this.lastToDraw; i++) {

				var position = this.getPosition(this.order[i]);

				// draw the vertex
				p.vertex(position.x, position.y);
			}
			// stop drawing shape
			p.endShape();

			if(this.lastToDraw < this.gridSizeX*this.gridSizeY - 1) {

				// we can use lerp to interpolate between the last current vertex
				// and the next current vertex.
				// frameRemainder / 15 is our amount to interpolate
				var t = frameRemainder / frameInterval;
				var indexCurrent = this.order[this.lastToDraw - 1];
				var indexNext = this.order[p.min(this.lastToDraw, this.gridSizeX*this.gridSizeY)];

				// print("interp between " + indexCurrent + " " + indexNext);

				// let's interpolate between (x, y) at indexCurrent and (x, y)
				// at indexNext
				var positionCurrent = this.getPosition(indexCurrent);
				var positionNext = this.getPosition(indexNext);

				var x_next = p.lerp(positionCurrent.x, positionNext.x, t);
				var y_next = p.lerp(positionCurrent.y, positionNext.y, t);

				p.line(positionCurrent.x, positionCurrent.y, x_next,y_next);
			}
		}

		this.getPosition = function(index) {

				// use modulo (remainder) to get x position
				var col = index % this.gridSizeY;
				var row = p.floor(index / this.gridSizeX);

				// map our rows/cols to x/y coordinates
				var x = p.map(col, 0, this.gridSizeX-1, gridX, gridX + gridWidth);
				var y = p.map(row, 0, this.gridSizeY-1, gridY, gridY + gridHeight);

				return {
					x: x
					, y: y
				}	
		}

		/**
		 * Create a permeatation of the array of indexes
		 * corresponding to our 16 points
		 */
			this.createOrder = function() {
				// clear order
				this.order = [];
				// make new array of indexes to sample from
				var all = [];

				for(var k=0; k<this.gridSizeX*this.gridSizeY; k++) {
					all.push(k)
				}

				var len = all.length;

				// take a random element from all and append it to order, remove it from all
				for(var i=0; i<this.gridSizeX*this.gridSizeY; i++) {
					// pick a random index
					var index = p.floor(random(all.length));

					// append that element from all into order
					this.order.push(all[index]);

					// remove sampled element from all 
					all.splice(index, 1);

					p.println("Order: "+this.order);
					p.println("All: "+all);
				}		
			}

		}

	}

}

MolnarCanvas.prototype.init = function() {
 new p5(this.sketch);
}

module.exports = MolnarCanvas;