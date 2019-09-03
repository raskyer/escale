import * as Phaser from 'phaser';
import Floor from '../entities/Floor';
import Character from '../entities/Character';
import Key from '../entities/Key';
import State from '../entities/State';
import Bar from '../entities/Bar';
import Order from '../entities/Order';
import Direction from '../entities/Direction';
import Orderable from '../entities/Orderable';

export class MainScene extends Phaser.Scene {
  private static BARMAID_IDLE = Key.Barmaid + '.' + State.Idle
  private static BARMAID_RUN = Key.Barmaid + '.' + State.Run;
  private static CLIENT1_IDLE = Key.Client1 + '.' + State.Idle;
  private static CLIENT1_RUN = Key.Client1 + '.' + State.Run;

  private barmaid: Character;
  private clients: Character[] = [];
  private bar: Bar;
  private orders: Order<Orderable>[] = [];

  constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  preload() {
    this.load.image('background', 'assets/background3.jpg');
    this.load.spritesheet(MainScene.BARMAID_IDLE, 'assets/barmaid.idle.png', { frameWidth: 19, frameHeight: 34 });
    this.load.spritesheet(MainScene.BARMAID_RUN, 'assets/barmaid.run.png', { frameWidth: 21, frameHeight: 33 });
    this.load.spritesheet(MainScene.CLIENT1_IDLE, 'assets/client1.idle.png', { frameWidth: 32, frameHeight: 28 });
    this.load.spritesheet(MainScene.CLIENT1_RUN, 'assets/client1.run.png', { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    this.initAnims();
    this.scale.setGameSize(600, 200);
    this.scale.setZoom(3);

    const width = this.sys.game.canvas.width;
    const height = this.sys.game.canvas.height;
    const floorHeight = 20;
    const middle = width / 2;
    const floor = height - floorHeight;

    const back = this.add.image(-100, 60, 'background').setOrigin(0, 0);
    back.setDisplaySize(width + 100, height - 50);

    new Floor(this, 0, floor, floorHeight);
    this.barmaid = new Character(this, Key.Barmaid, middle + 30, floor);
    this.barmaid.turn(Direction.Left);
    this.bar = new Bar(this, middle, floor);
    this.clients.push(new Character(this, Key.Client1, 0, floor));

    this.clients.forEach(async (client: Character) => {
      await client.asyncMoveTo(middle, floor);
      const order = client.order(this);
      this.time.delayedCall(1000, async () => {
        order.cancel();
        await client.asyncMoveTo(0, floor);
        client.leave();
      }, [], this);
    });

    const makeDelay = () => Phaser.Math.RND.integerInRange(3000, 6000);
    const makeCall = () => {
      this.time.delayedCall(makeDelay(), () => {
        const client = new Character(this, Key.Client1, 0, floor);
        this.clients.push(client);
        client.moveTo(middle, floor, () => {});
        makeCall();
      }, [], this);
    }
    makeCall();

    /*
    this.input.on('gameobjectdown', (_: any, o: any) => {
      console.log(o);
    });
    */
  }

  update() {
    this.barmaid.tick();
    this.clients.forEach(client => client.tick());


  }

  private initAnims() {
    this.anims.create({
      key: MainScene.BARMAID_IDLE,
      frames: this.anims.generateFrameNumbers(MainScene.BARMAID_IDLE, { start: 0, end: 11 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: MainScene.BARMAID_RUN,
      frames: this.anims.generateFrameNumbers(MainScene.BARMAID_RUN, { start: 0, end: 11 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: MainScene.CLIENT1_IDLE,
      frames: this.anims.generateFrameNumbers(MainScene.CLIENT1_IDLE, { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: MainScene.CLIENT1_RUN,
      frames: this.anims.generateFrameNumbers(MainScene.CLIENT1_RUN, { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    });
  }
}
