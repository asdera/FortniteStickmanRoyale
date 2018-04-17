// BUILDING
data = {
	background: "#a0a0a0",
	mats: {
		wood: 100000,
		brick: 100000,
		metal: 100000,
	},
	wood: {
		name: "wood",
		colour: "#ffa54f",
		hp: 200,
		spawnHp: 100,
		next: "brick"
	},
	brick: {
		name: "brick",
		colour: "#aa3311",
		hp: 300,
		spawnHp: 70,
		next: "metal"
	},
	metal: {
		name: "metal",
		colour: "#424242",
		hp: 400,
		spawnHp: 40,
		next: "wood"
	},
	draw: function(pos, angle, gun, lineColour=false) {
		if (lineColour) {
			stroke(lineColour);
			strokeWeight(2);
			for (var s in gun.lines) {
				var dash = gun.lines[s]
				if (gun.shift) {
					dash = shiftSet(dash, gun.shift);
				}
				dash = rotateSet(dash, abs(angle));
				line(pos.x, pos.y, pos.x+dash[0].x * Math.sign(angle), pos.y+dash[0].y)
		    }
		}
	    stroke("white");
	    strokeWeight(1);
		for (var s in gun.shapes) {
			var shape = gun.shapes[s]
			fill(shape[shape.length-1]);
			shape = shape.slice(0, -1);
			if (gun.shift && lineColour) {
				shape = shiftSet(shape, gun.shift);
			}
			shape = rotateSet(shape, abs(angle));
			beginShape();
	        for (var i = 0; i < shape.length; i++) {
				var vertexi = shape[i];
				vertex(pos.x+vertexi.x * Math.sign(angle), pos.y+vertexi.y);
	        }
	        endShape(CLOSE);
	    }
	},
	moveShapes: function(gun, shift) {
		for (var s in gun.shapes) {
			var shape = gun.shapes[s]
			shape = shiftSetVoid(shape.slice(0, -1), shift);
	    }
	    for (var s in gun.lines) {
			var dash = gun.lines[s]
			dash = shiftSetVoid(dash, shift);
	    }
	},
	init: function() {
	},
	allWeapons: ["assaultRifle", "burstRifle", "scarRifle", "boltSniper", "autoSniper", "pumpShotgun", "tacticalShotgun", "silencedSMG", "tacticalSMG", "regularPistol", "silencedPistol", "regularRevolver", "rocketLauncher", "grenadeLauncher"],
	commonWeapons: ["assaultRifle", "pumpShotgun", "silencedSMG", "regularPistol", "regularRevolver"],
	uncommonWeapons: ["tacticalShotgun", "tacticalSMG"],
	rareWeapons: ["burstRifle", "boltSniper"],
	epicWeapons: ["scarRifle", "autoSniper", "silencedPistol"],
	legendaryWeapons: ["rocketLauncher", "grenadeLauncher"],
	specialistWeapons: ["deathMachine", "homingGuppies", "biopulsarNullifier", "tropicalKatana"],
	resources: ["woodMats", "brickMats", "metalMats", "lightAmmo", "mediumAmmo", "heavyAmmo", "shellAmmo", "rocketAmmo"],
}

