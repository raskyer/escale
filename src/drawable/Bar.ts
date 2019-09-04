import { GameObjects } from "phaser";

export default class Bar {
  constructor(private readonly sprite: GameObjects.Shape) {}

  getX() {
    return this.sprite.x;
  }

  getY() {
    return this.sprite.y;
  }
}
