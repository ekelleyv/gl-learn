if ( !window.requestAnimationFrame ) {
  window.requestAnimationFrame = ( function() {
	  return window.webkitRequestAnimationFrame ||
	  window.mozRequestAnimationFrame ||
	  window.oRequestAnimationFrame ||
	  window.msRequestAnimationFrame ||
	  function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
		  window.setTimeout( callback, 1000 / 60 );
	  };
	})();
}

var Game = {};

Game.init = function () {
	// set the scene size
	var WIDTH = window.innerWidth,
	    HEIGHT = window.innerWidth;

	// set some camera attributes
	var VIEW_ANGLE = 45,
	    ASPECT = WIDTH / HEIGHT,
	    NEAR = 0.1,
	    FAR = 10000;

	Game.renderer = new THREE.WebGLRenderer();
	Game.camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
                                ASPECT,
                                NEAR,
                                FAR  );
	Game.scene = new THREE.Scene();

	Game.camera.position.z = 600;
	Game.scene.add(Game.camera);

	Game.renderer.setSize(WIDTH, HEIGHT);

	document.body.appendChild(Game.renderer.domElement);
};

Game.frameTime = 0; //ms
Game.cumFrameTime = 0; //ms
Game._lastFrameTime = Date.now(); //timestamp

Game.animate = function() {
	var time = Date.now();
	Game.frameTime = time - Game._lastFrameTime;
	Game._lastFrameTime = time;
	Game.cumulatedFrameTime += Game.frameTime;

	while(Game.cumulatedFrameTime > Game.gameStepTime) {
    // block movement will go here
		Game.cumulatedFrameTime -= Game.gameStepTime;
	}

	Game.renderer.render(Game.scene, Game.camera);

	Game.stats.update();

	if(!Game.gameOver) window.requestAnimationFrame(Game.animate);
}


window.addEventListener("load", Game.init);