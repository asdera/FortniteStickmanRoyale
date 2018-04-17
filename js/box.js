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
    var pos = this.body.position;
    push();
    stroke("white")
    var c = color(this.colour);
    var colour = color(red(c), green(c), blue(c), min(this.health/this.maxHealth, 1)*255);
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
    if (!this.destroy) {
      World.remove(world, this.body);
      this.destroy = true;
    }
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
  if (obj.connections.length == 0) {
    points[minX][minY].connections.push(obj);
    obj.connections.push(points[minX][minY]);
  }
  obj.rip = function(p=true) {
    if (!this.destroy) {
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
      for (var i = players.length - 1; i >= 0; i--) {
        var playeri = players[i];
        if (playeri) {
          playeri.action(function(player) {
            game.checkPoints();
          }, 1)
          break;
        }
      }
    }
  }
  grounds.push(obj);
}

function createStructure(x, y, b, mats, pos, o=true, id=0) {
  if (b.type == 0) {
    tempX = round(x/100);
    tempY = floor(y/100);
    tempV1 = 0;
    tempV2 = 0;
    tempV3 = 0;
    tempV4 = 1;
    turn = 0;
    boundsX = 18;
    boundsY = 8;
    lengthStructure = 105;
    
  } else if (b.type == 1) {
    tempX = floor(x/100);
    tempY = round(y/100);
    tempV1 = 0;
    tempV2 = 0;
    tempV3 = 1;
    tempV4 = 0;
    turn = PI/2;
    boundsX = 17;
    boundsY = 9;
    lengthStructure = 105;
  } else if (b.type == 2) {
    tempX = floor(x/100);
    tempY = floor(y/100);
    boundsX = 17;
    boundsY = 8;
    lengthStructure = 145;
    if (b.edit == 0) {
      turn = PI/4;
      tempV1 = 0;
      tempV2 = 1;
      tempV3 = 1;
      tempV4 = 0;
    } else if (b.edit == 1) {
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

  if ((!(points[tempX+tempV1][tempY+tempV2].stable || points[tempX+tempV3][tempY+tempV4].stable) || getLength(pos, {x: x, y: y}) > 140 || mats[b.material.name] < 10) && id != 0) {
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
      obj.edit = b.edit;
    } else {
      obj.edit = 0;
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
      if (!this.destroy) {
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
      if (b.edit == 0) {
        quad(originX-49.45, originY+56.57, originX+56.57, originY-49.45, originX+49.45, originY-56.57, originX-56.57, originY+49.45);
      } else if (b.edit == 1) {
        quad(originX+49.45, originY+56.57, originX+56.57, originY+49.45, originX-49.45, originY-56.57, originX-56.57, originY-49.45);
      }
      
    }
  }
}

function createChest(box, score, guns, items) {
  var obj = box;
  obj.score = score;
  obj.amountGuns = guns;
  obj.amountItems = items;
  obj.draw = function() {
    if (this.init && this.life == 0) {
      this.init();
    }
    this.life++;
    var pos = this.body.position;
    stroke("white")
    strokeWeight(5);
    var c = color(this.colour);
    var colour = color(red(c), green(c), blue(c), min(this.health/this.maxHealth, 1)*255);
    fill(colour);
    quad(this.body.vertices[0].x, this.body.vertices[0].y, this.body.vertices[1].x, this.body.vertices[1].y, this.body.vertices[2].x, this.body.vertices[2].y, this.body.vertices[3].x, this.body.vertices[3].y);
    line(this.body.vertices[0].x, this.body.vertices[0].y, this.body.vertices[2].x, this.body.vertices[2].y);
    line(this.body.vertices[1].x, this.body.vertices[1].y, this.body.vertices[3].x, this.body.vertices[3].y);
  }
  obj.rip = function() {
    if (!this.destroy) {
      var pos = this.body.position;
      for (var i = 0; i < this.amountGuns; i++) {
        createItem(pos.x, pos.y, makeItem(getWeapon(this.score)));
      }
      for (var i = 0; i < this.amountItems; i++) {
        createItem(pos.x, pos.y, makeItem(random(data.resources)));
      }
      World.remove(world, this.body);
      this.destroy = true;
    }
  }
  boxes.push(obj);
}

function createItem(x, y, item) {
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
  items.push(obj);
}



