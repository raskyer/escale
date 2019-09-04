import { Scene } from "phaser";
import Character from "character/Character";
import Order from "./Order";

export default class OrderFactory {
    static createOrderFor(scene: Scene, client: Character) {
        const x = client.getX();
        const y = client.getY() - client.getHeight();
        const width = 100;
        const height = 20;
        const color = 0xFFFFFF;

        const sprite = scene.add.rectangle(x, y, width, height, color, 1).setOrigin(0, 1);
        sprite.setInteractive({ useHandCursor : true });
        
        const text = scene.add.text(x + 25, y - 2, 'Mojito', { 
            color: '#00FF00',
            fontSize: 14
        }).setOrigin(0, 1);

        const order = new Order(sprite, text);

        sprite.addListener('pointerdown', () => {
            order.setInProgress(true);
        });

        return order;
    }
}
