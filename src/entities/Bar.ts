export default class Bar {
  private sprite: Phaser.GameObjects.Shape;

  constructor(scene: Phaser.Scene, x: integer, y: integer) {
    this.sprite = scene.add.rectangle(x, y, 100, 15, 0x00FFFF);
    this.sprite.setOrigin(0,1);
  }
}
