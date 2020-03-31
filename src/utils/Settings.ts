export default class Settings {
  private static INSTANCE: Settings = null;

  readonly middle: integer;
  readonly floor: integer;

  readonly entrance: integer = 0;
  readonly barColor: integer = 0x00ffff;
  readonly barWidth: integer = 300;
  readonly barHeight: integer = 50;
  readonly floorColor: integer = 0x151515;
  readonly floorHeight: integer = 20;

  private constructor(readonly width: integer, readonly height: integer) {
    this.middle = width / 2;
    this.floor = height - this.floorHeight;
  }

  static getInstance(canvas: HTMLCanvasElement) {
    if (Settings.INSTANCE === null) {
      Settings.INSTANCE = new Settings(canvas.width, canvas.height);
    }
    return Settings.INSTANCE;
  }
}
