import { GameObjects } from 'phaser';
import Orderable from './Orderable';

export default class Order<T extends Orderable> {
  private sprite: GameObjects.Shape;
  private text: GameObjects.Text;
  private inProgress: boolean;

  constructor(sprite: GameObjects.Shape, text: GameObjects.Text) {
    this.sprite = sprite;
    this.text = text;
    this.inProgress = false;
  }

  setInProgress(inProgress: boolean) {
    this.inProgress = inProgress;
  }

  isInProgress() {
    return this.inProgress;
  }

  cancel() {
    this.sprite.destroy();
    this.text.destroy();
  }
}
