import { Scene, GameObjects } from 'phaser';
import Settings from 'utils/Settings';

export default class Floor {
  static build(scene: Scene, settings: Settings): GameObjects.Rectangle {
    return scene.add
      .rectangle(settings.entrance, settings.floor, settings.width, settings.height, settings.floorColor, 1)
      .setOrigin(0, 0);
  }
}
