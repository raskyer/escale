import { Scene, Types } from "phaser";
import Character from "character/Character";
import Order from "./Order";

export default class OrderFactory {
  static createOrderFor(scene: Scene, client: Character) {
    const x = client.getX();
    const y = client.getY() - client.getHeight();

    const style: Types.GameObjects.Text.TextStyle = {
      color: '#00FF00',
      fontFamily: "Arial Black",
      fontSize: '20px',
      fontStyle: 'bold',
      backgroundColor: '#FFFFFF',
      padding: {
        x: 50,
        y: 10
      },
      stroke: '#000',
      strokeThickness: 2,
    }

    const text = scene.add.text(x, y, 'Mojito', style)
      .setOrigin(0, 1)
      .setInteractive({ useHandCursor: true });

    scene.add.tween({
      targets: text,
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      duration: 500
    });

    const order = new Order(text);

    order.addOnCancelListener(l => {
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
}
