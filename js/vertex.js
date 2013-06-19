function Vertex (x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;

	this.offset = Math.random()*2*Math.PI;
	this.scale = Math.random()*.4;

}

Vertex.prototype.flatten = function() {
	return [this.x, this.y, this.z];
};

Vertex.prototype.update = function(t){
	this.z = this.scale*Math.sin(this.offset + t/150);
}