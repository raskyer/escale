export default class Settings {
  readonly width: integer;
  readonly height: integer;

  readonly middle: integer;
  readonly floor: integer;
  
  readonly entrance: integer = 0;
  readonly barColor: integer = 0x00FFFF;
  readonly barWidth: integer = 300;
  readonly barHeight: integer = 50;
  readonly floorColor: integer = 0x151515;
  readonly floorHeight: integer = 20;

  constructor(canvas: HTMLCanvasElement) {
    this.width = canvas.width;
    this.height = canvas.height;
    
    this.middle = this.width / 2;
    this.floor = this.height - this.floorHeight;
  }
}
