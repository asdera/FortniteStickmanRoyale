function Box(body, colour, hp=10) {
  this.body = body;
  this.colour = (colour === undefined) ? "black" : colour;
  this.destroy = false;
  this.health = hp==999 ? Infinity : hp;
  this.maxHealth = hp;
  this.life = 0;

  World.add(world, this.body);

  this.draw = function() {
    if (this.init && this.life == 0) {
      this.init();
    }
    this.life++;
    pos = this.body.position;
    push();
    stroke("white")
    c = color(this.colour)
    colour = color(red(c), green(c), blue(c), min(this.health/this.maxHealth, 1)*255)
    fill(colour);
    strokeWeight(2);
    if (pos.y < 0) {
      triangle(pos.x, 0, pos.x - 20, 20, pos.x + 20, 20);
    } else if (this.body.label == "Circular Body") {
      ellispe(pos.x, pos.y, this.body.radius);
    } else {
      beginShape();
      for (var i in this.body.vertices) {
        vertexi = this.body.vertices[i];
        vertex(vertexi.x, vertexi.y);
      }
      endShape(CLOSE);
    }
    
    pop();
    if (!Matter.Bounds.contains(bounds, pos)) {
      this.rip();
    }
    if (this.add) {
      this.add(pos);
    }
    if (this.update) {
      this.update()
    }
  }

  this.rip = function() {
    World.remove(world, this.body);
    this.destroy = true;
  }

  this.damage = function(d) {
    if (this.collision) {
      this.collision();
    }
    this.health -= d;
    if (this.health <= 0) {
      this.rip();
    }
  }
}


function createGround(box) {
  var obj = box;
  obj.type = "ground";
  obj.connections = [];
  bounds = obj.body.bounds;
  minX = ceil(bounds.min.x/100);
  maxX = floor(bounds.max.x/100);
  minY = ceil(bounds.min.y/100);
  maxY = floor(bounds.max.y/100);
  for (var i = minX; i <= maxX; i++) {
    for (var j = minY; j <= maxY; j++) {
      if (Vertices.contains(obj.body.vertices, {x: i*100, y: j*100})) {
        points[i][j].stable = true;
        points[i][j].connections.push(obj);
        obj.connections.push(points[i][j]);
      }
    }
  }
  obj.rip = function(p=true) {
    World.remove(world, this.body);
    this.destroy = true;
    for (var i = 0; i < this.connections.length; i++) {
      tempC = this.connections[i].connections;
      for (var j = tempC.length - 1; j >= 0; j--) {
        if (tempC[j].destroy) {
          tempC.splice(j,1)
        }
      }
    }
    if (p) {
      game.checkPoints();
    }
  }
  grounds.push(obj);
}

function createGround(box) {
  var obj = box;
  obj.type = "ground";
  obj.connections = [];
  bounds = obj.body.bounds;
  minX = ceil(bounds.min.x/100);
  maxX = floor(bounds.max.x/100);
  minY = ceil(bounds.min.y/100);
  maxY = floor(bounds.max.y/100);
  for (var i = minX; i <= maxX; i++) {
    for (var j = minY; j <= maxY; j++) {
      if (Vertices.contains(obj.body.vertices, {x: i*100, y: j*100})) {
        points[i][j].stable = true;
        points[i][j].connections.push(obj);
        obj.connections.push(points[i][j]);
      }
    }
  }
  obj.rip = function(p=true) {
    World.remove(world, this.body);
    this.destroy = true;
    for (var i = 0; i < this.connections.length; i++) {
      tempC = this.connections[i].connections;
      for (var j = tempC.length - 1; j >= 0; j--) {
        if (tempC[j].destroy) {
          tempC.splice(j,1)
        }
      }
    }
    player.action(function(player) {
      game.checkPoints();
    }, 1)
  }
  grounds.push(obj);
}

