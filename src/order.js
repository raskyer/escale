import * as PIXI from 'pixi.js';

export default class Order extends PIXI.Graphics {
  constructor(x, y) {
    super();

    const style = new PIXI.TextStyle({
      fontSize: 20,
      fill: ['#ffffff', '#00ff99'],
    });
    const basicText = new PIXI.Text('Mojito', style);
    basicText.x = x - 25;
    basicText.y = y - 10;

    this.lineStyle(2, 0xFFFFFF, 1);
    this.drawCircle(x, y, 40);
    this.addChild(basicText);
    this.interactive = true;
    this.buttonMode = true;
  }
}
