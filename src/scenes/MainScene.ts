import * as Phaser from 'phaser';
import Floor from 'drawable/Floor';
import Bar from 'drawable/Bar';
import Character from 'character/Character';
import Key from 'character/Key';
import Animation from 'character/Animation';
import Order from 'cocktail/Order';
import Orderable from 'cocktail/Orderable';
import CharacterFactory from 'character/CharacterFactory';
import ClientQueue from 'ClientQueue';

export class MainScene extends Phaser.Scene {
  private static BARMAID_IDLE = Key.Barmaid + '.' + Animation.Idle
  private static BARMAID_RUN = Key.Barmaid + '.' + Animation.Run;
  private static CLIENT1_IDLE = Key.Client1 + '.' + Animation.Idle;
  private static CLIENT1_RUN = Key.Client1 + '.' + Animation.Run;

  private floor: Floor;
  private barmaid: Character;
  private bar: Bar;
  private clients: Character[] = [];
  private queue: Character[] = [];
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
    //this.load.audio('background', 'assets/sound/background.mp3');
  }

  create() {
    this.initAnims();
    this.scale.setGameSize(600, 200);
    this.scale.setZoom(3);
    //this.sound.play('background');

    const width = this.sys.game.canvas.width;
    const height = this.sys.game.canvas.height;
    const entrance = 0;
    const floorHeight = 20;
    const middle = width / 2;
    const floor = height - floorHeight;

    const background = this.add.image(-100, 60, 'background').setOrigin(0, 0);
    background.setDisplaySize(width + 100, height - 50);

    const factory = new CharacterFactory(this, entrance, middle, floor);
    this.floor = new Floor(this, 0, floor, floorHeight);
    this.barmaid = factory.createBarmaid();
    this.bar = new Bar(this, middle, floor);

    const queue = new ClientQueue(this.bar);
    const client1 = factory.createClient('1');
    const client2 = factory.createClient('2');
    const client3 = factory.createClient('3');

    this.clients.push(client1, client2, client3);
    
    queue
      .addClient(client1)
      .addClient(client2)
      .addClient(client3);
  }

  update(time: number, delta: number) {
    this.barmaid.tick(delta);
    this.clients.forEach(client => client.tick(delta));

    /*if (this.queue.length > 0 && this.queue[0].getState() === State.Run) {
      const leaver = this.queue.shift();
      // this.queue[0].moveTo(bar)
      // this.queue[y = 1...n].follow(y-1)
    }*/
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
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: MainScene.CLIENT1_RUN,
      frames: this.anims.generateFrameNumbers(MainScene.CLIENT1_RUN, { start: 0, end: 7 }),
      frameRate: 7,
      repeat: -1
    });
  }

  private buildClientEvery(delay: integer, factory: CharacterFactory) {
    this.time.delayedCall(delay, () => {
      this.buildClient(factory);
      this.buildClientEvery(delay, factory);
    }, [], this);
  }

  private buildClient(factory: CharacterFactory) {
    const client = factory.createClient('');
    this.clients.push(client);
    /*factory
      .applyOrderRoutine(client)
      .then(({ inProgress, client }) => {
        if (!inProgress) {
          this.clients = this.clients.filter(c => c !== client);
        }
      });
    */
  }
}
