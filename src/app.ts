import * as Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: document.body.clientWidth,
  height: window.innerHeight / 2,
  title: 'Escale',
  version: '0.1',
  scene: [MainScene]
}

const game = new Phaser.Game(config);
