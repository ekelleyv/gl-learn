var gl;

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


var shaderProgram;

function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.vertexStrokeAttribute = gl.getAttribLocation(shaderProgram, "aVertexStroke");
    gl.enableVertexAttribArray(shaderProgram.vertexStrokeAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}


var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

var triangleVertexPositionBuffer;
var triangleVertexColorBuffer;
var triangleVertexStrokeBuffer;
var triangleVerticesIndexBuffer;
var mesh;

function initMesh() {
    var width = 25;
    mesh = new Mesh();

    // mesh.addColor(69/255, 209/255, 7/255, 1);
    // mesh.addColor(54/255, 218/255, 254/255, 1);
    // mesh.addColor(7/255, 173/255, 235/255, 1);
    // mesh.addColor(253/255, 227/255, 8/255, 1);
    // mesh.addColor(209/255, 50/255, 7/255, 1);

    mesh.addColor(1, 0, 0, 1);
    mesh.addColor(0, 1, 0, 1);
    mesh.addColor(0, 0, 1, 1);

    for (var i = 0; i < width; i++) {
        for (var j = 0; j < width; j++) {
            mesh.addVertex(new Vertex(i, j, 0));
        }
    }
    
    var cols = width-1;
    var rows = width-1;
    var tri_number = 0;
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            var bl = i*width + j;
            var tl = bl + 1;
            var tr = tl + width;
            var br = bl + width;

            var c = tri_number%mesh.numColors();
            tri_number += 1;

            var i_even = (i%2==0) ? 1 : 0;
            var j_even = (j%2==0) ? 1 : 0;
            addTriangle(i_even^j_even, tl, bl, br, tr, c);
        }
    }

    console.log(mesh);

}

function addTriangle(type, tl, bl, br, tr, c) {
    if (type == 0) {
        mesh.addTriangle(new Triangle(tl, br, bl, c));
        mesh.addTriangle(new Triangle(tl, tr, br, c));
    }
    else {
        mesh.addTriangle(new Triangle(bl, tr, br, c));
        mesh.addTriangle(new Triangle(tl, tr, bl, c));
    }
}

function initBuffers() {
    //Vertex positions
    triangleVertexPositionBuffer = gl.createBuffer();

    //Vertex colors
    triangleVertexColorBuffer = gl.createBuffer();

    //Vertex stroke
    triangleVertexStrokeBuffer = gl.createBuffer();

    //Triangle vertices
    triangleVerticesIndexBuffer = gl.createBuffer();

}

function updateBuffers() {
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);

    var vertices = mesh.flatVertices();

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    //Vertex colors
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);

    var colors = mesh.flatColors();

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    //Vertex stroke
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexStrokeBuffer);

    var bary = mesh.flatBary();

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bary), gl.STATIC_DRAW);

    //Triangle vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleVerticesIndexBuffer);

    var triangleVertexIndices = mesh.flatTriangles();

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleVertexIndices), gl.STATIC_DRAW);
}


function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, [-12, -5, -6.0]);

    // mat4.translate(mvMatrix, [-3, -3, -10.0]);

    mat4.rotate(mvMatrix, degToRad(-88), [1, 0, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mesh.triangleWidth(), gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, mesh.colorWidth(), gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexStrokeBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexStrokeAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleVerticesIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, mesh.flatLength(), gl.UNSIGNED_SHORT, 0);
}

var firstTime = new Date().getTime();

function animate() {
    var timeNow = new Date().getTime();
    mesh.update(timeNow-firstTime);
}


function tick() {
    requestAnimFrame(tick);
    stat.new_frame();
    updateBuffers();
    drawScene();
    animate();
    $('#log').html(stat.log());
}


var stat = new profiler();

function webGLStart() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    initShaders();
    initMesh();
    initBuffers();

    gl.clearColor(236/255, 241/255, 235/255, 1.0);
    gl.enable(gl.DEPTH_TEST);

    tick();
}
