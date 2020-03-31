import { Scene, GameObjects } from 'phaser';
import State from './State';
import Direction from './Direction';
import Settings from 'utils/Settings';
import { Consumer } from 'utils/Interfaces';

export default class Character extends GameObjects.Sprite {
  static readonly BAIRMAID = 'barmaid';
  static readonly CLIENT_1 = 'client1';

  private direction: Direction = Direction.Right;
  private speed: integer = 3;

  private wait: boolean = false;
  private elapsed: number = 0;
  private tolerance: number;
  private onAnnoyed: Consumer<Character>;

  private dstX: integer;
  private dstY: integer;
  private onArrive: Consumer<Character>;

  private leader: Character;

  private readonly onLeaveListeners: Consumer<Character>[] = [];

  private constructor(scene: Scene, x: integer, y: integer, private readonly key: string) {
    super(scene, x, y, key);
  }

  static build(scene: Scene, key: string, x: integer, y: integer) {
    const character = new Character(scene, x, y, key).setOrigin(0, 1).setScale(3, 3);
    character.state = State.Idle;
    scene.add.existing(character);
    return character;
  }

  static buildBarmaid(scene: Scene, settings: Settings): Character {
    const barmaid = Character.build(scene, Character.BAIRMAID, settings.middle, settings.floor);
    barmaid.setX(barmaid.x + barmaid.displayWidth);
    barmaid.turn(Direction.Left);
    return barmaid;
  }

  static buildClient(scene: Scene, settings: Settings): Character {
    return Character.build(scene, Character.CLIENT_1, 0, settings.floor);
  }

  turn(direction: Direction) {
    if (this.direction === direction) {
      return;
    } else if (direction === Direction.Left) {
      this.direction = direction;
      this.setScale(-Math.abs(this.scaleX), this.scaleY);
      this.setOrigin(1, 1);
    } else if (direction === Direction.Right) {
      this.direction = direction;
      this.setScale(Math.abs(this.scaleX), this.scaleY);
      this.setOrigin(0, 1);
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

  startWait(tolerance: integer): Promise<Character> {
    return new Promise(resolve => {
      this.tolerance = tolerance;
      this.wait = true;
      this.elapsed = 0;
      this.onAnnoyed = resolve;
    });
  }

  stopWait() {
    this.wait = false;
    this.elapsed = 0;
    this.onAnnoyed = undefined;
  }

  satisfaction(level: integer) {
    if (level > 90) {
      this.setTint(0x00ff00);
    }
  }

  getDirection() {
    return this.direction;
  }

  addOnLeaveListener(listener: Consumer<Character>) {
    this.onLeaveListeners.push(listener);
  }

  leave(x: integer, y: integer): Promise<Character> {
    this.onLeaveListeners.forEach(l => l(this));
    return this.moveTo(x, y);
  }

  tick(delta: number) {
    if (this.wait) {
      this.elapsed += delta;
      if (this.elapsed > this.tolerance) {
        this.setTint(0xff0000);
        this.onAnnoyed(this);
        this.stopWait();
      }
    }

    switch (this.state) {
      case State.Idle.toString():
        return this.tickIdle();
      case State.Move.toString():
        return this.tickMove();
      case State.Follow.toString():
        return this.tickFollow();
    }
  }

  private tickIdle() {
    this.animate(State.Idle);
  }

  private tickMove() {
    this.animate(State.Move);
    this.step();

    if (Phaser.Math.Distance.Between(this.dstX, this.dstY, this.x, this.y) < 10) {
      this.state = State.Idle;
      this.onArrive && this.onArrive(this);
    }
  }

  private tickFollow() {
    const dir = this.leader.getDirection();
    const offset = dir === Direction.Right ? this.leader.displayWidth * -1 : this.leader.displayWidth;
    this.dstX = this.leader.x + offset;
    this.dstY = this.leader.y;

    if (this.dstX !== this.x || this.dstY !== this.y) {
      this.animate(State.Move);
      this.step();
    } else {
      this.animate(State.Idle);
      this.onArrive && this.onArrive(this);
    }
  }

  private animate(state: State) {
    const fullKey = this.key + '.' + state;
    if (this.anims.getCurrentKey() !== fullKey) {
      this.anims.play(fullKey);
    }
  }

  private step() {
    if (this.x < this.dstX) {
      this.turn(Direction.Right);
      this.setX(this.x + this.speed);
    } else if (this.x > this.dstX) {
      this.turn(Direction.Left);
      this.setX(this.x - this.speed);
    }
  }
}
