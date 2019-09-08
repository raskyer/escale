import { Physics, Scene, GameObjects } from 'phaser';
import Bottle from './Bottle';
import Consumable from './Consumable';

export default class Liquid extends GameObjects.Arc {
  consumable: Consumable;

  constructor(scene: Scene, x: integer, y: integer) {
    super(scene, x, y, 3);
  }

  flow(bottle: Bottle) {
    const body = <Physics.Arcade.Body> this.body;
    body.checkCollision.none = false;
    body.reset(bottle.x, bottle.y);

    this.fillColor = bottle.color;
    this.consumable = bottle.consumable;
    this.setActive(true);
    this.setVisible(true);
  }

  preUpdate() {
    if (this.y + this.height > this.parentContainer.height) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}
