import * as PIXI from 'pixi.js';
import Order from './order';

export default class Character extends PIXI.AnimatedSprite {
  constructor(animations, x = 0, y = 0, scale = 5) {
    super(animations.idle);
    this.animations = animations;
    this.state = 0;
    this.animationSpeed = 0.1;
    this.x = x;
    this.y = y;
    this.dst = x;
    this.onArrive = () => {};

    this.anchor.set(0, 1);
    this.setTransform(this.x, this.y, scale, scale);
    this.play();
  }

  turnLeft() {
    const scale = -Math.abs(this.scale.x);
    if (this.scale.x !== scale) {
      this.scale.x = scale;
      this.anchor.set(1, 1);
    }
  }

  turnRight() {
    const scale = Math.abs(this.scale.x);
    if (this.scale.x !== scale) {
      this.scale.x = scale;
      this.anchor.set(0, 1);
    }
  }

  moveTo(dst, onArrive = () => {}) {
    this.dst = dst;
    this.onArrive = onArrive;
    this.anim('run');
  }

  step() {
    if (this.x === this.dst) {
      return;
    } else if (this.x < this.dst) {
      this.turnRight();
      this.x += this.scale.y;
    } else if (this.x > this.dst) {
      this.turnLeft();
      this.x -= this.scale.y;
    }
    if (Math.sqrt(this.x - this.dst) < 5) {
      this.dst = this.x;
      this.anim('idle');
      this.onArrive(this);
    }
  }

  order() {
    const x = this.x + (this.width / 2);
    const y = this.y - this.height - 40;
    return new Order(x, y);
  }

  anim(name) {
    this.textures = this.animations[name];
    this.play();
  }

  tick(delta) {
    this.step();    
  }
}

