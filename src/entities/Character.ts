import { Scene, GameObjects } from 'phaser';
import State from './State';
import Direction from './Direction';
import Order from './Order';

export default class Character {
  private key: string;
  private sprite: GameObjects.Sprite;
  
  private state: State;
  private dir: Direction;

  private dstX: integer;
  private dstY: integer;
  private onArrive: (character: Character) => void;
  private speed: integer = 1;

  constructor(scene: Scene, key: string, x: integer, y: integer) {
    this.key = key;
    this.state = State.Idle;
    this.sprite = scene.add.sprite(x, y, this.key + '.' + this.state);
    this.sprite.setOrigin(0, 1);
  }

  turn(dir: Direction) {
    if (this.dir === dir) {
      return;
    } else if (dir === Direction.Left) {
      this.sprite.setScale(-1, 1);
      this.sprite.setOrigin(1, 1);
    } else if (dir === Direction.Right) {
      this.sprite.setScale(1, 1);
      this.sprite.setOrigin(0, 1);
    }
  }

  moveTo(x: integer, y: integer, onArrive: (character: Character) => void) {
    this.dstX = x;
    this.dstY = y;
    this.onArrive = onArrive;
    this.state = State.Run;
  }

  order(scene: Scene) {
    return new Order(scene, this, this.sprite.x, this.sprite.y - this.sprite.height);
  }

  tick() {
    this.sprite.play(this.key + '.' + this.state, true);
    if (this.state === State.Idle) {
      return;
    }
    if (this.sprite.x < this.dstX) {
      this.turn(Direction.Right);
      this.sprite.setX(this.sprite.x + this.speed);
    } else if (this.sprite.x > this.dstX) {
      this.turn(Direction.Left);
      this.sprite.setX(this.sprite.x - this.speed);
    }
    if (Phaser.Math.Distance.Between(this.dstX, this.dstY, this.sprite.x, this.sprite.y) < 5) {
      this.state = State.Idle;
      this.onArrive(this);
    }
  }
}
