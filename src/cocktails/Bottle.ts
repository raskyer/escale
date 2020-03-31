import { Physics, Scene } from 'phaser';
import Consumable from './Consumable';

export default class Bottle extends Physics.Arcade.Sprite {
  readonly consumable: Consumable = Consumable.Rhum;
  readonly color: number = 0x00ff00;

  private constructor(scene: Scene, x: integer, y: integer, texture: string) {
    super(scene, x, y, texture);
  }

  static build(scene: Scene, x: integer, y: integer, texture: string): Bottle {
    const bottle = new Bottle(scene, x, y, texture);

    bottle.setOrigin(0.5, 0);
    bottle.setInteractive();
    scene.input.setDraggable(bottle);
    scene.physics.add.existing(bottle);

    bottle.x += bottle.width / 2;
    (bottle.body as Physics.Arcade.Body).allowGravity = false;
    (bottle.body as Physics.Arcade.Body).collideWorldBounds = true;
    bottle.on('drag', bottle.onDrag, bottle);
    scene.add.existing(bottle);

    return bottle;
  }

  private onDrag(_: Phaser.Input.Pointer, x: integer, y: integer) {
    this.x = x;
    this.y = y;
  }
}
