import { GameObjects } from 'phaser';
import State from './State';
import Direction from './Direction';
import Animation from './Animation';

type Consumer<T> = (elem: T) => void;

export default class Character {
  private sprite: GameObjects.Sprite;
  private key: string;
  private id: string;
  
  private state: State = State.Idle;
  private direction: Direction = Direction.Right;
  private speed: integer = 1;

  private wait: boolean = false;
  private elapsed: number = 0;
  private tolerance: integer = 2000;
  private onAnnoyed: Consumer<Character>;

  private dstX: integer;
  private dstY: integer;
  private onArrive: Consumer<Character>;

  private leader: Character;

  private onLeaveListeners: Consumer<Character>[] = [];

  constructor(sprite: GameObjects.Sprite, key: string, id: string) {
    this.sprite = sprite;
    this.key = key;
    this.id = id;
  }

  turn(direction: Direction) {
    if (this.direction === direction) {
      return;
    } else if (direction === Direction.Left) {
      this.direction = direction;
      this.sprite.setScale(-1, 1);
      this.sprite.setOrigin(1, 1);
    } else if (direction === Direction.Right) {
      this.direction = direction;      
      this.sprite.setScale(1, 1);
      this.sprite.setOrigin(0, 1);
    }
  }

  moveTo(x: integer, y: integer): Promise<Character> {
    this.unfollow();
    return new Promise(resolve => {
      this.dstX = x;
      this.dstY = y;
      this.onArrive = resolve;
      this.state = State.Move;
    });
  }

  follow(character: Character): Promise<Character> {
    return new Promise(resolve => {
      this.state = State.Follow;
      this.leader = character;
      this.onArrive = resolve;
    });
  }

  unfollow() {
    this.leader = undefined;
    this.onArrive = undefined;
  }

  startWait(onAnnoyed: Consumer<Character>) {
    this.wait = true;
    this.elapsed = 0;
    this.onAnnoyed = onAnnoyed;
  }

  stopWait() {
    this.wait = false;
  }

  getX() {
    return this.sprite.x;
  }

  getY() {
    return this.sprite.y;
  }

  getWidth() {
    return this.sprite.width;
  }

  getHeight() {
    return this.sprite.height;
  }

  getState() {
    return this.state;
  }

  getDirection() {
    return this.direction;
  }

  addOnLeaveListener(listener: Consumer<Character>) {
    this.onLeaveListeners.push(listener);
  }

  leave() {
    this.onLeaveListeners.forEach(l => l(this));
  }

  destroy() {
    this.sprite.destroy();
  }

  tick(delta: number) {
    if (this.wait) {
      this.elapsed += delta;
      if (this.elapsed > this.tolerance) {
        this.stopWait();
        this.onAnnoyed(this);
      }
    }

    switch (this.state) {
      case State.Idle:
        return this.tickIdle();
      case State.Move:
        return this.tickMove();
      case State.Follow:
        return this.tickFollow();
    }
  }

  private tickIdle() {
    this.anim(Animation.Idle);
  }

  private tickMove() {
    this.anim(Animation.Run);
    this.step();

    if (Phaser.Math.Distance.Between(this.dstX, this.dstY, this.sprite.x, this.sprite.y) < 10) {
      this.state = State.Idle;
      this.onArrive && this.onArrive(this);
    }
  }

  private tickFollow() {
    const dir = this.leader.getDirection();
    const offset = dir === Direction.Right ? this.leader.getWidth() * -1 : this.leader.getWidth();
    this.dstX = this.leader.getX() + offset;
    this.dstY = this.leader.getY();

    if (this.dstX !== this.sprite.x || this.dstY !== this.sprite.y) {
      this.anim(Animation.Run);
      this.step();
    } else {
      this.anim(Animation.Idle);
      this.onArrive && this.onArrive(this);
    }
  }

  private anim(anim: Animation) {
    const fullKey = this.key + '.' + anim;
    if (this.sprite.anims.getCurrentKey() !== fullKey) {
      this.sprite.play(fullKey);
    }
  }

  private step() {
    if (this.sprite.x < this.dstX) {
      this.turn(Direction.Right);
      this.sprite.setX(this.sprite.x + this.speed);
    } else if (this.sprite.x > this.dstX) {
      this.turn(Direction.Left);
      this.sprite.setX(this.sprite.x - this.speed);
    }
  }
}
