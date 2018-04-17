// module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Vertices = Matter.Vertices,
    Bounds = Matter.Bounds

var id = 1;
var engine;
var world;
var players;
var items;
var grounds;
var boxes;
var bounds;
var structures;
var points;
var buildingMap;
var projectiles;
var particles;
var destination;
var canvaswidth = 1800;
var canvasheight = 900;
var game = {
	frames: 0,
	storm: {
		left: 0,
		right: 1800,
		speedLeft: 0,
		speedRight: 0,
		distance: 600,
		intervals: 4000,
		damage: 0,
	},
	supplyDrop: {
		size: 60,
		intervals: 2400,
		score: 1.6,
		guns: 3,
		items: 10,
	},
	draw: function() {
		this.frames++;
		if (this.frames % this.supplyDrop.intervals == 0) {
			createChest(new Box(Bodies.rectangle(random(this.storm.left, this.storm.right), 0, this.supplyDrop.size, this.supplyDrop.size), "#5EC5FA", 300), this.supplyDrop.score, this.supplyDrop.guns, this.supplyDrop.items);
		}
		if (this.frames % this.storm.intervals == 1) {
			var move = floor(random(this.storm.distance));
			this.storm.speedLeft = move/(this.storm.intervals/2);
			this.storm.speedRight = (this.storm.distance-move)/(this.storm.intervals/2);
			this.storm.damage++;
		}
		if (this.frames % this.storm.intervals >= this.storm.intervals/2) {
			this.storm.left += this.storm.speedLeft;
			this.storm.right -= this.storm.speedRight;
		}
		if (this.frames % 10 == 0) {
			for (var i = players.length - 1; i >= 0; i--) {
				var playeri = players[i];
				if (playeri) {
					if (playeri.body.position.x < this.storm.left || playeri.body.position.x > this.storm.right) {
						playeri.damage(this.storm.damage);
					}
				}
			}
		}
		fill(color(37, 38, 154, 150))
		stroke(color(37, 38, 154));
		strokeWeight(5);
		rect(0, 0, this.storm.left, 900);
		rect(this.storm.right, 0, 1800, 900);
	}
};

function setup() {
	data.init();
	editorMode = true;
	players = [];
	items = [];
	grounds = [];
	boxes = [];
	structures = [];
	projectiles = [];
	particles = [];
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
	destination = "tomato"
	for (var i = 1; i <= 4; i++) {
		players[i] = setPlayer(maps[destination].spawns[i].x, maps[destination].spawns[i].y, i);
	}
	setMap();
}

function draw() {
	background(data.background);
	stroke(0);
	strokeWeight(1);
	for (var i = 0; i <= 1800; i+=100) {
		for (var j = 0; j <= 900; j+=100) {
			point(i, j);
			ellipse(i, j, 2);
		}
	}

	game.draw();

	keyDowned();

	for (var i = players.length - 1; i >= 0; i--) {
		var playeri = players[i];
		if (playeri) {
			if (playeri.destroy) {
				players.splice(i,1)
			} else {
				playeri.draw();
			}
			playeri.mouse();
		}
	}
	for (var i = projectiles.length - 1; i >= 0; i--) {
		var projectilei = projectiles[i];
		if (projectilei.destroy) {
			projectiles.splice(i,1)
		} else {
			projectilei.draw();
		}
	}
	for (var i = items.length - 1; i >= 0; i--) {
		var itemi = items[i];
		if (itemi.destroy) {
			items.splice(i,1)
		} else {
			itemi.draw();
		}
	}
	for (var i = boxes.length - 1; i >= 0; i--) {
		var boxi = boxes[i];
		if (boxi.destroy) {
			boxes.splice(i,1)
		} else {
			boxi.draw();
		}
	}
	for (var i = structures.length - 1; i >= 0; i--) {
		var structurei = structures[i]
		if (structurei.destroy) {
			structures.splice(i,1)
		} else {
			structurei.draw();
		}
	}
	for (var i = grounds.length - 1; i >= 0; i--) {
		var groundi = grounds[i];
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

function makerMap() {
	var sss = ""
	for (var i = structures.length - 1; i >= 0; i--) {
		var structurei = structures[i]
		sss += "["+structurei.mapX*100+", "+structurei.mapY*100+", {type: "+structurei.type+", edit: "+structurei.edit+"}, addMap]\n"
	}
	return sss
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