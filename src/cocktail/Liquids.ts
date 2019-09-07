import { Physics, Scene, GameObjects } from 'phaser';
import Liquid from './Liquid';
import Bottle from './Bottle';

export default class Liquids extends Physics.Arcade.Group {
  constructor(scene: Scene, container: GameObjects.Container) {
    super(scene.physics.world, scene);
    this.createMultiple({
      frameQuantity: 100, // 100
      key: 'liquid',
      active: false,
      visible: false,
      classType: Liquid
    }).forEach(liquid => {
      const body = <Physics.Arcade.Body> liquid.body;
      body.velocity.y = 200;
      body.collideWorldBounds = true;
      body.checkCollision.none = true;
      container.add(liquid);
    });
  }

  flow(bottle: Bottle) {
    let liquid = this.getFirstDead();
    if (liquid) {
      liquid.flow(bottle);
    }
  }
}
