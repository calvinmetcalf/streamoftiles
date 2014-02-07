var sm = require('sphericalmercator');
var Readable = require('readable-stream').Readable;
var util = require('util');

util.inherits(TileStream, Readable);

function TileStream(min, max, bbox) {
	Readable.call(this, {
		objectMode: true
	});
	this.min = min;
	this.max = max;
	this.bbox = bbox;
	this.z = min - 1;
}
TileStream.prototype.bumpZ = function(){
	var xyz = sm.xyz(this.bbox, ++this.z);
	this.curX this.minX = xyz.minX;
	this.maxX = xyz.maxX;
	this.curY = xyz.minY;
	this.maxY = xyz.maxY;
}
TileStream.prototype._read = function(){
	this.curX++;
	if(this.curX>this.maxX){
		this.curX=this.minX;
		this.curY++;
		if(this.curY>this.maxY){
			this.bumpZ();
			if(this.z>this.max){
				this.push(null);
			}
		}
	}
	if(this.push({
		x: this.curX,
		y: this.curY,
		z: this.z
	})){
		process.nextTick(function(){
			this._read();
		});
	}
}