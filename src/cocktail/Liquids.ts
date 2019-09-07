import { Physics, Scene, GameObjects } from 'phaser';
import Liquid from './Liquid';
import Bottle from './Bottle';

export default class Liquids extends Physics.Arcade.Group {
  constructor(scene: Scene, private readonly container: GameObjects.Container) {
    super(scene.physics.world, scene);
    this.createMultiple({
      frameQuantity: 100, //100
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

  flow(bottle: Bottle) {
    let liquid = this.getFirstDead();

    if (liquid) {
      this.container.add(liquid);
      liquid.flow(bottle);
    }
  }
}
