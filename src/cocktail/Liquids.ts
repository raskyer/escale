import { Physics, Scene, GameObjects } from "phaser";
import Liquid from './Liquid';

export default class Liquids extends Physics.Arcade.Group {
  constructor(scene: Scene, private readonly container: GameObjects.Container) {
    super(scene.physics.world, scene);
    this.createMultiple({
      frameQuantity: 10, //100
      key: 'liquid',
      active: false,
      visible: false,
      classType: Liquid
    }).forEach(liquid => {
      (liquid.body as Physics.Arcade.Body).velocity.y = 200;
      (liquid.body as Physics.Arcade.Body).collideWorldBounds = true;
      (liquid.body as Physics.Arcade.Body).checkCollision.none = true;
    });
  }

  flow(x: integer, y: integer) {
    let liquid = this.getFirstDead();

    if (liquid) {
      this.container.add(liquid);
      liquid.flow(x, y);
    }
  }
}
