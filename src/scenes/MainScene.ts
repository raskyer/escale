import * as Phaser from 'phaser';
import { addSeconds, format } from 'date-fns';

import Bar from 'drawable/Bar';
import Character from 'character/Character';
import Key from 'character/Key';
import Animation from 'character/Animation';
import Order from 'cocktail/Order';
import Orderable from 'cocktail/Orderable';
import CharacterFactory from 'character/CharacterFactory';
import ClientQueue from 'ClientQueue';
import OrderFactory from 'cocktail/OrderFactory';
import Settings from 'utils/Settings';
import DrawableFactory from 'drawable/DrawableFactory';
import UI from 'drawable/UI';

export class MainScene extends Phaser.Scene {
  private static BARMAID_IDLE = Key.Barmaid + '.' + Animation.Idle
  private static BARMAID_RUN = Key.Barmaid + '.' + Animation.Run;
  private static CLIENT1_IDLE = Key.Client1 + '.' + Animation.Idle;
  private static CLIENT1_RUN = Key.Client1 + '.' + Animation.Run;

  private settings: Settings;
  private ui: UI;
  private barmaid: Character;
  private bar: Bar;
  private clients: Character[] = [];
  private orders: Order<Orderable>[] = [];

  private currentDate = new Date('1995-12-17T00:00:00');

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
    //this.scale.setGameSize(600, 200);
    //this.scale.setZoom(3);
    //this.sound.play('background');
    this.settings = new Settings(this.sys.canvas);
    
    const dFactory = new DrawableFactory(this, this.settings);
    const cFactory = new CharacterFactory(this, this.settings);

    dFactory.createBackground();
    dFactory.createFloor();

    this.ui = dFactory.createUI();
    this.barmaid = cFactory.createBarmaid();
    this.bar = dFactory.createBar();

    const queue = new ClientQueue(this.onReady.bind(this), this.onAwait.bind(this));
    const client1 = cFactory.createClient('1');
    const client2 = cFactory.createClient('2');
    const client3 = cFactory.createClient('3');

    this.clients.push(client1, client2, client3);
    
    queue
      .addClient(client1)
      .addClient(client2)
      .addClient(client3);

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.currentDate = addSeconds(this.currentDate, 1);
        this.ui.setTime(format(this.currentDate, 'mm:ss'));
      }
    });

    this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => {
        if (queue.isFull()) {
          return;
        }
        const client = cFactory.createClient(this.clients.length.toString());
        this.clients.push(client);
        queue.addClient(client);
      }
    })
  }

  update(time: number, delta: number) {
    this.barmaid.tick(delta);
    this.clients.forEach(client => client.tick(delta));
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
  }

  private async onReady(client: Character) {
    await client.moveTo(this.bar.getX(), this.bar.getY());
    const order = OrderFactory.createOrderFor(this, client);
    const tolerance = Phaser.Math.RND.integerInRange(3000, 6000);

    order.addOnProgressListener(_ => {
      client.stopWait();
      client.satisfaction(100);
      client.leave();
      order.cancel();
      client.moveTo(this.settings.entrance, this.settings.floor)
      .then(_ => {
        client.destroy();
        this.clients = this.clients.filter(c => c !== client);
      });
    });

    client.startWait(tolerance)
    .then(_ => {
      client.leave();
      order.cancel();
      client.moveTo(this.settings.entrance, this.settings.floor)
      .then(_ => {
        client.destroy();
        this.clients = this.clients.filter(c => c !== client);
      });
    });
  }

  private async onAwait(client: Character, prev: Character) {
    await client.follow(prev);
    /*client.startWait()
    .then(_ => {
      client.leave();
      client.moveTo(0, client.getY());
    });*/
  }
}
