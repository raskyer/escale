import { Physics, Scene, GameObjects, Game } from "phaser";

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

  constructor(scene: Scene, x: integer, y: integer, texture: string, private readonly filler: GameObjects.Sprite, private readonly masked: GameObjects.Graphics) {
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
    if (this.level > this.height) {
      return;
    }
    if (this.level > 10) {
    }
    this.level++;
    this.updateG();
  }

  private updateG() {
    this.masked.y = this.y - this.level;
    /*this.g.clear();

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
    this.parentContainer.add(this.g);*/
  }

  private onDrag(pointer: Phaser.Input.Pointer, dragX: integer, dragY: integer) {
    this.x = dragX;
    this.y = dragY;
    this.filler.x = dragX;
    this.filler.y = dragY;
    this.masked.x = dragX;
    this.masked.y = dragY - this.level;
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

  static build(scene: Scene, container: GameObjects.Container) {
    if (!scene.textures.exists('glass')) {
      const style = {
        fillStyle: {
          color: 0x0000FF,
          alpha: 1
        },
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

      scene.add
        .graphics(style)
        .fillPoints(points)
        .generateTexture('filler', 47, 43)
        .destroy()
    }

    const filler = scene.add.sprite(0, 0, 'filler').setOrigin(0, 0);

    const g = scene.make.graphics({});
    Glass.makeMask(g, 0xFFFFFF, container.x, 0, filler.width, filler.height);
    
    const mask = g.createGeometryMask();
    mask.invertAlpha = true;
    filler.setMask(mask);
    
    const glass = new Glass(scene, 0, 0, 'glass', filler, g);
    container.add(glass).add(filler);

    return glass;
  }

  static makeMask(g: GameObjects.Graphics, color: integer, x: integer, y: integer, width: integer, height: integer) {
    g
    .fillStyle(color)
    .beginPath()
    .fillRect(x, y, width, height);
  }
}
