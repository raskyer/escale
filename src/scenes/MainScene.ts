import * as Phaser from 'phaser';
import { addSeconds, format } from 'date-fns';

import Character from 'character/Character';
import Key from 'character/Key';
import Animation from 'character/Animation';
import Order from 'order/Order';
import CharacterFactory from 'character/CharacterFactory';
import ClientQueue from 'ClientQueue';
import Settings from 'utils/Settings';
import DrawableFactory from 'drawable/DrawableFactory';
import UI from 'drawable/UI';
import Liquids from 'cocktail/Liquids';
import Bottle from 'cocktail/Bottle';
import Glass from 'cocktail/Glass';
import Liquid from 'cocktail/Liquid';

export default class MainScene extends Phaser.Scene {
  private static BARMAID_IDLE = Key.Barmaid + '.' + Animation.Idle
  private static BARMAID_RUN = Key.Barmaid + '.' + Animation.Run;
  private static CLIENT1_IDLE = Key.Client1 + '.' + Animation.Idle;
  private static CLIENT1_RUN = Key.Client1 + '.' + Animation.Run;

  private settings: Settings;
  private ui: UI;
  private barmaid: Character;
  private bar: Phaser.GameObjects.Rectangle;
  private clients: Character[] = [];
  private orders: Order[] = [];

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
    this.load.image('bottle', 'assets/bottle.png');
    //this.load.audio('background', 'assets/sound/background.mp3');
  }

  create() {
    this.initAnims();
    //this.sound.play('background');
    this.settings = new Settings(this.sys.canvas);
    
    const dFactory = new DrawableFactory(this, this.settings);
    const cFactory = new CharacterFactory(this, this.settings);
    const queue = new ClientQueue(this.onReady.bind(this), this.onAwait.bind(this));

    dFactory.createBackground();
    dFactory.createFloor();


    /* COCKTAIL */
    const container = this.add.container(this.settings.middle + this.settings.barWidth, 0);
    container.setSize(this.settings.middle, this.settings.height);
    
    const zone = this.add.rectangle(0, 0, this.settings.middle, this.settings.height, 0xFF0000).setOrigin(0, 0);
    container.add(zone);

    const bottle = new Bottle(this, 0, 0, 'bottle');
    container.add(bottle);

    const glass = Glass.build(this, container);
    
    this.physics.world.setBounds(container.x, container.y, container.width, container.height);
    const liquids = new Liquids(this, container);

    const collider = this.physics.add.overlap(liquids, glass, function (glass: Glass, liquid: Liquid) {
      const lBody = <Phaser.Physics.Arcade.Body> liquid.body;
      //lBody.stop();
      glass.fill(liquid);
      lBody.checkCollision.none = true;
      liquid.setActive(false);
      liquid.setVisible(false);
    }, null, this);

    const repeat = this.time.addEvent({
      delay: 50,
      paused: true,
      loop: true,
      callback: () => {
        liquids.flow(bottle);
      }
    });

    this.input.on('wheel', (pointer: Phaser.Input.Pointer, dx: integer, dy: integer, dz: integer, event: any) => {
      bottle.angle -= dz / 10;
      if (bottle.angle > 80 || bottle.angle < -80) {
        liquids.flow(bottle);
        repeat.paused = false;
      } else {
        repeat.paused = true;
      }
    });
    //container.setVisible(false);
    /* COCKTAIL */

    this.ui = dFactory.createUI();
    this.barmaid = cFactory.createBarmaid();
    this.bar = dFactory.createBar();

    this.createClient(cFactory, queue);

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

  private createClient(factory: CharacterFactory, queue: ClientQueue) {
    const client = factory.createClient('1');
    this.clients.push(client);
    queue.addClient(client);
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
    await client.moveTo(this.bar.x, this.bar.y);
    const order = Order.build(this, client);

    order.addOnProgressListener(async _ => {
      //this.game.scene.start('cocktail');
      client.stopWait();
      this.ui.addCash(5);
      client.satisfaction(100);
      order.cancel();
      await client.leave(this.settings.entrance, this.settings.floor);
      client.destroy();
      this.clients = this.clients.filter(c => c !== client);
    });

    const tolerance = Phaser.Math.RND.integerInRange(3000, 6000);
    await client.startWait(tolerance);
    order.cancel();
    await client.leave(this.settings.entrance, this.settings.floor);
    client.destroy();
    this.clients = this.clients.filter(c => c !== client);
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
