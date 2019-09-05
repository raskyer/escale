import { Scene, Types } from "phaser";
import Bar from "./Bar";
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
    this.scene.add
      .image(-220, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(this.settings.width + 250, this.settings.height + 50);
  }

  createFloor() {
    this.scene.add.rectangle(
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
    const sprite = this.scene.add
      .rectangle(
        this.settings.middle,
        this.settings.floor, 
        this.settings.barWidth,
        this.settings.barHeight,
        this.settings.barColor
      )
      .setOrigin(0,1);

    return new Bar(sprite);
  }

  createUI() {
    const style: Types.GameObjects.Text.TextStyle = {
      fontSize: '20px',
      fontStyle: 'bold'
    };

    const time = this.scene.add
      .text(this.settings.width - 66, 10, '00:00', style)
      .setOrigin(0,0);
    
    const cash = this.scene.add
      .text(this.settings.width - 30, 30, '0$', style)
      .setOrigin(0,0);
    
    return new UI(time, cash);
  }
}