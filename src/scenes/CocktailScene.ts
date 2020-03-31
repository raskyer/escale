import { Scene, Types } from 'phaser';

import Settings from '../utils/Settings';

import Bottle from '../cocktails/Bottle';
import Glass from '../cocktails/Glass';
import Liquids from '../cocktails/Liquids';
import Liquid from '../cocktails/Liquid';
import GlassTest from 'cocktails/GlassTest';

export default class CocktailScene extends Scene {
  private settings: Settings;

  constructor() {
    super({ key: CocktailScene.name });
  }

  init(data: any) {
    console.log(data);
    console.log(this.cameras.main, 'init');
  }

  preload() {
    this.load.image('bottle', 'assets/bottle.png');
  }

  create() {
    this.settings = Settings.getInstance(this.sys.canvas);
    //this.cameras.main.x = this.settings.middle + this.settings.barWidth;

    const cocktailRec = this.add.rectangle(0, 0, this.settings.middle, this.settings.height).setOrigin(0, 0);
    cocktailRec.setStrokeStyle(2, 0xff);

    const bottle = Bottle.build(this, 0, 0, 'bottle');
    //const glass = Glass.build(this, 0, 0);
    const liquids = Liquids.build(this);
    const glassTest = GlassTest.build(this);

    this.physics.world.setBounds(0, 0, this.settings.middle, this.settings.height);
    this.physics.add.collider(liquids, glassTest.getAll());
    //this.physics.add.collider(liquids, glass);

    /*const collider = this.physics.add.overlap(
      liquids,
      glass,
      function(glass: Glass, liquid: Liquid) {
        const lBody = liquid.body as Phaser.Physics.Arcade.Body;
        //lBody.stop();
        glass.fill(liquid);
        lBody.checkCollision.none = true;
        liquid.setActive(false);
        liquid.setVisible(false);
      },
      null,
      this
    );*/

    const repeat = this.time.addEvent({
      delay: 200,
      paused: true,
      loop: true,
      callback: () => {
        liquids.flow(bottle);
      }
    });

    /*this.input.on('drop', (pointer: Phaser.Input.Pointer, glass: Glass, dropZone: Phaser.GameObjects.Zone) => {
      console.log('drop', this.currentOrder);
      if (this.currentOrder === undefined) {
        // no order yet
        return;
      }
      if (glass instanceof Glass) {
        console.log('GLASS');
        //glass.input.enabled = false;
        // check if recipe of current glass === currentOrder
        const satisfaction = this.currentOrder.check(glass.getConsumable());
        console.log(satisfaction);
        this.destroyClient(this.currentOrder.getOwner(), satisfaction);
      }
    });*/

    this.input.on('wheel', (pointer: Phaser.Input.Pointer, dx: integer, dy: integer, dz: integer, event: any) => {
      bottle.angle -= dz / 10;
      if (bottle.angle > 80 || bottle.angle < -80) {
        //liquids.flow(bottle);
        repeat.paused = false;
      } else {
        repeat.paused = true;
      }
    });
  }
}
