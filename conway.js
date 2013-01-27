// Conway's Game of Life
// By Dave Hulbert
// Code here is public domain and very sloppy: coding whilst watching season 3 of Fringe

var random;

(function() {


var canvas = document.getElementById('conway');
var ctx = canvas.getContext('2d');
var width = canvas.width;
var height = canvas.height;

function mapGrid(callback) {
	var x, y;
	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			callback(x, y);
		}
	}
}

function xyToPoint(x, y) {
	x = (width + x) % width;
	y = (height + y) % height;
	return 4 * (y * width + x);
}

function neighboursOn(x, y) {
	return [pointOn(x - 1, y - 1), pointOn(x, y - 1), pointOn(x + 1, y - 1),
			pointOn(x - 1, y), 	                	  pointOn(x + 1, y),
			pointOn(x - 1, y + 1), pointOn(x, y + 1), pointOn(x + 1, y + 1)];
}

function countNeighbours(x, y) {
	return neighboursOn(x, y).filter(function(o) {return o}).length;
}

var oldData = ctx.getImageData(0, 0, width, height);
var newDataArr = [];

function setXy(x, y, r, g, b, a) {
	var point = xyToPoint(x, y);
	newDataArr[point] = r;
	newDataArr[point+1] = g;
	newDataArr[point+2] = b;
	newDataArr[point+3] = a;
}

function setXyOld(x, y, r, g, b, a) {
	var point = xyToPoint(x, y);
	oldData.data[point] = r;
	oldData.data[point+1] = g;
	oldData.data[point+2] = b;
	oldData.data[point+3] = a;
}

function getXy(x, y) {
	var point = xyToPoint(x, y);
	return [oldData.data[point], oldData.data[point+1], oldData.data[point+2], oldData.data[point+3]];
}

function pointOn(x, y) {
	return !!getXy(x, y)[0];
}


random = function() {
	mapGrid(function(x, y) {
		var on = Math.random() > 0.93 ? 255 : 0;
		setXyOld(x, y, on, on, on, 255);
	});
	ctx.putImageData(oldData, 0, 0);	
}
random();

function iterate() {
	// get canvas data
	oldData = ctx.getImageData(0, 0, width, height);
	// newData = oldData;
	newDataArr = [];

	for (var i=0,len=oldData.data.length;i<len;++i) {
		newDataArr[i] = oldData.data[i];
	}

	mapGrid(function(x, y) {
		var current = pointOn(x, y);
		var neighbours = countNeighbours(x, y);
		// console.log(neighbours);
		if (current) {
		    current = neighbours == 2 || neighbours == 3;
		} else {
		    current = neighbours == 3;
		}
		var on = current ? 255 : 0;
		setXy(x, y, on, on, on, 255);
	});

	for (var i=0,len=oldData.data.length;i<len;++i) {
		oldData.data[i] = newDataArr[i];
	}

	ctx.putImageData(oldData, 0, 0);
}

setInterval(iterate, 100);

canvas.onmousemove = function(e) {
	var x = e.offsetX;
	var y = e.offsetY;
	setXyOld(x, y, 255, 255, 255, 255);
	setXyOld(x+1, y, 255, 255, 255, 255);
	setXyOld(x, y+1, 255, 255, 255, 255);
	setXyOld(x+1, y+1, 255, 255, 255, 255);
	ctx.putImageData(oldData, 0, 0);
}

}());
