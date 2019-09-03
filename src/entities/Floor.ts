import { Scene, GameObjects } from 'phaser';

export default class Floor {
  private sprite: GameObjects.Shape;

  constructor(scene: Scene, x: integer, y: integer, height: integer) {
    this.sprite = scene.add.rectangle(x, y, scene.sys.canvas.width, height, 0x151515, 1);
    this.sprite.setOrigin(0,0);
  }
}
