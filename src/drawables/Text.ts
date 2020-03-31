import { Scene, Types, GameObjects } from 'phaser';

export default class Text {
  private static readonly STYLE: Types.GameObjects.Text.TextStyle = {
    color: '#00FF00',
    fontFamily: 'Arial Black',
    fontSize: '20px',
    fontStyle: 'bold',
    backgroundColor: '#FFFFFF',
    padding: {
      x: 50,
      y: 10
    },
    stroke: '#000',
    strokeThickness: 2
  };

  static build(scene: Scene, x: integer, y: integer, text: string): GameObjects.Text {
    return scene.add
      .text(x, y, text, Text.STYLE)
      .setOrigin(0, 1)
      .setInteractive({ useHandCursor: true });
  }
}
