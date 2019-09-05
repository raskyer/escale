import * as Phaser from 'phaser';

export default class CocktailScene extends Phaser.Scene {
  constructor() {
    super('cocktail');
  }

  preload() {
    console.log('cocktail preload');
  }

  create() {
    console.log('cocktail create');
    //this.add.rectangle(0, 0, 150, 200, 0xFFFFFF);
  }

  update() {

  }
}
