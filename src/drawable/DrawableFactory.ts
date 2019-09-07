import { Scene, Types } from "phaser";
import Settings from "utils/Settings";
import UI from "./UI";

export default class DrawableFactory {
  private readonly scene: Scene;
  private readonly settings: Settings;

  constructor(scene: Scene, settings: Settings) {
    this.scene = scene;
    this.settings = settings;
  }

  createBackground() {
    return this.scene.add
      .image(-220, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(this.settings.width + 250, this.settings.height + 50);
  }

  createFloor() {
    return this.scene.add
      .rectangle(
        this.settings.entrance,
        this.settings.floor,
        this.settings.width,
        this.settings.height,
        this.settings.floorColor,
        1
      )
      .setOrigin(0,0);
  }

  createBar() {
    return this.scene.add
      .rectangle(
        this.settings.middle,
        this.settings.floor, 
        this.settings.barWidth,
        this.settings.barHeight,
        this.settings.barColor
      )
      .setOrigin(0,1);
  }

  createUI() {
    const style: Types.GameObjects.Text.TextStyle = {
      fontSize: '20px',
      fontStyle: 'bold'
    };

    const time = this.scene.add
      .text(this.settings.width - 5, 10, '00:00', style)
      .setOrigin(1,0);
    
    const cash = this.scene.add
      .text(this.settings.width - 5, 30, '0$', style)
      .setOrigin(1,0);
    
    return new UI(time, cash);
  }

  static createMsg(scene: Scene, x: integer, y: integer, text: string) {
    const style: Types.GameObjects.Text.TextStyle = {
      color: '#00FF00',
      fontFamily: "Arial Black",
      fontSize: '20px',
      fontStyle: 'bold',
      backgroundColor: '#FFFFFF',
      padding: {
        x: 50,
        y: 10
      },
      stroke: '#000',
      strokeThickness: 2,
    };

    return scene.add
      .text(x, y, text, style)
      .setOrigin(0, 1)
      .setInteractive({ useHandCursor: true });
  }
}