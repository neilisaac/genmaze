// a hack by neil isaac

var MAZE_BOUND = 10;

function populateMaze(maze, x, y) {

	if (maze[x][y] != null) {
		return false;
	}

	if (x <= -MAZE_BOUND || x >= MAZE_BOUND || y <= -MAZE_BOUND || y >= MAZE_BOUND) {
		maze[x][y] = 1;
		return true;
	}

	var borders = 0;
	if (maze[x][y+1] == 1) {borders++;}
	if (maze[x][y-1] == 1) {borders++;}
	if (maze[x+1][y] == 1) {borders++;}
	if (maze[x-1][y] == 1) {borders++;}

	if (borders > 1) {
		maze[x][y] = 3;
		return false;
	}

	maze[x][y] = 1;
	var exits = false;
	var funcs = [
		function() {return populateMaze(maze, x+1, y)},
		function() {return populateMaze(maze, x-1, y)},
		function() {return populateMaze(maze, x, y-1)},
		function() {return populateMaze(maze, x, y+1)}]

	while (funcs.length) {
		var index = Math.floor(Math.random() * funcs.length);
		var func = funcs[index];
		funcs.splice(index, 1);
		exits |= func();
	}

	if (exits) {
		return true;
	} else {
		maze[x][y] = null;
		return false;
	}
}

function createMaze() {
	var maze = [];
	for (var x = -MAZE_BOUND; x < MAZE_BOUND+1; x++) {
		maze[x] = [];
		for (var y = -MAZE_BOUND; y < MAZE_BOUND+1; y++) {
			maze[x][y] = null;
		}
	}

	return maze;
}

function solveMaze(maze, x, z) {

	if (Math.abs(x) == MAZE_BOUND || Math.abs(z) == MAZE_BOUND) {
		return [[x, z]];
	}

	if (maze[x][z] != 1) {
		return null;
	}

	maze[x][z] = 2;

	var exits = false;

	var funcs = [
		function() {return solveMaze(maze, x+1, z)},
		function() {return solveMaze(maze, x-1, z)},
		function() {return solveMaze(maze, x, z-1)},
		function() {return solveMaze(maze, x, z+1)}]

	while (funcs.length) {
		var index = Math.floor(Math.random() * funcs.length);
		var func = funcs[index];
		funcs.splice(index, 1);
		var result = func();
		if (result != null) {
			result.push([x, z]);
			return result;
		}
	}

	return null;
}

function printMaze(maze) {
	var output = "";
	for (var y = -MAZE_BOUND; y < MAZE_BOUND+1; y++) {
		for (var x = -MAZE_BOUND; x < MAZE_BOUND+1; x++) {
			if (x == 0 && y == 0) {output += "o"}
			else if (maze[x][y] == 1) {output += " "}
			else if (maze[x][y] == 0) {output += "."}
			else {output += "x"}
		}
		output += "\n";
	}
	console.log(output);
}

function cubeNode(maze, x, z) {
	var y = 0;

	this.f = null;
	this.b = null;
	this.l = null;
	this.r = null;

	if (maze[x][z-1] != 1) {
		this.f = snazzyPlane();
		this.f.rotation.set(0, 0, 0);
		this.f.position.set(x, y, z - 0.5);
	}

	if (maze[x-1][z] != 1) {
		this.l = snazzyPlane();
		this.l.rotation.set(0, Math.PI/2, 0);
		this.l.position.set(x - 0.5, y, z);
	}

	if (maze[x][z+1] != 1) {
		this.b = snazzyPlane();
		this.b.rotation.set(0, Math.PI, 0);
		this.b.position.set(x, y, z + 0.5);
	}

	if (maze[x+1][z] != 1) {
		this.r = snazzyPlane();
		this.r.rotation.set(0, -Math.PI/2, 0);
		this.r.position.set(x + 0.5, y, z);
	}

	this.addToScene = function(scene) {
		if (this.l) { scene.add(this.l) }
		if (this.r) { scene.add(this.r) }
		if (this.f) { scene.add(this.f) }
		if (this.b) { scene.add(this.b) }
	}
}


function createCubes(maze) {
	var cubes = [];
	for (var x = -MAZE_BOUND; x < MAZE_BOUND+1; x++) {
		for (var z = -MAZE_BOUND; z < MAZE_BOUND+1; z++) {
			if (maze[x][z] == 1 && Math.abs(x) < MAZE_BOUND && Math.abs(z) < MAZE_BOUND) {
				cubes.push(new cubeNode(maze, x, z));
			}
		}
	}
	return cubes;
}
