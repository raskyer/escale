import * as Phaser from 'phaser';
import { addSeconds, format } from 'date-fns';

import Character from 'characters/Character';
import Order from 'orders/Order';
import Settings from 'utils/Settings';
import UI from 'drawables/UI';
import State from 'characters/State';
import Background from 'drawables/Background';
import Floor from 'drawables/Floor';
import Bar from 'drawables/Bar';
import Queue from 'characters/Queue';
import CocktailScene from './CocktailScene';

export default class MainScene extends Phaser.Scene {
  private static readonly BARMAID_IDLE = Character.BAIRMAID + '.' + State.Idle;
  private static readonly BARMAID_MOVE = Character.BAIRMAID + '.' + State.Move;
  private static readonly CLIENT1_IDLE = Character.CLIENT_1 + '.' + State.Idle;
  private static readonly CLIENT1_MOVE = Character.CLIENT_1 + '.' + State.Move;

  private readonly queue: Queue = new Queue(this.onReady.bind(this), this.onAwait.bind(this));

  private settings: Settings;
  private ui: UI;
  private barmaid: Character;
  private bar: Phaser.GameObjects.Rectangle;
  private clients: Character[] = [];
  private currentOrder: Order | undefined;

  private currentDate = new Date('1995-12-17T00:00:00');

  constructor() {
    super({ key: MainScene.name });
  }

  preload() {
    this.load.image('background', 'assets/background3.jpg');
    this.load.spritesheet(MainScene.BARMAID_IDLE, 'assets/barmaid.idle.png', {
      frameWidth: 19,
      frameHeight: 34
    });
    this.load.spritesheet(MainScene.BARMAID_MOVE, 'assets/barmaid.move.png', {
      frameWidth: 21,
      frameHeight: 33
    });
    this.load.spritesheet(MainScene.CLIENT1_IDLE, 'assets/client1.idle.png', {
      frameWidth: 32,
      frameHeight: 28
    });
    this.load.spritesheet(MainScene.CLIENT1_MOVE, 'assets/client1.move.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    //this.load.audio('background', 'assets/sound/background.mp3');
  }

  create() {
    this.initAnims();
    //this.sound.play('background');
    this.settings = Settings.getInstance(this.sys.canvas);

    Background.build(this, this.settings);
    Floor.build(this, this.settings);

    this.ui = UI.build(this, this.settings);
    this.barmaid = Character.buildBarmaid(this, this.settings);
    this.bar = Bar.build(this, this.settings);
    //this.createClient();
    this.scene.run(CocktailScene.name);

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
        if (this.queue.isFull()) {
          return;
        }
        //this.createClient(queue);
      }
    });
  }

  update(time: number, delta: number) {
    this.barmaid.tick(delta);
    this.clients.forEach(client => client.tick(delta));
  }

  private initAnims() {
    this.anims.create({
      key: MainScene.BARMAID_IDLE,
      frames: this.anims.generateFrameNumbers(MainScene.BARMAID_IDLE, {
        start: 0,
        end: 11
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: MainScene.BARMAID_MOVE,
      frames: this.anims.generateFrameNumbers(MainScene.BARMAID_MOVE, {
        start: 0,
        end: 11
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: MainScene.CLIENT1_IDLE,
      frames: this.anims.generateFrameNumbers(MainScene.CLIENT1_IDLE, {
        start: 0,
        end: 7
      }),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: MainScene.CLIENT1_MOVE,
      frames: this.anims.generateFrameNumbers(MainScene.CLIENT1_MOVE, {
        start: 0,
        end: 7
      }),
      frameRate: 7,
      repeat: -1
    });
  }

  private createClient() {
    const client = Character.buildClient(this, this.settings);
    this.clients.push(client);
    this.queue.addClient(client);
  }

  private destroyClient(client: Character, satisfaction: integer) {
    client.satisfaction(satisfaction);
    this.currentOrder.cancel();
    client.leave(this.settings.entrance, this.settings.floor).then(() => {
      this.clients = this.clients.filter(c => c !== client);
      client.destroy();
    });
  }

  private async onReady(client: Character) {
    await client.moveTo(this.settings.middle, this.settings.floor);
    const order = Order.build(this, client);

    order.addOnProgressListener(async _ => {
      this.scene.run(CocktailScene.name, {
        camera: {
          backgroundColor: 'purple'
        }
      });
      this.currentOrder = order;

      /*client.stopWait();
      this.ui.addCash(5);
      client.satisfaction(100);
      order.cancel();
      await client.leave(this.settings.entrance, this.settings.floor);
      client.destroy();
      this.clients = this.clients.filter(c => c !== client);*/
    });

    /*const tolerance = Phaser.Math.RND.integerInRange(3000, 6000);
    await client.startWait(tolerance);
    order.cancel();
    await client.leave(this.settings.entrance, this.settings.floor);
    client.destroy();
    this.clients = this.clients.filter(c => c !== client);*/
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
