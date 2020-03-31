import { Scene, GameObjects } from 'phaser';
import Settings from 'utils/Settings';

export default class Bar {
  static build(scene: Scene, settings: Settings): GameObjects.Rectangle {
    return scene.add
      .rectangle(settings.middle, settings.floor, settings.barWidth, settings.barHeight, settings.barColor)
      .setOrigin(0, 1);
  }
}