weapons = {
	empty: {
		empty: true,
		damage: 50,
		colour: "red",
		ammoType: "magic",
		fireType: "auto",
		fireRate: 50,
		clipSize: Infinity,
		reload: 120,
		bulletSize: 6,
		speed: 0.004,
		lifeSpan: 5,
		gravity: 0.1,
		spread: 10,
		autoFire: function(player) {
			var pos = player.stickPoints.head;
			var force = this.speed / this.gravity;
			var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
			var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id, {lifeSpan: this.lifeSpan});
			Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
		},
		shapes: {},
		lines: {
			hand1: [{x: 18, y: 4}],
			hand2: [{x: 15, y: 12}],
		},
	},
	assaultRifle: {
		damage: 30,
		colour: "gray",
		ammoType: "medium",
		fireType: "auto",
		fireRate: 10,
		clipSize: 30,
		reload: 120,
		bulletSize: 5,
		speed: 0.0025,
		gravity: 0.1,
		spread: 5,
		autoFire: function(player) {
			var pos = player.stickPoints.head;
			var force = this.speed / this.gravity;
			var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
			var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id);
			Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
		},
		shapes: {
			body: [{x: -8, y: -2}, {x: -6, y: -6}, {x: 6, y: -6}, {x: 8, y: -2}, {x: 8, y: 2}, {x: -6, y: 6}, {x: -8, y: 2}, "#727C88"],
			ring: [{x: 8, y: -2}, {x: 10, y: -2}, {x: 10, y: 2}, {x: 8, y: 2}, "white"],
			guard: [{x: 10, y: -4}, {x: 22, y: -2}, {x: 22, y: 2}, {x: 10, y: 4}, "black"],
			barrel: [{x: 22, y: -1}, {x: 30, y: -1}, {x: 30, y: 1}, {x: 22, y: 1}, "gray"],
			stock: [{x: -18, y: -10}, {x: -8, y: -2}, {x: -8, y: 2}, {x: -18, y: 6}, "black"],
			grip: [{x: -8, y: -12}, {x: -4, y: -12}, {x: -2, y: -6}, {x: -6, y: -6}, "black"],
			magazine: [{x: 2, y: -14}, {x: 7, y: -14}, {x: 5, y: -6}, {x: 0, y: -6}, "gray"],
		},
		lines: {
			hand1: [{x: -4, y: -10}],
			hand2: [{x: 15, y: -4}],
		},
		shift: {x: 16, y: 6}
	},
	burstRifle: {
		damage: 30,
		number: 3,
		colour: "blue",
		ammoType: "medium",
		fireType: "auto",
		fireRate: 35,
		clipSize: 30,
		reload: 120,
		bulletSize: 5,
		speed: 0.0025,
		gravity: 0.1,
		spread: 4,
		autoFire: function(player) {
			var pos = player.stickPoints.head;
			var force = this.speed / this.gravity;
			var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
			var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id);
			Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
			for (var i = 0; i < this.number-1; i++) {
				player.action(function(player, gun) {
					var pos = player.stickPoints.head;
					var force = gun.speed / gun.gravity;
					var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(gun.spread*player.aim), radians(gun.spread*player.aim));
					var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, gun.bulletSize, { gravityScale: gun.gravity, friction: 0, frictionAir: 0 }), gun.colour), gun.damage, player.id);
					Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
				}, (i+1) * 5, this)
			}
		},
		shapes: {
			body: [{x: -8, y: -3}, {x: 8, y: -3}, {x: 8, y: 4}, {x: -8, y: 4}, "#184F72"],
			sight: [{x: 18, y: -2}, {x: 26, y: -2}, {x: 20, y: 8}, {x: 18, y: 8}, "#C3C1C1"],
			guard: [{x: 8, y: -3}, {x: 22, y: -2}, {x: 22, y: 2}, {x: 8, y: 3}, "#93531B"],
			barrel: [{x: 22, y: -2}, {x: 30, y: -2}, {x: 30, y: 0}, {x: 22, y: 0}, "gray"],
			stock: [{x: -18, y: -10}, {x: -8, y: -2}, {x: -8, y: 2}, {x: -18, y: 0}, "#93531B"],
			grip: [{x: -8, y: -12}, {x: -4, y: -12}, {x: -2, y: -3}, {x: -6, y: -3}, "#93531B"],
			magazine: [{x: 2, y: -14}, {x: 7, y: -14}, {x: 5, y: -3}, {x: 0, y: -3}, "blue"],
		},
		lines: {
			hand1: [{x: -4, y: -10}],
			hand2: [{x: 15, y: -4}],
		},
		shift: {x: 16, y: 6}
	},
	scarRifle: {
		damage: 35,
		colour: "purple",
		ammoType: "medium",
		fireType: "auto",
		fireRate: 12,
		clipSize: 30,
		reload: 120,
		bulletSize: 5,
		speed: 0.003,
		gravity: 0.1,
		spread: 2.5,
		autoFire: function(player) {
			var pos = player.stickPoints.head;
			var force = this.speed / this.gravity;
			var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
			var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id);
			Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
		},
		shapes: {
			body: [{x: -8, y: -4}, {x: 20, y: -4}, {x: 20, y: 4}, {x: -8, y: 4}, "#C6AA80"],
			sight: [{x: 18, y: 4}, {x: 20, y: 4}, {x: 20, y: 12}, {x: 18, y: 12}, "#C6AA80"],
			barrel: [{x: 20, y: -3}, {x: 30, y: -3}, {x: 30, y: 0}, {x: 20, y: 0}, "purple"],
			stock: [{x: -18, y: -10}, {x: -8, y: -4}, {x: -8, y: 3}, {x: -18, y: 0}, "#4C4442"],
			grip: [{x: -8, y: -12}, {x: -4, y: -12}, {x: -2, y: -4}, {x: -6, y: -4}, "#4C4442"],
			magazine: [{x: 2, y: -14}, {x: 7, y: -14}, {x: 5, y: -4}, {x: 0, y: -4}, "purple"],
		},
		lines: {
			hand1: [{x: -4, y: -10}],
			hand2: [{x: 15, y: -4}],
		},
		shift: {x: 16, y: 6}
	},
	// huntingSniper: {
	// 	damage: 80,
	// 	colour: "green",
	// 	ammoType: "heavy",
	// 	fireType: "semi",
	// 	fireRate: 60,
	// 	clipSize: 5,
	// 	reload: 120,
	// 	bulletSize: 6,
	// 	speed: 0.005,
	// 	gravity: 0.25,
	// 	spread: 3,
	// 	semiFire: function(player) {
	// 		pos = player.stickPoints.head;
	// 		force = this.speed / this.gravity;
	// 		angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
	// 		bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id);
	// 		Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
	// 	}	
	// },
	boltSniper: {
		damage: 120,
		colour: "blue",
		ammoType: "heavy",
		fireType: "semi",
		fireRate: 120,
		clipSize: 10,
		reload: 120,
		bulletSize: 7,
		speed: 0.009,
		gravity: 0.5,
		spread: 0,
		semiFire: function(player) {
			var pos = player.stickPoints.head;
			var force = this.speed / this.gravity;
			var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
			var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id);
			Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
		},
		shapes: {
			stock: [{x: -22, y: -12}, {x: 10, y: 4}, {x: -22, y: 4}, "#AB9A87"],
			body: [{x: -8, y: -4}, {x: 20, y: 0}, {x: 20, y: 4}, {x: -8, y: 4}, "#AB9A87"],
			sight: [{x: 2, y: 4}, {x: 10, y: 4}, {x: 10, y: 8}, {x: 2, y: 8}, "black"],
			scope: [{x: -6, y: 14}, {x: 10, y: 12}, {x: 2, y: 12}, {x: 18, y: 14}, {x: 18, y: 6}, {x: 10, y: 8}, {x: 2, y: 8}, {x: -6, y: 6}, "black"],
			barrel: [{x: 20, y: 1}, {x: 44, y: 1}, {x: 44, y: 4}, {x: 20, y: 4}, "blue"],
		},
		lines: {
			hand1: [{x: -16, y: -6}],
			hand2: [{x: 12, y: -2}],
		},
		shift: {x: 10, y: 4}
	},
	autoSniper: {
		damage: 60,
		colour: "purple",
		ammoType: "heavy",
		fireType: "semi",
		fireRate: 40,
		clipSize: 10,
		reload: 120,
		bulletSize: 7,
		speed: 0.009,
		gravity: 0.5,
		spread: 0,
		semiFire: function(player) {
			var pos = player.stickPoints.head;
			var force = this.speed / this.gravity;
			var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
			var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id);
			Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
		},
		shapes: {
			stock: [{x: -22, y: -8}, {x: -4, y: 4}, {x: -8, y: 4}, {x: -18, y: -2}, {x: -18, y: 4}, {x: -22, y: 4}, "#532D19"],
			body: [{x: -8, y: -4}, {x: 20, y: -4}, {x: 20, y: 4}, {x: -8, y: 4}, "#383E3C"],
			grip: [{x: -8, y: -12}, {x: -4, y: -12}, {x: -2, y: -4}, {x: -6, y: -4}, "#532D19"],
			sight: [{x: 2, y: 4}, {x: 10, y: 4}, {x: 10, y: 8}, {x: 2, y: 8}, "#383E3C"],
			scope: [{x: -6, y: 14}, {x: 0, y: 14}, {x: 0, y: 6}, {x: -6, y: 6}, "black"],
			scope1: [{x: 0, y: 12}, {x: 12, y: 12}, {x: 12, y: 8}, {x: 0, y: 8}, "black"],
			scope2: [{x: 12, y: 14}, {x: 18, y: 14}, {x: 18, y: 6}, {x: 12, y: 6}, "black"],
			barrel: [{x: 20, y: 1}, {x: 44, y: 1}, {x: 44, y: 4}, {x: 20, y: 4}, "purple"],
		},
		lines: {
			hand1: [{x: -4, y: -10}],
			hand2: [{x: 12, y: -2}],
		},
		shift: {x: 10, y: 4}
	},
	// handCannon: {
	// 	damage: 80,
	// 	colour: "purple",
	// 	ammoType: "heavy",
	// 	fireType: "semi",
	// 	fireRate: 25,
	// 	clipSize: 7,
	// 	reload: 120,
	// 	bulletSize: 6,
	// 	speed: 0.005,
	// 	gravity: 0.25,
	// 	spread: 5,
	// 	semiFire: function(player) {
	// 		var pos = player.stickPoints.head;
	// 		var force = this.speed / this.gravity;
	// 		var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
	// 		var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id);
	// 		Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
	// 	}	
	// },
	pumpShotgun: {
		damage: 20,
		number: 10,
		colour: "gray",
		ammoType: "shell",
		fireType: "semi",
		fireRate: 80,
		clipSize: 5,
		reload: 120,
		bulletSize: 4.5,
		speed: 0.003,
		gravity: 0.1,
		spread: 15,
		semiFire: function(player) {
			var pos = player.stickPoints.head;
			var force = this.speed / this.gravity;
			for (var i = 0; i < this.number; i++) {
				var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
				var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id);
				Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
			}
		},
		shapes: {
			barrel: [{x: 0, y: -4}, {x: 10, y: -4}, {x: 30, y: 0}, {x: 30, y: 4}, {x: 0, y: 4}, "#272C32"],
			stock: [{x: -10, y: -8}, {x: 0, y: -4}, {x: 0, y: 4}, {x: -10, y: 0}, "#A48163"],
		},
		lines: {
			hand1: [{x: -4, y: -4}],
			hand2: [{x: 18, y: -2}],
		},
		shift: {x: 14, y: 4}
	},
	tacticalShotgun: {
		damage: 10,
		number: 8,
		colour: "green",
		ammoType: "shell",
		fireType: "semi",
		fireRate: 30,
		clipSize: 8,
		reload: 120,
		bulletSize: 4.5,
		speed: 0.0025,
		gravity: 0.1,
		spread: 12,
		semiFire: function(player) {
			var pos = player.stickPoints.head;
			var force = this.speed / this.gravity;
			for (var i = 0; i < this.number; i++) {
				var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
				var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id);
				Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
			}
		},
		shapes: {
			body: [{x: 0, y: -4}, {x: 16, y: -4}, {x: 24, y: -8}, {x: 24, y: 8}, {x: 4, y: 8}, {x: 0, y: 4}, "#55D54B"],
			stock: [{x: -10, y: -8}, {x: 0, y: -4}, {x: 0, y: 4}, {x: -10, y: 4}, "#6A706A"],
			grip: [{x: 2, y: -12}, {x: 6, y: -12}, {x: 8, y: -4}, {x: 4, y: -4}, "#B4B34C"],
			barrel: [{x: 24, y: -1}, {x: 30, y: -1}, {x: 30, y: 3}, {x: 24, y: 3}, "green"],
		},
		lines: {
			hand1: [{x: -4, y: -4}],
			hand2: [{x: 18, y: -2}],
		},
		shift: {x: 14, y: 4}
	},
	// heavyShotgun: {
	// 	damage: 20,
	// 	number: 6,
	// 	colour: "purple",
	// 	ammoType: "shell",
	// 	fireType: "semi",
	// 	fireRate: 50,
	// 	clipSize: 6,
	// 	reload: 120,
	// 	bulletSize: 4.5,
	// 	speed: 0.0035,
	// 	gravity: 0.1,
	// 	spread: 6,
	// 	semiFire: function(player) {
	// 		var pos = player.stickPoints.head;
	// 		var force = this.speed / this.gravity;
	// 		for (var i = 0; i < this.number; i++) {
	// 			var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
	// 			var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id);
	// 			Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
	// 		}
	// 	}	
	// },
	silencedSMG: {
		damage: 25,
		colour: "gray",
		ammoType: "light",
		fireType: "auto",
		fireRate: 6,
		clipSize: 24,
		reload: 120,
		bulletSize: 4,
		speed: 0.0015,
		gravity: 0.1,
		spread: 6,
		autoFire: function(player) {
			var pos = player.stickPoints.head;
			var force = this.speed / this.gravity;
			var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
			var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id);
			Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
		},
		shapes: {
			body: [{x: -15, y: 2}, {x: 0, y: 2}, {x: 0, y: 12}, {x: -15, y: 12}, "black"],
			barrel: [{x: 0, y: 4}, {x: 12, y: 4}, {x: 12, y: 10}, {x: 0, y: 10}, "black"],
			suppressor: [{x: 12, y: 5}, {x: 20, y: 5}, {x: 20, y: 9}, {x: 12, y: 9}, "gray"],
			magazine: [{x: -8, y: -8}, {x: -2, y: -8}, {x: -2, y: 2}, {x: -8, y: 2}, "gray"],
			grip: [{x: -16, y: -6}, {x: -12, y: -6}, {x: -10, y: 2}, {x: -14, y: 2}, "black"]
		},
		lines: {
			hand1: [{x: -15, y: -3}],
			hand2: [{x: -15, y: -3}],
		},
		shift: {x: 20, y: 0}
	},
	tacticalSMG: {
		damage: 20,
		colour: "green",
		ammoType: "light",
		fireType: "auto",
		fireRate: 4,
		clipSize: 36,
		reload: 120,
		bulletSize: 5,
		speed: 0.002,
		gravity: 0.1,
		spread: 6,
		autoFire: function(player) {
			var pos = player.stickPoints.head;
			var force = this.speed / this.gravity;
			var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
			var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id);
			Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
		},
		shapes: {
			body: [{x: -18, y: 8}, {x: -18, y: 6}, {x: -15, y: 2}, {x: 4, y: 2}, {x: 4, y: 12}, {x: -15, y: 12}, "#81C426"],
			barrel: [{x: 4, y: 2}, {x: 16, y: 6}, {x: 16, y: 8}, {x: 4, y: 12}, "#D5C4B4"],
			magazine: [{x: -8, y: -8}, {x: -2, y: -8}, {x: -2, y: 2}, {x: -8, y: 2}, "green"],
			grip: [{x: -16, y: -6}, {x: -12, y: -6}, {x: -10, y: 2}, {x: -14, y: 2}, "darkgreen"]
		},
		lines: {
			hand1: [{x: -15, y: -3}],
			hand2: [{x: -15, y: -3}],
		},
		shift: {x: 20, y: 0}
	},
	regularPistol: {
		damage: 20,
		colour: "gray",
		ammoType: "light",
		fireType: "semi",
		fireRate: 5,
		clipSize: 16,
		reload: 120,
		bulletSize: 4,
		speed: 0.0015,
		gravity: 0.2,
		spread: 10,
		semiFire: function(player) {
			var pos = player.stickPoints.head;
			var force = this.speed / this.gravity;
			var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
			var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id);
			Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
		},
		shapes: {
			body: [{x: -10, y: -2}, {x: -6, y: -2}, {x: -6, y: 4}, {x: 10, y: 4}, {x: 10, y: 10}, {x: -10, y: 10}, "gray"],
		},
		lines: {
			hand1: [{x: -10, y: 0}],
			hand2: [{x: -10, y: 0}],
		},
		shift: {x: 22, y: 0}
	},
	silencedPistol: {
		damage: 25,
		colour: "purple",
		ammoType: "light",
		fireType: "semi",
		fireRate: 5,
		clipSize: 16,
		reload: 120,
		bulletSize: 3,
		speed: 0.001,
		gravity: 0.1,
		spread: 2.5,
		semiFire: function(player) {
			var pos = player.stickPoints.head;
			var force = this.speed / this.gravity;
			var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
			var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id);
			Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
		},
		shapes: {
			body: [{x: -20, y: 4}, {x: 0, y: 4}, {x: 0, y: 10}, {x: -20, y: 10}, "#D2760B"],
			suppressor: [{x: 0, y: 5}, {x: 20, y: 5}, {x: 20, y: 9}, {x: 0, y: 9}, "purple"],
			grip: [{x: -20, y: -2}, {x: -16, y: -2}, {x: -16, y: 4}, {x: -20, y: 4}, "#3A1312"],
		},
		lines: {
			hand1: [{x: -20, y: 0}],
			hand2: [{x: -20, y: 0}],
		},
		shift: {x: 32, y: 0}
	},
	regularRevolver: {
		damage: 45,
		colour: "gray",
		ammoType: "medium",
		fireType: "semi",
		fireRate: 20,
		clipSize: 6,
		reload: 120,
		bulletSize: 5,
		speed: 0.003,
		gravity: 0.25,
		spread: 10,
		semiFire: function(player) {
			var pos = player.stickPoints.head;
			var force = this.speed / this.gravity;
			var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
			var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id);
			Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
		},
		shapes: {
			body: [{x: -12, y: 3}, {x: 0, y: 3}, {x: 0, y: 10}, {x: -12, y: 10}, "#B2ACB0"],
			barrel: [{x: 0, y: 6}, {x: 16, y: 6}, {x: 16, y: 10}, {x: 0, y: 10}, "gray"],
			grip: [{x: -16, y: -2}, {x: -12, y: -2}, {x: -12, y: 10}, {x: -16, y: 4}, "black"],
		},
		lines: {
			hand1: [{x: -16, y: 0}],
			hand2: [{x: -16, y: 0}],
		},
		shift: {x: 28, y: 0}
	},
	// crossBow: {
	// 	damage: 75,
	// 	colour: "blue",
	// 	ammoType: "magic",
	// 	fireType: "semi",
	// 	fireRate: 30,
	// 	clipSize: 5,
	// 	reload: 120,
	// 	bulletSize: 4.5,
	// 	speed: 0.0025,
	// 	gravity: 1,
	// 	spread: 1,
	// 	semiFire: function(player) {
	// 		var pos = player.stickPoints.head;
	// 		var force = this.speed / this.gravity;
	// 		var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
	// 		var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id);
	// 		Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
	// 	}	
	// },
	rocketLauncher: {
		damage: 100,
		colour: "gold",
		ammoType: "rocket",
		fireType: "semi",
		fireRate: 100,
		clipSize: 4,
		reload: 120,
		bulletSize: 10,
		speed: 0.012,
		gravity: 0.1,
		spread: 0,
		semiFire: function(player) {
			var pos = player.stickPoints.head;
			var force = this.speed / this.gravity;
			var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
			var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id, {
				collision: function(colliding, projectile) {
					var pos = projectile.body.position;
					var initalAngle = random(PI);
					var force = this.mini.speed / this.mini.gravity;
					for (var i = 0; i < this.mini.number; i++) {
						var angle = 360/this.mini.number*i + initalAngle
						var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.mini.bulletSize, { gravityScale: this.mini.gravity, friction: 0, frictionAir: 0 }), this.mini.colour), this.mini.damage, 0, {lifeSpan: this.mini.lifeSpan});
						Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
					}
					projectile.rip();
				},
				mini: {
					damage: 25,
					number: 16,
					colour: "orange",
					bulletSize: 4,
					speed: 0.001,
					gravity: 0.1,
					lifeSpan: 30
				}
			});
			Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
		},
		shapes: {
			body: [{x: -12, y: -4}, {x: 12, y: -4}, {x: 12, y: 4}, {x: -12, y: 4}, "#333436"],
			shield: [{x: -24, y: -4}, {x: -12, y: -4}, {x: -12, y: 4}, {x: -24, y: 4}, "gold"],
			breech: [{x: -30, y: -8}, {x: -24, y: -4}, {x: -24, y: 4}, {x: -30, y: 8}, "#333436"],
			iron: [{x: 12, y: -6}, {x: 16, y: -6}, {x: 16, y: 6}, {x: 12, y: 6}, "#CBB4AE"],
			grip: [{x: 2, y: -12}, {x: 6, y: -12}, {x: 6, y: -4}, {x: 2, y: -4}, "#CBB4AE"],
		},
		lines: {
			hand1: [{x: -22, y: -4}],
			hand2: [{x: 4, y: -8}],
		},
		shift: {x: 18, y: 8}
	},
	grenadeLauncher: {
		damage: 100,
		colour: "gold",
		ammoType: "rocket",
		fireType: "semi",
		fireRate: 20,
		clipSize: 6,
		reload: 120,
		bulletSize: 8,
		speed: 0.009,
		gravity: 1,
		spread: 0,
		semiFire: function(player) {
			var pos = player.stickPoints.head;
			var force = this.speed / this.gravity;
			var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
			var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, restitution: 1}), this.colour), this.damage, player.id, {
				endLife: function(projectile) {
					var pos = projectile.body.position;
					var initalAngle = random(PI);
					var force = this.mini.speed / this.mini.gravity;
					for (var i = 0; i < this.mini.number; i++) {
						var angle = 360/this.mini.number*i + initalAngle
						var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.mini.bulletSize, { gravityScale: this.mini.gravity, friction: 0, frictionAir: 0 }), this.mini.colour), this.mini.damage, 0, {lifeSpan: this.mini.lifeSpan});
						Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
					}
					projectile.rip();
				},
				collision: function(colliding, projectile) {
					if (projectile.hits >= 3) {
						var pos = projectile.body.position;
						var initalAngle = random(PI);
						var force = this.mini.speed / this.mini.gravity;
						for (var i = 0; i < this.mini.number; i++) {
							var angle = 360/this.mini.number*i + initalAngle
							var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.mini.bulletSize, { gravityScale: this.mini.gravity, friction: 0, frictionAir: 0 }), this.mini.colour), this.mini.damage, 0, {lifeSpan: this.mini.lifeSpan});
							Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
						}
						projectile.rip();
					}
				},
				mini: {
					damage: 25,
					number: 8,
					colour: "orange",
					bulletSize: 3,
					speed: 0.001,
					gravity: 0.1,
					lifeSpan: 20
				},
				lifeSpan: 100
			});
			Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
		},
		shapes: {
			body: [{x: -2, y: -2}, {x: 12, y: -2}, {x: 12, y: 2}, {x: -2, y: 2}, "#B68E48"],
			shield: [{x: -24, y: -4}, {x: -16, y: -4}, {x: -16, y: 4}, {x: -24, y: 4}, "#322C35"],
			magazine: [{x: -16, y: -8}, {x: -2, y: -8}, {x: -2, y: -4}, {x: -16, y: -4}, "gold"],
			magazine2: [{x: -16, y: -4}, {x: -2, y: -4}, {x: -2, y: 4}, {x: -16, y: 4}, "gold"],
			magazine3: [{x: -16, y: 4}, {x: -2, y: 4}, {x: -2, y: 8}, {x: -16, y: 8}, "gold"],
			breech: [{x: -30, y: -12}, {x: -24, y: -4}, {x: -24, y: 4}, {x: -30, y: 4}, "#B68E48"],
			iron: [{x: 12, y: -4}, {x: 16, y: -4}, {x: 16, y: 4}, {x: 12, y: 4}, "#322C35"],
			grip: [{x: 2, y: -12}, {x: 6, y: -12}, {x: 6, y: -4}, {x: 2, y: -4}, "#322C35"],
		},
		lines: {
			hand1: [{x: -22, y: -4}],
			hand2: [{x: 4, y: -8}],
		},
		shift: {x: 18, y: 8}
	},
	deathMachine: {
		damage: 20,
		colour: "red",
		ammoType: "light",
		fireType: "auto",
		fireRate: 4,
		clipSize: 150,
		reload: 240,
		bulletSize: 4,
		speed: 0.002,
		gravity: 0.1,
		spread: 36,
		autoFire: function(player) {
			var pos = player.stickPoints.head;
			var force = this.speed / this.gravity;
			var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
			var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id);
			Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
			Body.applyForce(player.body, pos, {x: sin(angle+PI) * force/6, y: cos(angle+PI) * force/3});
		},
		shapes: {
			// body: [{x: -2, y: -2}, {x: 12, y: -2}, {x: 12, y: 2}, {x: -2, y: 2}, "#B68E48"],
			shield: [{x: -30, y: -7}, {x: -16, y: -7}, {x: -16, y: 7}, {x: -30, y: 7}, "#363A3C"],
			magazine: [{x: -16, y: -6}, {x: 10, y: -6}, {x: 10, y: -5}, {x: -16, y: -5}, "#C6CCCC"],
			magazine2: [{x: -16, y: -3}, {x: 10, y: -3}, {x: 10, y: -1}, {x: -16, y: -1}, "#C6CCCC"],
			magazine3: [{x: -16, y: 1}, {x: 10, y: 1}, {x: 10, y: 3}, {x: -16, y: 3}, "#C6CCCC"],
			magazine4: [{x: -16, y: 5}, {x: 10, y: 5}, {x: 10, y: 6}, {x: -16, y: 6}, "#C6CCCC"],
			iron: [{x: 10, y: -7}, {x: 16, y: -7}, {x: 16, y: 7}, {x: 10, y: 7}, "#363A3C"],
			barrel: [{x: 16, y: -5}, {x: 20, y: -5}, {x: 20, y: -3}, {x: 16, y: -3}, "#C6CCCC"],
			barrel2: [{x: 16, y: -2}, {x: 20, y: -2}, {x: 20, y: 2}, {x: 16, y: 2}, "#C6CCCC"],
			barrel3: [{x: 16, y: 3}, {x: 20, y: 3}, {x: 20, y: 5}, {x: 16, y: 5}, "#C6CCCC"],
			grip: [{x: -18, y: 7}, {x: -28, y: 7}, {x: -28, y: 13}, {x: -18, y: 13}, "#5B5733"],
		},
		lines: {
			hand1: [{x: -27, y: 10}],
			hand2: [{x: 0, y: -4}],
		},
		shift: {x: 18, y: -8}
	},
	homingGuppies: {
		damage: 100,
		colour: "orange",
		ammoType: "rocket",
		fireType: "semi",
		fireRate: 100,
		clipSize: 9,
		reload: 120,
		bulletSize: 10,
		speed: 0.005,
		gravity: 0.1,
		spread: 0,
		semiFire: function(player) {
			var pos = player.stickPoints.head;
			var force = this.speed / this.gravity;
			var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
			var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id, {
				collision: function(colliding, projectile) {
					var pos = projectile.body.position;
					var initalAngle = random(PI);
					var force = this.mini.speed / this.mini.gravity;
					for (var i = 0; i < this.mini.number; i++) {
						var angle = 360/this.mini.number*i + initalAngle
						var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.mini.bulletSize, { gravityScale: this.mini.gravity, friction: 0, frictionAir: 0 }), this.mini.colour), this.mini.damage, 0, {lifeSpan: this.mini.lifeSpan});
						Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
					}
					projectile.rip();
				},
				addition: function(projectile) {
					var pos = projectile.body.position;
					var angle = atan2(mouseX-pos.x, mouseY-pos.y);
					Body.applyForce(projectile.body, pos, {x: sin(angle) * 0.005, y: cos(angle) * 0.005});
					if (getLength({x:0, y:0}, projectile.body.velocity) < 1) {
						var pos = projectile.body.position;
						var initalAngle = random(PI);
						var force = this.mini.speed / this.mini.gravity;
						for (var i = 0; i < this.mini.number; i++) {
							var angle = 360/this.mini.number*i + initalAngle
							var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.mini.bulletSize, { gravityScale: this.mini.gravity, friction: 0, frictionAir: 0 }), this.mini.colour), this.mini.damage, 0, {lifeSpan: this.mini.lifeSpan});
							Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
						}
						projectile.rip();
					}
				},
				mini: {
					damage: 20,
					number: 15,
					colour: "black",
					bulletSize: 4,
					speed: 0.001,
					gravity: 0.1,
					lifeSpan: 30
				}
			});
			Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
		},
		shapes: {
			body: [{x: -10, y: -10}, {x: 10, y: -10}, {x: 10, y: 10}, {x: -10, y: 10}, "#687040"],
			control: [{x: -6, y: 14}, {x: 6, y: 14}, {x: 6, y: 30}, {x: -6, y: 30}, "lightblue"],
			dot: [{x: -2, y: 20}, {x: 2, y: 20}, {x: 2, y: 24}, {x: -2, y: 24}, "red"],
			stand: [{x: -8, y: 10}, {x: 8, y: 10}, {x: 8, y: 14}, {x: -8, y: 14}, "#625D59"],
			iron: [{x: 10, y: -6}, {x: 16, y: -10}, {x: 16, y: 10}, {x: 10, y: 6}, "orange"],
		},
		lines: {
			hand1: [{x: 0, y: 2}],
			hand2: [{x: 0, y: -8}],
		},
		shift: {x: 20, y: -8}
	},
	biopulsarNullifier: {
		damage: 100,
		colour: "dodgerblue",
		ammoType: "rocket",
		fireType: "semi",
		fireRate: 30,
		clipSize: 3,
		reload: 240,
		bulletSize: 12,
		speed: 0.02,
		gravity: 0.01,
		spread: 0,
		semiFire: function(player) {
			var pos = player.stickPoints.head;
			var force = this.speed / this.gravity;
			var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
			var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, restitution: 1}), this.colour), this.damage, player.id, {
				endLife: function(projectile) {
					var pos = projectile.body.position;
					var initalAngle = random(PI);
					var force = this.mini.speed / this.mini.gravity;
					for (var i = 0; i < this.mini.number; i++) {
						var angle = 360/this.mini.number*i + initalAngle
						var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.mini.bulletSize, { gravityScale: this.mini.gravity, friction: 0, frictionAir: 0 }), this.mini.colour), this.mini.damage, 0, {lifeSpan: this.mini.lifeSpan});
						Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
					}
					projectile.rip();
				},
				collision: function(colliding, projectile) {
					colliding.damage(projectile.damage);
					projectile.id = 0;
					if (projectile.hits >= 5) {
						var pos = projectile.body.position;
						var initalAngle = random(PI);
						var force = this.mini.speed / this.mini.gravity;
						for (var i = 0; i < this.mini.number; i++) {
							var angle = 360/this.mini.number*i + initalAngle
							var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.mini.bulletSize, { gravityScale: this.mini.gravity, friction: 0, frictionAir: 0 }), this.mini.colour), this.mini.damage, 0, {lifeSpan: this.mini.lifeSpan});
							Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
						}
						projectile.rip();
					}
				},
				mini: {
					damage: 10,
					number: 4,
					colour: "blue",
					bulletSize: 4,
					speed: 0.001,
					gravity: 0.1,
					lifeSpan: 15
				},
				lifeSpan: 250
			});
			Body.applyForce(bullet.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
		},
		shapes: {
			body: [{x: 0, y: -4}, {x: 20, y: -4}, {x: 20, y: 8}, {x: 4, y: 8}, {x: 0, y: 4}, "red"],
			stock: [{x: -12, y: -10}, {x: 0, y: -4}, {x: 0, y: 4}, {x: -12, y: -2}, "#1F1F1F"],
			grip: [{x: -2, y: -12}, {x: 2, y: -12}, {x: 10, y: -4}, {x: 6, y: -4}, "#1F1F1F"],
			lazer: [{x: 20, y: 3}, {x: 60, y: 3}, {x: 60, y: 7}, {x: 20, y: 7}, "lightblue"],
			lazer2: [{x: 20, y: -3}, {x: 60, y: -3}, {x: 60, y: 1}, {x: 20, y: 1}, "lightblue"],
		},
		lines: {
			hand1: [{x: -4, y: -4}],
			hand2: [{x: 0, y: -10}],
		},
		shift: {x: 12, y: 0}
	},
	tropicalKatana: {
		damage: 60,
		colour: "darkgreen",
		ammoType: "heavy",
		fireType: "semi",
		fireRate: 20,
		clipSize: 20,
		reload: 240,
		bulletSize: 7,
		scan: 5,
		gravity: 0.5,
		spread: 0,
		range: 35,
		semiFire: function(player) {
			var pos = player.stickPoints.head;
			var force = this.speed / this.gravity;
			var angle = atan2(mouseX-pos.x, mouseY-pos.y) + random(-radians(this.spread*player.aim), radians(this.spread*player.aim));
			var bullet = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.bulletSize, { gravityScale: this.gravity, friction: 0, frictionAir: 0 }), this.colour), this.damage, player.id);
			for (var i = 0; i < this.range; i++) {
				if (bullet.destroy) {
					break;
				}
				Body.translate(bullet.body, {x: sin(angle) * this.scan, y: cos(angle) * this.scan})
				bullet.draw();
			}
			pos = bullet.body.position;
			var initalAngle = random(PI);
			var force = this.mini.speed / this.mini.gravity;
			for (var i = 0; i < this.mini.number; i++) {
				var angle = 360/this.mini.number*i + initalAngle
				var projectile = createProjectile(new Box(Bodies.circle(pos.x, pos.y, this.mini.bulletSize, { gravityScale: this.mini.gravity, friction: 0, frictionAir: 0 }), this.mini.colour), this.mini.damage, 0, {lifeSpan: this.mini.lifeSpan});
				Body.applyForce(projectile.body, pos, {x: sin(angle) * force, y: cos(angle) * force});
			}
			bullet.rip();
		},
		mini: {
			damage: 10,
			number: 4,
			colour: "darkgreen",
			bulletSize: 4,
			speed: 0.001,
			gravity: 0.1,
			lifeSpan: 15
		},
		shapes: {
			grip: [{x: 0, y: -2}, {x: -10, y: -2}, {x: -10, y: 2}, {x: 0, y: 2}, "#082C9B"],
			guard: [{x: -3, y: -6}, {x: 0, y: -6}, {x: 0, y: 6}, {x: -3, y: 6}, "#04DDF8"],
			blade: [{x: 0, y: -1}, {x: 40, y: -1}, {x: 50, y: 1}, {x: 0, y: 1}, "#FCC760"],
		},
		lines: {
			hand1: [{x: -2, y: 0}],
			hand2: [{x: -2, y: 0}],
		},
		shift: {x: 20, y: 0}
	},
	bluePrint: {
		colour: "lightblue",
		shapes: {
			paper: [{x: 10, y: -10}, {x: 16, y: -10}, {x: 16, y: 10}, {x: 10, y: 10}, "lightblue"],
		},
		lines: {
			hand1: [{x: 15, y: -8}],
			hand2: [{x: 15, y: 8}],
		}
	},
	woodMats: {
		resource: true,
		colour: data.wood.colour,
		shapes: {
			mat: [{x: -10, y: -5}, {x: 10, y: -5}, {x: 10, y: 5}, {x: -10, y: 5}, data.wood.colour],
		},
		supply: function(player) {
			player.resources.mats.wood += 100;
		}
	},
	brickMats: {
		resource: true,
		colour: data.brick.colour,
		shapes: {
			mat: [{x: -10, y: -5}, {x: 10, y: -5}, {x: 10, y: 5}, {x: -10, y: 5}, data.brick.colour],
		},
		supply: function(player) {
			player.resources.mats.brick += 100;
		}
	},
	metalMats: {
		resource: true,
		colour: data.metal.colour,
		shapes: {
			mat: [{x: -10, y: -5}, {x: 10, y: -5}, {x: 10, y: 5}, {x: -10, y: 5}, data.metal.colour],
		},
		supply: function(player) {
			player.resources.mats.metal += 100;
		}
	},
	lightAmmo: {
		resource: true,
		colour: "maroon",
		shapes: {
			mat: [{x: -5, y: -5}, {x: 5, y: -5}, {x: 5, y: 5}, {x: 0, y: 10}, {x: -5, y: 5}, "maroon"],
		},
		supply: function(player) {
			player.resources.ammo.light += 24;
		}
	},
	mediumAmmo: {
		resource: true,
		colour: "silver",
		shapes: {
			mat: [{x: -5, y: -5}, {x: 5, y: -5}, {x: 5, y: 5}, {x: 0, y: 10}, {x: -5, y: 5}, "silver"],
		},
		supply: function(player) {
			player.resources.ammo.medium += 20;
		}
	},
	heavyAmmo: {
		resource: true,
		colour: "olive",
		shapes: {
			mat: [{x: -5, y: -5}, {x: 5, y: -5}, {x: 5, y: 5}, {x: 0, y: 10}, {x: -5, y: 5}, "olive"],
		},
		supply: function(player) {
			player.resources.ammo.heavy += 12;
		}
	},
	shellAmmo: {
		resource: true,
		colour: "brown",
		shapes: {
			mat: [{x: -5, y: -5}, {x: 5, y: -5}, {x: 5, y: 5}, {x: 0, y: 10}, {x: -5, y: 5}, "brown"],
		},
		supply: function(player) {
			player.resources.ammo.shell += 10;
		}
	},
	rocketAmmo: {
		resource: true,
		colour: "indianred",
		shapes: {
			mat: [{x: -5, y: -5}, {x: 5, y: -5}, {x: 5, y: 5}, {x: 0, y: 10}, {x: -5, y: 5}, "indianred"],
		},
		supply: function(player) {
			player.resources.ammo.rocket += 4;
		}
	},
	bandageHeal: {
		colour: "indianred",
		shapes: {
			paper: [{x: 10, y: -10}, {x: 16, y: -10}, {x: 16, y: 10}, {x: 10, y: 10}, "lightblue"],
		},
		lines: {
			hand1: [{x: 15, y: -8}],
			hand2: [{x: 15, y: 8}],
		}
	},
	medkitHeal: {
		colour: "indianred",
		shapes: {
			paper: [{x: 10, y: -10}, {x: 16, y: -10}, {x: 16, y: 10}, {x: 10, y: 10}, "lightblue"],
		},
		lines: {
			hand1: [{x: 15, y: -8}],
			hand2: [{x: 15, y: 8}],
		}
	},
	miniShield: {
		colour: "indianred",
		shapes: {
			paper: [{x: 10, y: -10}, {x: 16, y: -10}, {x: 16, y: 10}, {x: 10, y: 10}, "lightblue"],
		},
		lines: {
			hand1: [{x: 15, y: -8}],
			hand2: [{x: 15, y: 8}],
		}
	},
	bigShield: {
		colour: "indianred",
		shapes: {
			paper: [{x: 10, y: -10}, {x: 16, y: -10}, {x: 16, y: 10}, {x: 10, y: 10}, "lightblue"],
		},
		lines: {
			hand1: [{x: 15, y: -8}],
			hand2: [{x: 15, y: 8}],
		}
	},
	slurpJuice: {
		colour: "indianred",
		shapes: {
			paper: [{x: 10, y: -10}, {x: 16, y: -10}, {x: 16, y: 10}, {x: 10, y: 10}, "lightblue"],
		},
		lines: {
			hand1: [{x: 15, y: -8}],
			hand2: [{x: 15, y: 8}],
		}
	},
	chugJug: {
		colour: "indianred",
		shapes: {
			paper: [{x: 10, y: -10}, {x: 16, y: -10}, {x: 16, y: 10}, {x: 10, y: 10}, "lightblue"],
		},
		lines: {
			hand1: [{x: 15, y: -8}],
			hand2: [{x: 15, y: 8}],
		}
	},
}

