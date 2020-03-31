import { Scene, GameObjects } from 'phaser';

import Settings from 'utils/Settings';

export default class Background {
  static build(scene: Scene, settings: Settings): GameObjects.Image {
    return scene.add
      .image(-220, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(settings.width + 250, settings.height + 50);
  }
}
