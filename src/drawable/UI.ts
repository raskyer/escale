import { GameObjects } from "phaser";

export default class UI {
  constructor(private readonly time: GameObjects.Text, private readonly cash: GameObjects.Text) { }

  setTime(time: string) {
    this.time.setText(time);
  }

  setCash(cash: number) {
    this.cash.setText(cash.toString());
  }
}
