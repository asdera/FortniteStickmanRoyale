mouse = {
	x: 0,
	y: 0,
	down: false,
	abilty: false
}

function mousePressed() {
	// boxes.push(new Box(Bodies.rectangle(mouseX, mouseY, 40, 40, { restitution: 1 })));
	// boxes.push(new Box(Bodies.circle(mouseX, mouseY, 20, { restitution: 0.4 })));
	mouse.x = mouseX;
	mouse.y = mouseY;
	if (mouseButton == LEFT) {
		mouse.down = true;
		players[id].mouse(1);
	} else if (mouseButton == RIGHT) {
		mouse.abilty = true;
		players[id].mouse(2);
	}
}

function mouseReleased() {
	if (mouseButton == LEFT) {
		mouse.down = false;
		// if (false) {
		// 	if (Vertices.contains(players[id].body.vertices, {x: mouse.x, y: mouse.y})) {
		// 	if (players[id].grounded > 5) { 
		// 		if (sqrt((mouseX - mouse.x) ** 2 + (mouseX - mouse.x) ** 2) < 400) {
		// 			Body.applyForce(players[id].body, {x: mouse.x, y: mouse.y}, {x: (mouseX - mouse.x) / 2000, y: (mouseY - mouse.y) / 2000});
		// 		} else {
		// 			angle = atan2(mouseY - mouse.y, mouseX - mouse.x);
		// 			Body.applyForce(players[id].body, {x: mouse.x, y: mouse.y}, {x: Math.cos(angle) / 5, y: Math.sin(angle) / 5});
		// 		}
		// 	}
		// 	} else if (mouseX == mouse.x && mouseY == mouse.y) {
		// 		boxes.push(new Box(Bodies.circle(mouseX, mouseY, 40, { restitution: 1 }), "orange"));
		// 	} else if (abs(mouseX - mouse.x) * abs(mouseY - mouse.y) > 1000){
		// 		boxes.push(new Box(Bodies.rectangle(min(mouseX, mouse.x) + abs(mouseX - mouse.x) / 2, min(mouseY, mouse.y) + abs(mouseY - mouse.y) / 2, abs(mouseX - mouse.x), abs(mouseY - mouse.y), { restitution: 0.4 }), "darkgreen"));
		// 	}
		// }
	} else {
		mouse.abilty = false;
		players[id].controls("edit");
	}
}

function keyPressed() {
	if (keyCode == 90) {
		mouseButton = LEFT;
		mousePressed();
	}

	if (keyCode == 88) {
		mouseButton = RIGHT;
		mousePressed();
	}

	if (keyCode == 80) {
		// restart level
		clearWorld();
	}
	if (keyCode == 75) {
		createItem(mouseX, mouseY, makeItem(getWeapon(1)))
		// players[id].inventory.primary = makeItem(randomProperty(weapons));
	}
	if (keyCode == 76) {
		createChest(new Box(Bodies.rectangle(mouseX, mouseY, 50, 50), "#E89C1D", 100), 1.2, 1, 2);
		// players[id].inventory.primary = makeItem(randomProperty(weapons));
	}
	if (keyCode == 71) {
		// g
		players[id].controls("edit");
	}

	if (keyCode == 87 || keyCode == 32) {
		// w or space
		players[id].controls("jump");
	}
	if (keyCode == 49) {
		// 1
		players[id].controls("slot1");
	}
	if (keyCode == 50) {
		// 2
		players[id].controls("slot2");
	}
	if (keyCode == 51) {
		// 3
		players[id].controls("slot3");
	}
	// if (keyCode == 52) {
	// 	// 4
	// 	players[id].controls("ability");
	// }
	if (keyCode == 81) {
		// q
		players[id].controls("wall");
	}
	if (keyCode == 67) {
		// c
		players[id].controls("floor");
	}
	if (keyCode == 70) {
		// f
		players[id].controls("stairs");
	}
	if (keyCode == 82) {
		// r
		players[id].controls("reload");
	}
	if (keyCode == 69) {
		// e
		players[id].controls("interact");
	}
}

function keyReleased() {
	if (keyCode == 90) {
		mouseButton = LEFT;
		mouseReleased();
	}
	if (keyCode == 88) {
		mouseButton = RIGHT;
		mouseReleased();
	}
	if (keyCode == 86) {
		id = id%4+1
	}
}

function keyDowned() {
	if (keyIsDown(65)) {
		// a
		players[id].controls("left");
	}
	if (keyIsDown(68)) {
		// d
		players[id].controls("right");
	}
	if (keyIsDown(90)) {
		// shoot pebble
		
	}
}