function createStructure(b, mats, o=true, id=0) {
  if (b.type == 0) {
    tempX = round(mouseX/100);
    tempY = floor(mouseY/100);
    tempV1 = 0;
    tempV2 = 0;
    tempV3 = 0;
    tempV4 = 1;
    turn = 0;
    boundsX = 18;
    boundsY = 8;
    lengthStructure = 105;
    
  } else if (b.type == 1) {
    tempX = floor(mouseX/100);
    tempY = round(mouseY/100);
    tempV1 = 0;
    tempV2 = 0;
    tempV3 = 1;
    tempV4 = 0;
    turn = PI/2;
    boundsX = 17;
    boundsY = 9;
    lengthStructure = 105;
  } else if (b.type == 2) {
    tempX = floor(mouseX/100);
    tempY = floor(mouseY/100);
    boundsX = 17;
    boundsY = 8;
    lengthStructure = 145;
    if (b.stairsEdit == 0) {
      turn = PI/4;
      tempV1 = 0;
      tempV2 = 1;
      tempV3 = 1;
      tempV4 = 0;
    } else if (b.stairsEdit == 1) {
      turn = -PI/4;
      tempV1 = 0;
      tempV2 = 0;
      tempV3 = 1;
      tempV4 = 1;
    }
  }

  if (tempX < 0 || tempX > boundsX || tempY < 0 || tempY > boundsY || buildingMap[b.type][tempX][tempY] != 0) {
    return;
  }

  if (!(points[tempX+tempV1][tempY+tempV2].stable || points[tempX+tempV3][tempY+tempV4].stable) || getLength(pos, {x: mouseX, y: mouseY}) > player.height*3 || mats[b.material.name] < 10) {
    o = false;
    fill("red");
  }

  if (o) {
    mats[b.material.name] -= 10;

    obj = new Box(Bodies.rectangle(tempX*100+(tempV1+tempV3)*50, tempY*100+(tempV2+tempV4)*50, 10, lengthStructure, { isStatic: true, friction: 0, angle: turn}), b.material.colour, b.material.hp);
    obj.connections = [points[tempX+tempV1][tempY+tempV2], points[tempX+tempV3][tempY+tempV4]];
    points[tempX+tempV1][tempY+tempV2].connections.push(obj);
    points[tempX+tempV3][tempY+tempV4].connections.push(obj);
    game.stabilizePoints(obj.connections[0]);
    obj.mapX = tempX;
    obj.mapY = tempY;

    obj.id = id;

    obj.type = b.type;
    if (b.type == 2) {
      obj.edit = b.stairsEdit;
    }

    obj.heal = b.material.hp - b.material.spawnHp;

    obj.init = function() {
      this.health -= this.heal;
    }

    obj.update = function() {
      if (this.heal && this.life % 4 == 0) {
        this.heal--;
        this.health++;
      }
    }

    obj.rip = function(p=true) {
      buildingMap[this.type][this.mapX][this.mapY] = 0;
      World.remove(world, this.body);
      this.destroy = true;
      for (var i = 0; i < this.connections.length; i++) {
        tempC = this.connections[i].connections;
        for (var j = tempC.length - 1; j >= 0; j--) {
          if (tempC[j].destroy) {
            tempC.splice(j,1)
          }
        }
      }
      if (p) {
        game.checkPoints();
      }
    }

    structures.push(obj);
    buildingMap[b.type][obj.mapX][obj.mapY] = obj;
  } else {
    if (b.type == 0) {
      rect(tempX*100-5, tempY*100-5, 10, 110);
    } else if (b.type == 1) {
      rect(tempX*100-5, tempY*100-5, 110, 10);
    } else if (b.type == 2) {
      originX = tempX*100+50
      originY = tempY*100+50
      if (b.stairsEdit == 0) {
        quad(originX-49.45, originY+56.57, originX+56.57, originY-49.45, originX+49.45, originY-56.57, originX-56.57, originY+49.45);
      } else if (b.stairsEdit == 1) {
        quad(originX+49.45, originY+56.57, originX+56.57, originY+49.45, originX-49.45, originY-56.57, originX-56.57, originY-49.45);
      }
      
    }
  }
}

function createItem(item, x, y) {
  var obj = new Box(Bodies.circle(x, y, 10), "hotpink");
  obj.item = item;
  obj.draw = function() {
    if (this.init && this.life == 0) {
      this.init();
    }
    this.life++;
    pos = this.body.position; 
    fill("lime")
    triangle(pos.x, pos.y-10, pos.x-10, pos.y-20, pos.x+10, pos.y-20);
    data.draw(this.body.position, PI/2, this.item);
    if (this.item.empty) {
      this.rip();
    }
  }
  boxes.push(obj);
}

