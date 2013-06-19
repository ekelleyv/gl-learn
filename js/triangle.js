function Triangle (v0, v1, v2, c) {
	this.v0 = v0;
	this.v1 = v1;
	this.v2 = v2;
	this.c = c;
}

Triangle.prototype.flatten = function() {
	return [this.v0, this.v1, this.v2];
};