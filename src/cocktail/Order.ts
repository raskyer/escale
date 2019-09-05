import { GameObjects } from 'phaser';
import Orderable from './Orderable';
import { Consumer } from 'utils/Interfaces';

export default class Order<T extends Orderable> {
  private inProgress: boolean = false;
  private onProgressListeners: Consumer<Order<T>>[] = [];
  private onCancelListeners: Consumer<Order<T>>[] = [];

  constructor(private readonly sprite: GameObjects.Text) {
    this.sprite.addListener('pointerdown', () => {
      this.inProgress = true;
      this.onProgressListeners.forEach(l => l(this));
    });
  }

  addOnProgressListener(listener: Consumer<Order<T>>) {
    this.onProgressListeners.push(listener);
  }

  addOnCancelListener(listener: Consumer<Order<T>>) {
    this.onCancelListeners.push(listener);
  }

  isInProgress() {
    return this.inProgress;
  }

  cancel() {
    this.onCancelListeners.forEach(l => l(this));
  }

  destroy() {
    this.sprite.destroy();
  }
}
