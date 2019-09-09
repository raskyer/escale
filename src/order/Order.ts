import { GameObjects, Scene } from 'phaser';
import { Consumer } from 'utils/Interfaces';
import Character from 'character/Character';
import Cocktail from 'cocktail/Cocktail';
import DrawableFactory from 'drawable/DrawableFactory';
import Consumable from 'cocktail/Consumable';

export default class Order {
  private inProgress: boolean = false;
  private onProgressListeners: Consumer<Order>[] = [];
  private onCancelListeners: Consumer<Order>[] = [];

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
    const x = client.getX();
    const y = client.getY() - client.getHeight();
    const cocktail = Cocktail.build();

    const text = DrawableFactory.createMsg(scene, x, y, '');

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
        alpha: { from: 1, to: 0},
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
