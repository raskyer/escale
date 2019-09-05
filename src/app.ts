import * as Phaser from 'phaser';
import MainScene from './scenes/MainScene';

import * as DragRotatePlugin from './plugin';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: document.body.clientWidth,
  height: window.innerHeight / 2,
  title: 'Escale',
  version: '0.1',
  render: {
    pixelArt: true
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
  },
  plugins: {
    global: [{
        key: 'rexDragRotate',
        plugin: DragRotatePlugin,
        start: true
    }]
  },
  scene: [MainScene]
}

const game = new Phaser.Game(config);
