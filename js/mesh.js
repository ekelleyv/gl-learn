function Mesh () {
	this.triangles = [];
	this.vertices = [];
	this.colors = [];
}

Mesh.prototype.addVertex = function(vertex) {
	this.vertices.push(vertex);
};

Mesh.prototype.getVertex = function(index) {
	if (index < this.vertices.length) {
		return this.vertices[index];
	}
	else {
		return undefined;
	}
};

Mesh.prototype.addTriangle = function(triangle) {
	this.triangles.push(triangle);
};

Mesh.prototype.getTriangle = function(triangle) {
	if (index < this.triangles.length) {
		return this.triangles[index];
	}
	else {
		return undefined;
	}
};

Mesh.prototype.addColor = function(r, g, b, a) {
	this.colors.push([r, g, b, a]);
};

Mesh.prototype.getColor = function(index) {
	if (index < this.colors.length) {
		return this.colors[index];
	}
	else {
		return undefined;
	}
};

Mesh.prototype.flatVertices = function() {
	var output = [];
	for (var i = 0; i < this.vertices.length; i++) {
		var vertex = this.vertices[i];
		output.push(vertex.x);
		output.push(vertex.y);
		output.push(vertex.z);
	}
	return output;
};

Mesh.prototype.flatTriangles = function() {
	var output = [];
	for (var i = 0; i < this.triangles.length; i++) {
		var triangle = this.triangles[i];
		output.push(triangle.v0);
		output.push(triangle.v1);
		output.push(triangle.v2);
	}
	return output;
};

//THIS IS TERRIBLE. YOU DONT KNOW JAVASCRIPT
Mesh.prototype.flatColors = function() {
	var output = [];
	for (var i = 0; i < this.triangles.length; i++) {
		var triangle = this.triangles[i];
		//Three times as there are 3 vertices per triangle
		var c = this.triangles[i].c
		var color = this.getColor(c);
		//A copy of each color value for each vertex (x3)
		for (var j = 0; j < this.vertexWidth(); j++) {
			output.push(color[0]);
			output.push(color[1]);
			output.push(color[2]);
			output.push(color[3]);

		}
	}
	return output;
};

Mesh.prototype.flatBary = function() {
	var output = [];
	for (var i = 0; i < this.triangles.length; i++) {
		output = output.concat([1, 0, 0,
								0, 1, 0,
								0, 0, 1]);
	}
	return output;
};

Mesh.prototype.flatLength = function() {
	return this.triangles.length*3;
};

Mesh.prototype.vertexWidth = function() {
	return 3;
};

Mesh.prototype.numTriangles = function() {
	return this.triangles.length;
};

Mesh.prototype.numColors = function() {
	return this.colors.length;
};

Mesh.prototype.colorWidth = function() {
	return 4;
};

Mesh.prototype.triangleWidth = function() {
	return 3;
};

Mesh.prototype.print = function() {
	console.log(this.vertices);
	console.log(this.triangles);
};