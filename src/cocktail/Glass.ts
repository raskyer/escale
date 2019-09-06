import { Physics, Scene, GameObjects } from "phaser";

const SIZE = 2;

const TOP_LEFT_X = 0;
const TOP_RIGHT_X = 45;
const BOTTOM_LEFT_X = 15;
const BOTTOM_RIGHT_X = 30;

const TOP_Y = 0;
const BOTTOM_Y = 40;

export default class Glass extends Physics.Arcade.Sprite {
  private readonly g: GameObjects.Graphics;
  private level = 1;

  constructor(scene: Scene, x: integer, y: integer, texture: string) {
    super(scene, x, y, texture);

    this.setOrigin(0,0);
    this.setInteractive();
    scene.input.setDraggable(this);
    scene.physics.add.existing(this);

    (this.body as Physics.Arcade.Body).allowGravity = false;
    (this.body as Physics.Arcade.Body).collideWorldBounds = true;
    this.g = scene.add.graphics({
      fillStyle: {
        color: 0x0000FF,
        alpha: 1
      }
    });

    this.on('drag', this.onDrag, this);
  }

  fill() {
    this.updateG();
    this.level++;
  }

  private updateG() {
    this.g.clear();

    const topY = (this.y + BOTTOM_Y) - this.level - SIZE;
    const bottomY = this.y + BOTTOM_Y;

    let diff = ((this.y + this.height) - topY) / 2;
    diff = diff + SIZE;

    let topLX = (this.x + BOTTOM_LEFT_X) - (this.level - diff);
    let topRX = (this.x + BOTTOM_RIGHT_X) + (this.level - diff);

    const points = [
      {x: topLX, y: topY},
      {x: this.x + BOTTOM_LEFT_X, y: bottomY},
      {x: this.x + BOTTOM_RIGHT_X, y: bottomY},
      {x: topRX, y: topY}
    ];

    this.g.fillPoints(points);
    this.parentContainer.add(this.g);
  }

  private onDrag(pointer: Phaser.Input.Pointer, dragX: integer, dragY: integer) {
    this.x = dragX;
    this.y = dragY;
    this.updateG();
  }

  /*
  const prevX = this.x;
  const prevY = this.y;

  this.x = dragX;
  this.y = dragY;

  const zoneBounds = zone.getBounds();
  const bottleBounds = this.getBounds();

  if (!Phaser.Geom.Rectangle.ContainsRect(zoneBounds, bottleBounds)) {
    this.x = prevX;
    this.y = prevY;
  }
  */

  static build(scene: Scene) {
    if (!scene.textures.exists('glass')) {
      const style = {
        lineStyle: {
          width: SIZE,
          color: 0xffffff,
          alpha: 1
        }
      };
      const points = [
        {x: TOP_LEFT_X, y: TOP_Y},
        {x: BOTTOM_LEFT_X, y: BOTTOM_Y},
        {x: BOTTOM_RIGHT_X, y: BOTTOM_Y},
        {x: TOP_RIGHT_X, y: TOP_Y}
      ];
      scene.add
        .graphics(style)
        .strokePoints(points, false, false)
        .generateTexture('glass', 47, 43)
        .destroy();
    }
    return new Glass(scene, 0, 0, 'glass');
  }
}
