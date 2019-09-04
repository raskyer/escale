import { GameObjects } from 'phaser';
import Orderable from './Orderable';
import { Consumer } from 'utils/Interfaces';

export default class Order<T extends Orderable> {
  private inProgress: boolean = false;
  private onProgressListeners: Consumer<Order<T>>[] = [];

  constructor(private readonly sprite: GameObjects.Shape, private readonly text: GameObjects.Text) {
    this.sprite.addListener('pointerdown', () => {
      this.inProgress = true;
      this.onProgressListeners.forEach(l => l(this));
    });
  }

  addOnProgressListener(listener: Consumer<Order<T>>) {
    this.onProgressListeners.push(listener);
  }

  isInProgress() {
    return this.inProgress;
  }

  cancel() {
    this.sprite.destroy();
    this.text.destroy();
  }
}
