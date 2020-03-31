import { GameObjects, Scene, Types } from 'phaser';
import Settings from 'utils/Settings';

export default class UI {
  private cashValue: integer = 0;

  private constructor(private readonly time: GameObjects.Text, private readonly cash: GameObjects.Text) {}

  static build(scene: Scene, settings: Settings): UI {
    const style: Types.GameObjects.Text.TextStyle = {
      fontSize: '20px',
      fontStyle: 'bold'
    };

    const time = scene.add.text(settings.width - 5, 10, '00:00', style).setOrigin(1, 0);
    const cash = scene.add.text(settings.width - 5, 30, '0$', style).setOrigin(1, 0);

    return new UI(time, cash);
  }

  setTime(time: string) {
    this.time.setText(time);
  }

  addCash(cash: integer) {
    this.cashValue += cash;
    this.cash.setText(this.cashValue.toString() + '$');
  }
}