maps = {
	tilted: {

	},
	dusty: {

	},
	pleasant: {

	},
	wailing: {
		// create: {
		// 	treeL: [
		// 		["c", 200, 400, 150, "#06AC10", 150],
		// 		["r", 200, 600, 50, 400, "#2F1310", 600],
		// 		["r", 200, 850, 50, 100, "#2F1310", 200],
		// 	],
		// 	treeR: [
		// 		["c", 1600, 400, 150, "#06AC10", 150],
		// 		["r", 1600, 600, 50, 400, "#2F1310", 600],
		// 		["r", 1600, 850, 50, 100, "#2F1310", 200],
		// 	],
		// 	bush: [
		// 		["r", 400, 825, 225, 125, "#06AC10", 150],
		// 		["r", 1400, 825, 225, 125, "#06AC10", 150],
		// 		["r", 600, 775, 125, 225, "#06AC10", 150],
		// 		["r", 1200, 775, 125, 225, "#06AC10", 150]
		// 	],
		// 	tower: [
		// 		["r", 700, 200, 25, 200, data.wood.colour, 200],
		// 		["r", 700, 400, 25, 200, data.wood.colour, 200],
		// 		["r", 700, 600, 25, 200, data.wood.colour, 200],
		// 		["r", 700, 800, 25, 200, data.wood.colour, 200],
		// 		["r", 1100, 200, 25, 200, data.wood.colour, 200],
		// 		["r", 1100, 400, 25, 200, data.wood.colour, 200],
		// 		["r", 1100, 600, 25, 200, data.wood.colour, 200],
		// 		["r", 1100, 800, 25, 200, data.wood.colour, 200],
		// 		["r", 800, 100, 200, 25, data.wood.colour, 200],
		// 		["r", 1000, 100, 200, 25, data.wood.colour, 200],
		// 		["r", 800, 300, 200, 25, data.wood.colour, 200],
		// 		["r", 1000, 300, 200, 25, data.wood.colour, 200],
		// 		["r", 800, 500, 200, 25, data.wood.colour, 200],
		// 		["r", 1000, 500, 200, 25, data.wood.colour, 200],
		// 		["r", 800, 700, 200, 25, data.wood.colour, 200],
		// 		["r", 1000, 700, 200, 25, data.wood.colour, 200]
		// 	]
		// },
		// drops: [
		// 	{x: 800, y: 50},
		// 	{x: 1000, y: 50},
		// 	{x: 800, y: 250},
		// 	{x: 1000, y: 250},
		// 	{x: 800, y: 450},
		// 	{x: 1000, y: 450},
		// 	{x: 800, y: 650},
		// 	{x: 1000, y: 650},
		// 	{x: 800, y: 850},
		// 	{x: 1000, y: 850},
		// 	{x: 600, y: 600},
		// 	{x: 1200, y: 600},
		// 	{x: 350, y: 700},
		// 	{x: 450, y: 700},
		// 	{x: 1350, y: 700},
		// 	{x: 1450, y: 700},
		// ]
	},
	tomato: {
		create: {
			grounds: [
				["r", 275, 800, 550, 200, "#2D2A23", 999],
				["r", 1175, 800, 1250, 200, "#9FA1AE", 999],
				["r", 50, 400, 100, 100, "#2D2A23", 999],
				["r", 400, 400, 300, 100, "#2D2A23", 999],
			],
			plaza: [
				["p", 1140, 270, [{x: 0, y: 0}, {x: 0, y: -120}, {x: 120, y: -20}, {x: 120, y: 0}], "#F9F6C1", 150],
				["p", 760, 270, [{x: 0, y: 0}, {x: 0, y: -120}, {x: -120, y: -20}, {x: -120, y: 0}], "#F9F6C1", 150],
				["r", 950, 260, 300, 100, "#A2E6F1", 300],
				["c", 950, 150, 100, "#FC5C06", 600],
				["r", 900, 700, 25, 50, "#A2E6F1", 100],
				["r", 1000, 700, 25, 50, "#A2E6F1", 100],
				["r", 800, 650, 50, 10, data.wood.colour, 50],
				["r", 800, 675, 5, 55, data.metal.colour, 25],
				["r", 1100, 650, 50, 10, data.wood.colour, 50],
				["r", 1100, 675, 5, 55, data.metal.colour, 25],
				["r", 750, 450, 50, 10, data.wood.colour, 50],
				["r", 750, 475, 5, 55, data.metal.colour, 25],
				["r", 950, 450, 50, 10, data.wood.colour, 50],
				["r", 950, 475, 5, 55, data.metal.colour, 25],
				["r", 1150, 450, 50, 10, data.wood.colour, 50],
				["r", 1150, 475, 5, 55, data.metal.colour, 25],
			],
			car: [
				["r", 350, 625, 200, 100, "#CE1C2E", 600],
				["c", 300, 700, 25, "black", 25],
				["c", 400, 700, 25, "black", 25],
			],
			station: [
				["r", 1600, 650, 50, 100, "#F9F6C1", 600],
				["r", 1550, 480, 400, 80, "#A2E6F1", 600],
			]
		},
		structures: [
			[900, 300, {type: 1, edit: 0, material: data.brick}],
			[800, 300, {type: 1, edit: 0, material: data.brick}],
			[900, 500, {type: 1, edit: 0, material: data.brick}],
			[1000, 500, {type: 0, edit: 0, material: data.wood}],
			[900, 500, {type: 0, edit: 0, material: data.wood}],
			[1000, 500, {type: 2, edit: 0, material: data.wood}],
			[800, 500, {type: 2, edit: 1, material: data.wood}],
			[1000, 300, {type: 1, edit: 0, material: data.brick}],
			[700, 600, {type: 0, edit: 0, material: data.brick}],
			[1700, 600, {type: 0, edit: 0, material: data.metal}],
			[1700, 500, {type: 0, edit: 0, material: data.metal}],
			[1600, 500, {type: 1, edit: 0, material: data.metal}],
			[1500, 500, {type: 1, edit: 0, material: data.metal}],
			[1400, 500, {type: 1, edit: 0, material: data.metal}],
			[1400, 500, {type: 0, edit: 0, material: data.metal}],
			[1200, 600, {type: 0, edit: 0, material: data.brick}],
			[1200, 500, {type: 0, edit: 0, material: data.brick}],
			[1100, 500, {type: 1, edit: 0, material: data.brick}],
			[700, 500, {type: 1, edit: 0, material: data.brick}],
			[700, 500, {type: 0, edit: 0, material: data.brick}],
			[700, 400, {type: 0, edit: 0, material: data.brick}],
			[700, 300, {type: 0, edit: 0, material: data.brick}],
			[700, 300, {type: 1, edit: 0, material: data.brick}],
			[1200, 400, {type: 0, edit: 0, material: data.brick}],
			[1200, 300, {type: 0, edit: 0, material: data.brick}],
			[1100, 300, {type: 1, edit: 0, material: data.brick}],
			[300, 300, {type: 0, edit: 0, material: data.brick}],
			[300, 200, {type: 0, edit: 0, material: data.brick}],
			[500, 300, {type: 0, edit: 0, material: data.brick}],
			[300, 300, {type: 1, edit: 0, material: data.wood}],
			[400, 300, {type: 1, edit: 0, material: data.wood}],
			[500, 200, {type: 0, edit: 0, material: data.brick}],
			[400, 200, {type: 1, edit: 0, material: data.wood}],
			[300, 200, {type: 1, edit: 0, material: data.wood}],
			[400, 100, {type: 2, edit: 1, material: data.wood}],
			[300, 100, {type: 2, edit: 0, material: data.wood}],
			[100, 600, {type: 0, edit: 0, material: data.metal}],
			[0, 600, {type: 1, edit: 0, material: data.metal}],
		],
		drops: [
			{x: 350, y: 250},
			{x: 450, y: 250},
			{x: 350, y: 550},
			{x: 750, y: 400},
			{x: 950, y: 400},
			{x: 1150, y: 400},
			{x: 800, y: 600},
			{x: 1100, y: 600},
			{x: 1500, y: 400},
			{x: 1500, y: 650},
		],
		chests: [
			{x: 400, y: 150},
			{x: 60, y: 650},
			{x: 950, y: 650},
			{x: 1660, y: 650},
		],
		spawns: [
			{},
			{x: 50, y: 300},
			{x: 500, y: 650},
			{x: 950, y: 0},
			{x: 1600, y: 400},
		]
	}
}

// gravityScale
