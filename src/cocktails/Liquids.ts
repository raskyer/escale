import { Physics, Scene, GameObjects } from 'phaser';
import Liquid from './Liquid';
import Bottle from './Bottle';

export default class Liquids extends Physics.Arcade.Group {
  static build(scene: Scene) {
    const liquids = new Liquids(scene.physics.world, scene);
    liquids
      .createMultiple({
        frameQuantity: 100, // 100
        key: 'liquid',
        active: false,
        visible: false,
        classType: Liquid
      })
      .forEach((liquid: Liquid) => {
        const body = liquid.body as Physics.Arcade.Body;
        body.velocity.y = 200;
        //body.collideWorldBounds = true;
        //body.checkCollision.none = true;
        //container.add(liquid);
      });

    return liquids;
  }

  flow(bottle: Bottle) {
    let liquid = this.getFirstDead();
    if (liquid) {
      liquid.flow(bottle);
    }
  }
}
