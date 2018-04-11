// module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Vertices = Matter.Vertices,
    Bounds = Matter.Bounds

var engine;
var world;
var player;
var boxes;
var grounds;
var bounds;
var structures;
var points;
var buildingMap;
var projectiles;
var canvaswidth = 1800;
var canvasheight = 900;
var game = {};

function setup() {
	data.init();
	game.startingPoint = {
		x: 900, // random(canvaswidth * 0.1, canvaswidth * 0.9),
		y: 0, // random(canvasheight * 0.2, canvasheight * 0.8)
	},
	boxes = [];
	grounds = [];
	structures = [];
	projectiles = [];
	points = Matrix(19, 10, {stable: false, connections: []}, true);
	buildingMap = [
		Matrix(19, 9),
		Matrix(18, 10),
		Matrix(18, 9)
	];
	Body.create();
	createCanvas(canvaswidth, canvasheight);
	engine = Engine.create();
	world = engine.world;
	Engine.run(engine);
	
	// createGround(new Box(Bodies.rectangle(game.startingPoint.x, game.startingPoint.y, 200, 50, { isStatic: true }), "black", 999))
	player = setPlayer(player, 1);
	setBoundaries();
}

function draw() {
	background(data.background);
	// stroke(0);
	// for (var i = 0; i <= 1800; i+=100) {
	// 	for (var j = 0; j <= 900; j+=100) {
	// 		point(i, j);
	// 		ellipse(i, j, 2);
	// 	}
	// }

	keyDowned();
	
	if (player.destroy) {
		clearWorld();
	} else {
		player.draw();
	}
	player.mouse();
	for (var i = projectiles.length - 1; i >= 0; i--) {
		projectilei = projectiles[i];
		if (projectilei.destroy) {
			projectiles.splice(i,1)
		} else {
			projectilei.draw();
		}
	}
	for (var i = boxes.length - 1; i >= 0; i--) {
		boxi = boxes[i];
		if (boxi.destroy) {
			boxes.splice(i,1)
		} else {
			boxi.draw();
		}
	}
	for (var i = structures.length - 1; i >= 0; i--) {
		structurei = structures[i]
		if (structurei.destroy) {
			structures.splice(i,1)
		} else {
			structurei.draw();
		}

	}
	for (var i = grounds.length - 1; i >= 0; i--) {
		groundi = grounds[i];
		if (groundi.destroy) {
			grounds.splice(i,1)
		} else {
			groundi.draw();
		}
	}
}

function clearWorld() {
	Matter.World.clear(world, false);
	setup();
}

function getLength(a, b) {
	return sqrt((a.x - b.x)**2 + (a.y - b.y)**2)
}

function Matrix(m, n, x=0, b=false) {
    var matrix = Array(m);
	for (var i = 0; i < m; i++) {
	    matrix[i] = [];
	    for (var j = 0; j < n; j++) {
	    	z = JSON.parse(JSON.stringify(x))
	        matrix[i][j] = b ? z : x
	    }
	}

	return matrix
}

function pp(m="hi", n="XXX") {
	if (n == "XXX") {
		print(n)
		print(m)
	} else {
		print(m)
		print(n)
	}	
}

function rotateSet(arr, angle) {
	var newArr = [];
	for (var i = 0; i < arr.length; i++) {
		var x = sin(angle) * arr[i].x + cos(angle) * arr[i].y;
		var y = cos(angle) * arr[i].x - sin(angle) * arr[i].y;
		newArr[i] = {x: x, y: y};
	}
	return newArr;
}

function shiftSet(arr, shift) {
	var newArr = [];
	for (var i = 0; i < arr.length; i++) {
		var x = arr[i].x + shift.x;
		var y = arr[i].y + shift.y;
		newArr[i] = {x: x, y: y};
	}
	return newArr;
}

function shiftSetVoid(arr, shift) {
	for (var i = 0; i < arr.length; i++) {
		arr[i].x += shift.x;
		arr[i].y += shift.y;
	}
}

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

var randomProperty = function (obj) {
    var keys = Object.keys(obj);
    return keys[ keys.length * Math.random() << 0];
};

game.checkPoints = function() {
	for (var i = 0; i < 19; i++) {
		for (var j = 0; j < 10; j++) {
			points[i][j].stable = false;
		}
	}
	for (var i = 0; i < grounds.length; i++) {
		groundi = grounds[i];
		for (var j = 0; j < groundi.connections.length; j++) {
			if (!groundi.connections[j].stable) {
				game.stabilizePoints(groundi.connections[j]);
			}
		}
	}
	for (var i = 0; i < structures.length; i++) {
		structurei = structures[i];
		if (!structurei.connections[0].stable) {
			structurei.rip(false);
		}
	}
}

game.stabilizePoints = function(p) {
	p.stable = true;
	for (var i = 0; i < p.connections.length; i++) {
		tempC = p.connections[i].connections;
		for (var j = 0; j < tempC.length; j++) {
			pointi = tempC[j];
			if (!pointi.stable) {
				this.stabilizePoints(pointi);
			}
		}
	}
}