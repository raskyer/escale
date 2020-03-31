import { GameObjects, Scene } from 'phaser';

import { Consumer } from 'utils/Interfaces';

import Character from 'characters/Character';
import Cocktail from 'cocktails/Cocktail';
import Consumable from 'cocktails/Consumable';
import Text from 'drawables/Text';

export default class Order {
  private inProgress: boolean = false;
  private readonly onProgressListeners: Consumer<Order>[] = [];
  private readonly onCancelListeners: Consumer<Order>[] = [];

  private constructor(
    private readonly sprite: GameObjects.Text,
    private readonly cocktail: Cocktail,
    private readonly owner: Character
  ) {
    this.sprite.addListener('pointerdown', () => {
      this.inProgress = true;
      this.onProgressListeners.forEach(l => l(this));
    });
  }

  static build(scene: Scene, client: Character): Order {
    const x = client.x;
    const y = client.y - client.displayHeight;
    const cocktail = Cocktail.buildRandom();
    const text = Text.build(scene, x, y, cocktail.getType());

    scene.add.tween({
      targets: text,
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      duration: 500
    });

    const order = new Order(text, cocktail, client);

    order.addOnCancelListener(_ => {
      scene.add.tween({
        targets: text,
        alpha: { from: 1, to: 0 },
        ease: 'Linear',
        duration: 200,
        onComplete: () => {
          order.destroy();
        }
      });
    });

    return order;
  }

  addOnProgressListener(listener: Consumer<Order>) {
    this.onProgressListeners.push(listener);
  }

  addOnCancelListener(listener: Consumer<Order>) {
    this.onCancelListeners.push(listener);
  }

  check(recipe: Map<Consumable, integer>): integer {
    return 100;
  }

  isInProgress() {
    return this.inProgress;
  }

  getOwner() {
    return this.owner;
  }

  cancel() {
    this.onCancelListeners.forEach(l => l(this));
  }

  destroy() {
    this.sprite.destroy();
  }
}
