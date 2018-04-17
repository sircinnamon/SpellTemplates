// Box width
var bw;
// Box height
var bh;
// Mouse currently up or down
var mousedown = false;

var canvasDiv = document.getElementById("canvasDiv");
var canvasGrid = document.getElementById("canvasGrid");
var contextGrid = canvasGrid.getContext("2d");
var canvasUnits = document.getElementById("canvasUnits");
var contextUnits = canvasUnits.getContext("2d");
var canvasTemplate = document.getElementById("canvasTemplate");
var contextTemplate = canvasTemplate.getContext("2d");
var canvasTiles = document.getElementById("canvasTiles");
var contextTiles = canvasTiles.getContext("2d");

var board;
var template;

function getMousePos(canvasGrid, event) {
	var rect = canvasGrid.getBoundingClientRect();
	if(event.touches){event = event.touches[0];}
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
}

function resizeCanvas(canvas, width, height) {
	canvas.width = width;
	canvas.height = height;
}

function mousedown_func(evt) {
	evt.preventDefault();
	mousedown = true;
	var mousePos = getMousePos(canvasGrid, evt);
	//console.log(mousedown, mousePos); 
	template.clear();
	board.clearTiles();
	//template.drawBox(mousePos, board.getTileByCoord(mousePos.x, mousePos.y));
	template.setOrigin(mousePos, board.getTileByCoord(mousePos.x, mousePos.y));
	mousemove_func(evt);
}

function mousemove_func(evt) {
	evt.preventDefault();
	if(mousedown){
		var mousePos = getMousePos(canvasGrid, evt);
		template.setVector(mousePos,200);
		template.clear();
		template.drawCone();
		if(template.originLocked){template.drawOrigin();}

		board.resetHits();
		board.clearTiles();
		template.calculateHitCone(board);
		board.colourHits("orange");
	}
}

function mouseup_func(evt) {
	evt.preventDefault();
	mousedown = false;
	board.resetHits();
	board.clearTiles();
	template.calculateHitCone(board);
	board.colourHits("orange");
}

function dblclick_func(evt) {
	evt.preventDefault();
	var mousePos = getMousePos(canvasGrid, evt);
	if(template.originLocked){
		template.unlockOrigin();
		//Move origin and draw new template
		mousedown_func(evt);
		board.clearTiles();
		mousedown=false;
	} else {
		template.lockOrigin();
		template.drawOrigin();
	}
}

function resize_func(evt) {
	clearTimeout(resizeTimer);
	//console.log("resize event fired");
	var resizeTimer = setTimeout(function() {

		//console.log("resize event processed");
		init_canvases();
	          
	}, 200);
}

function init_canvases() {
	bw = parseInt(getComputedStyle(canvasDiv, null).getPropertyValue("width").replace("px", ""));
	bh = parseInt(getComputedStyle(canvasDiv, null).getPropertyValue("height").replace("px", ""));

	resizeCanvas(canvasGrid, bw, bh);
	resizeCanvas(canvasUnits, bw, bh);
	resizeCanvas(canvasTemplate, bw, bh);
	resizeCanvas(canvasTiles, bw, bh);

	board = new Board(contextGrid, contextTiles);
	template = new Template(contextTemplate, canvasTemplate.width, canvasTemplate.height);

	board.drawBoard(Math.floor(((bw-1)%board.tile_width)/2), 0, bw, bh);
}

init_canvases();

canvasGrid.addEventListener('mousedown', mousedown_func, false);
canvasGrid.addEventListener('touchstart', mousedown_func, false);
canvasGrid.addEventListener('mousemove', mousemove_func, false);
canvasGrid.addEventListener('touchmove', mousemove_func, false);
canvasGrid.addEventListener('mouseup', mouseup_func, false);
canvasGrid.addEventListener('touchend', mouseup_func, false);
canvasGrid.addEventListener('dblclick', dblclick_func, false);
document.defaultView.addEventListener('resize', function(evt){resize_func(evt)}, false);

