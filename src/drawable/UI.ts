import { GameObjects } from "phaser";

export default class UI {
  private cashValue: integer = 0;

  constructor(private readonly time: GameObjects.Text, private readonly cash: GameObjects.Text) { }

  setTime(time: string) {
    this.time.setText(time);
  }

  addCash(cash: integer) {
    this.cashValue += cash;
    this.cash.setText(this.cashValue.toString() + '$');
  }
}
