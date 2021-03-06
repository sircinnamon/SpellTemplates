function Board(contextGrid, contextTiles) {
	this.hex_mode = false;
	this.tile_count = 0;
	this.tile_set = [];
	this.tile_size_multiplier = 1;
	this.origin = {x:null,y:null};
	this.tile_width = parseInt(settings.tile_size) || 30;
	this.tile_height = parseInt(settings.tile_size) || 30;
	this.height;
	this.width;
	this.hit_tile_colour = currentTheme.colours[7];

	this.drawBoard = function(base_x, base_y, width, height){
		var remaining_width = width;
		var remaining_height = height;
		this.origin = {x:base_x, y:base_y};
		var curr_x = base_x;
		var curr_y = base_y;
		this.tile_count=0;
		while(((base_y+height)-curr_y) >= this.tile_height+1){
			//console.log("REMAINING_Y vs CURR_Y: ",(base_y+height)-curr_y, "vs", curr_y);
			var row = [];
			while((base_x+width-curr_x) >= this.tile_width+1) {
				//console.log("REMAINING_X vs CURR_X: ",(base_x+width-curr_x), "vs", curr_x);
				var tile = new Tile(curr_x, curr_y, this.tile_height, this.tile_width, contextGrid, contextTiles);
				tile.drawTile();
				row.push(tile);
				curr_x+=this.tile_width;
				this.tile_count++;
			}
			remaining_width = width;
			curr_x = base_x;
			this.tile_set.push(row);
			curr_y += this.tile_height;
		}
		this.width = this.tile_set[0].length * this.tile_width;
		this.height = this.tile_set.length * this.tile_height;
	}

	this.getTileByCoord = function(x,y){
		x = x - this.origin.x;
		y = y - this.origin.y;
		if(y < 0){return null;}
		if(x < 0){return null;}
		x = (x - (x % this.tile_width))/this.tile_width;
		y = (y - (y % this.tile_height))/this.tile_height;
		if(y >= this.tile_set.length){return null;}
		if(x >= this.tile_set[0].length){return null;}
		return this.tile_set[y][x];
	}

	this.getRowByCoord = function(y){
		y = y - this.origin.y;
		if(y < 0){return null;}
		y = (y - (y % this.tile_height))/this.tile_height;
		if(y >= this.tile_set.length){return null;}
		return y;
	}

	this.getColByCoord = function(x){
		x = x - this.origin.x;
		if(x < 0){return null;}
		x = (x - (x % this.tile_width))/this.tile_width;
		if(x >= this.tile_set[0].length){return null;}
		return x;
	}

	this.showCoverageCone = function(verts){
		for(i = 0; i < this.tile_set.length; i++){
			for (var j = 0; j < this.tile_set[i].length; j++) {
				this.tile_set[i][j].calculateHitCone(verts);
			}
		}
	}

	this.clearTiles = function(){
		for(i = 0; i < this.tile_set.length; i++){
			for (var j = 0; j < this.tile_set[i].length; j++) {
				this.tile_set[i][j].clearTile();
			}
		}
	}

	this.resetHits = function(){
		for(i = 0; i < this.tile_set.length; i++){
			for (var j = 0; j < this.tile_set[i].length; j++) {
				this.tile_set[i][j].isHit = false;
				if(this.tile_set[i][j].entity){
					this.tile_set[i][j].entity.clear()
					this.tile_set[i][j].entity.draw()
				}
			}
		}
	}

	this.colourHits = function(fillstyle){
		fillstyle = fillstyle || this.hit_tile_colour;
		for(i = 0; i < this.tile_set.length; i++){
			for (var j = 0; j < this.tile_set[i].length; j++) {
				if(this.tile_set[i][j].isHit){
					this.tile_set[i][j].fillTile(fillstyle);
					if(this.tile_set[i][j].entity){
						this.tile_set[i][j].entity.clear()
						this.tile_set[i][j].entity.draw()
					}
				}
			}
		}
	}

	this.refresh = function(position){
		contextGrid.clearRect(this.origin.x-2, this.origin.y-2, this.origin.x + this.width + 2, this.origin.y + this.height + 2);
		contextTiles.clearRect(this.origin.x-2, this.origin.y-2, this.origin.x + this.width + 2, this.origin.y + this.height + 2);
		for(i = 0; i < this.tile_set.length; i++){
			for (var j = 0; j < this.tile_set[i].length; j++) {
				this.tile_set[i][j].drawTile();
			}
		}
		this.colourHits();
	}

	this.unitList = function(){
		var unitArray = [];
		for(i = 0; i < this.tile_set.length; i++){
			for (var j = 0; j < this.tile_set[i].length; j++) {
				if(this.tile_set[i][j].entity){
					unitArray.push({
						unit: this.tile_set[i][j].entity,
						x: j,
						y: i
					});
				}
			}
		}
		return unitArray
	}

	this.refreshTheme = function(){
		// Redraw Units
		var ul = this.unitList();
		for (var i = ul.length - 1; i >= 0; i--) {
			ul[i].unit.refreshTheme()
		}
		// Redraw Hits
		this.hit_tile_colour = currentTheme.colours[7];
		this.colourHits();
		// Redraw Tiles
		for (var i = this.tile_set.length - 1; i >= 0; i--) {
			for (var j = this.tile_set[i].length - 1; j >= 0; j--) {
				this.tile_set[i][j].refreshTheme();
			}
		}
	}

	this.clearUnits = function(){
		for(i = 0; i < this.tile_set.length; i++){
			for (var j = 0; j < this.tile_set[i].length; j++) {
				if(this.tile_set[i][j].entity){
					this.tile_set[i][j].entity = null;
				}
			}
		}
	}
}

