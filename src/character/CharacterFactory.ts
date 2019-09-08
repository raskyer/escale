import { Scene, GameObjects } from 'phaser';
import Character from './Character';
import Key from './Key';
import Direction from './Direction';
import State from './State';
import Settings from 'utils/Settings';

export default class CharacterFactory {
  constructor(private readonly scene: Scene, private readonly settings: Settings) {}

  createBarmaid(): Character {
    const sprite = this.createSprite(Key.Barmaid, this.settings.middle, this.settings.floor);
    sprite.setX(sprite.x + sprite.displayWidth);

    const barmaid = new Character(sprite, Key.Barmaid);
    barmaid.turn(Direction.Left);

    return barmaid;
  }

  createClient(): Character {
    const sprite = this.createSprite(Key.Client1, 0, this.settings.floor);
    return new Character(sprite, Key.Client1);
  }

  private createSprite(key: Key, x: integer, y: integer): GameObjects.Sprite {
    return this.scene.add
      .sprite(x, y, key + '.' + State.Idle)
      .setOrigin(0, 1)
      .setScale(3, 3);
  }
}
