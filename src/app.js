import * as PIXI from 'pixi.js';
import Character from './character';

const loader = new PIXI.Loader();
const app = new PIXI.Application({
  width: document.body.clientWidth,
  height: window.innerHeight / 2
});

function composeFrame(path, length) {
  const frames = [];
  for (let i = 0; i < length; i++) {
    frames.push(path + '/frame' + i + '.png');
  }
  return frames;
}

function composeAnimation(idle, run) {
  return {
    idle: frameToTexture(idle),
    run: frameToTexture(run)
  };
}

function frameToTexture(frames) {
  return frames.map(frame => PIXI.Texture.from(frame));
}

const clientIdle = composeFrame('assets/client/idle', 7);
const clientRun = composeFrame('assets/client/run', 7);
const barmaidIdle = composeFrame('assets/barmaid/idle', 7);
const barmaidRun = composeFrame('assets/barmaid/run', 7);

loader
  .add([
    ...clientIdle,
    ...clientRun,
    ...barmaidIdle,
    ...barmaidRun   
  ])
  .load(setup);

function setup() {
  const gameScene = new PIXI.Container();
  app.stage.addChild(gameScene);

  const floor = createFloor(app);
  gameScene.addChild(floor);

  const border = createBorder(app);
  gameScene.addChild(border);

  const barmaid = new Character(
    composeAnimation(barmaidIdle, barmaidRun),
    app.screen.width / 2 + 20,
    app.screen.height - 50, 4
  );
  barmaid.turnLeft();
  gameScene.addChild(barmaid);

  const bar = createBar(app);
  gameScene.addChild(bar);

  const client = new Character(
    composeAnimation(clientIdle, clientRun),
    0,
    app.screen.height - 50, 4
  );
  client.moveTo(app.screen.width / 2 - 110, client => {
    gameScene.addChild(client.order());
  });
  gameScene.addChild(client);

  app.ticker.add(delta => {
    client.tick(delta);
    barmaid.tick(delta);
  });
}

function createFloor(app) {
  const graphics = new PIXI.Graphics();

  graphics.beginFill(0x101010);
  graphics.drawRect(0, app.screen.height - 50, app.screen.width, 50);
  graphics.endFill();

  return graphics;
}

function createBorder(app) {
  const graphics = new PIXI.Graphics();

  graphics.lineStyle(5, 0xFF0000, 1);
  graphics.drawRect(0, 0, app.screen.width, app.screen.height);

  return graphics;
}

function createBar(app) {
  const graphics = new PIXI.Graphics();

  const floor = app.screen.height - 50;

  graphics.lineStyle(2, 0xFFFFFF, 1);
  graphics.beginFill(0x00DD00);
  graphics.drawRect(app.screen.width / 2, floor - 40, 400, 40);
  graphics.endFill();

  return graphics;
}

document.body.appendChild(app.view);
