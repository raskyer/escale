import { GameObjects, Scene, Physics, Geom } from 'phaser';

export default class GlassTest {
  static build(scene: Scene) {
    const bottomLine = scene.add.rectangle(0, 45, 100, 10, 0xff0000);

    scene.physics.add.existing(bottomLine);
    const body = bottomLine.body as Physics.Arcade.Body;
    body.allowGravity = false;
    body.immovable = true;
    //body.moves = false;

    const container = scene.add.container(50, 50, [bottomLine]);
    container.setSize(100, 100);
    console.log(container);

    container.setInteractive();
    scene.input.setDraggable(container);

    container.on('drag', (_: any, x: number, y: number) => {
      container.x = x;
      container.y = y;
    });

    scene.input.enableDebug(container);

    /*scene.physics.add.existing(container);
    (container.body as Physics.Arcade.Body).allowGravity = false;
    (container.body as Physics.Arcade.Body).immovable = true;*/

    return container;
  }
}
