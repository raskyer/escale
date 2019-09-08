import { Physics, Scene } from "phaser";
import Consumable from "./Consumable";

export default class Bottle extends Physics.Arcade.Sprite {
  readonly consumable: Consumable = Consumable.Rhum;
  readonly color: number = 0x00FF00;

  constructor(scene: Scene, x: integer, y: integer, texture: string) {
    super(scene, x, y, texture);
    
    this.setOrigin(0.5, 0);
    this.setInteractive();
    scene.input.setDraggable(this);
    scene.physics.add.existing(this);
    
    this.x += this.width / 2;
    (this.body as Physics.Arcade.Body).allowGravity = false;
    (this.body as Physics.Arcade.Body).collideWorldBounds = true;

    this.on('drag', this.onDrag, this);
  }

  private onDrag(_: Phaser.Input.Pointer, dragX: integer, dragY: integer) {
    this.x = dragX;
    this.y = dragY;
  }
}
