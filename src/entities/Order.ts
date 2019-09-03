import { Scene, GameObjects } from 'phaser';
import Character from "./Character";
import Orderable from './Orderable';

export default class Order<T extends Orderable> {
  private sprite: GameObjects.Shape;
  private text: GameObjects.Text;
  private owner: Character;

  constructor(scene: Scene, owner: Character, x: integer, y: integer) {
    this.sprite = scene.add.rectangle(x, y, 100, 20, 0xFFFFFF, 1).setOrigin(0,1);
    this.sprite.setInteractive({ useHandCursor : true });
    this.sprite.addListener('pointerdown', () => {
      console.log(this);
    })
    this.owner = owner;

    this.text = scene.add.text(x + 25, y - 2, 'Mojito', { 
      color: '#00FF00',
      fontSize: 14
    }).setOrigin(0, 1);
  }

  cancel() {
    this.sprite.destroy();
    this.text.destroy();
  }
}
