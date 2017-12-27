'use strict';

const getRandomInt = (max) => Math.floor(Math.random() * max);

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 3;
    this.color = '#e48';
  }

  distance(point) {
    return Point.distanceTwo(this, point);
  }

  static distanceTwo(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  equals(x, y) {
    return this.x === x && this.y === y;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class MovablePoint extends Point {
  constructor(x, y) {
    super(x, y);
    this.vx = 2 * Math.random() * Math.pow((-1), getRandomInt(2));
    this.vy = 2 * Math.random() * Math.pow((-1), getRandomInt(2));
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x > 800 || this.x < 0) {
      this.vx = -this.vx;
    }
    if (this.y > 600 || this.y < 0) {
      this.vy = -this.vy;
    }
  }
}

class Player extends MovablePoint {
  constructor(x, y) {
    super(x, y);
    this.radius = 8;
    this.color = '#5b5';
  }

  move() {
  //   implement
  }
}

class World {
  constructor(width = 800, height = 600) {
    // initiate the world
    this.width = width;
    this.height = height;
    this.angryPoints = Array.from({length: 30}, () => new MovablePoint(getRandomInt(width), getRandomInt(height)));
    this.player = new Player(width / 2, height / 2);
  }

  simulate() {
    this.player.move();
    this.angryPoints.forEach(p => p.move());
  }

  draw(ctx) {
    this.player.draw(ctx);
    this.angryPoints.forEach(p => p.draw(ctx));
  }
}

const world = new World();
let raf;

const canvas = document.getElementById('canvas');
canvas.width = world.width;
canvas.height = world.height;
const ctx = canvas.getContext('2d');

function draw() {
  // ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  world.draw(ctx);
  world.simulate();
  raf = window.requestAnimationFrame(draw);
}

draw();
