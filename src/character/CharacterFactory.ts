import { Scene, GameObjects } from 'phaser';
import Character from './Character';
import Key from './Key';
import Direction from './Direction';
import State from './State';
import OrderFactory from 'cocktail/OrderFactory';

export default class CharacterFactory {
  private scene: Scene;

  private entrance: integer;
  private bar: integer;
  private floor: integer;

  constructor(scene: Scene, entrance: integer, bar: integer, floor: integer) {
    this.scene = scene;
    this.entrance = entrance;
    this.bar = bar;
    this.floor = floor;
  }

  createBarmaid(): Character {
    const sprite = this.createSprite(Key.Barmaid, this.bar + 30);
    const barmaid = new Character(sprite, Key.Barmaid, 'barmaid');
    barmaid.turn(Direction.Left);
    return barmaid;
  }

  createClient(id: string): Character {
    const sprite = this.createSprite(Key.Client1, this.entrance);
    return new Character(sprite, Key.Client1, id);
  }

  async applyOrderRoutine(client: Character) {
    await client.moveTo(this.bar, this.floor);
    const order = OrderFactory.createOrderFor(this.scene, client);
    const tolerance = Phaser.Math.RND.integerInRange(3000, 6000);

    return await new Promise(resolve => {
      this.scene.time.delayedCall(tolerance, async () => {
        if (order.isInProgress()) {
          return resolve({ inProgress: true, client });
        }
        order.cancel();
        await client.moveTo(this.entrance, this.floor);
        client.destroy();
        resolve({ inProgress: false, client });
      }, [], this);
    });
  }

  private createSprite(key: Key, x: integer): GameObjects.Sprite {
    const sprite = this.scene.add.sprite(x, this.floor, key + '.' + State.Idle);
    sprite.setOrigin(0, 1);
    return sprite;
  }
}
