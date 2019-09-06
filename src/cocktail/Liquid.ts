import { Physics, Scene, GameObjects } from "phaser";

export default class Liquid extends GameObjects.Arc {
  constructor(scene: Scene, x: integer, y: integer) {
    super(scene, x, y, 3, undefined, undefined, undefined, 0x0000FF, 1);
  }

  flow(x: integer, y: integer) {
    const body = <Physics.Arcade.Body> this.body;
    body.checkCollision.none = false;
    body.reset(x, y);
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
