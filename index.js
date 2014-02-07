var SphericalMercator = require('sphericalmercator');
var Readable = require('readable-stream').Readable;
var util = require('util');
var sm = new SphericalMercator({
    size: 256
});
util.inherits(TileStream, Readable);

function TileStream(min, max, bbox) {
	Readable.call(this, {
		objectMode: true
	});
	this.min = min;
	this.max = max;
	this.bbox = bbox;
	this.z = min - 1;
	this.bumpZ();
	this.done = false;
}
TileStream.prototype.bumpZ = function(){
	var xyz = sm.xyz(this.bbox, ++this.z);
	this.curX = this.minX = xyz.minX;
	this.maxX = xyz.maxX;
	this.curY = xyz.minY;
	this.maxY = xyz.maxY;
};
TileStream.prototype._read = function(){
	if (this.done) {
		return;
	}
	var self = this;
	var flowing = this.push({
		x: this.curX,
		y: this.curY,
		z: this.z
	});
	this.curX++;
	if(this.curX>this.maxX){
		this.curX=this.minX;
		this.curY++;
		if(this.curY>this.maxY){
			this.bumpZ();
			if(this.z>this.max){
				this.done = true;
				this.push(null);
			}
		}
	}
	if(!this.done && flowing){
		process.nextTick(function(){
			self._read();
		});
	}
};
module.exports = TileStream;