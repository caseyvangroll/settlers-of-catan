/* eslint-disable no-undef, one-var, no-multiple-empty-lines, no-plusplus, radix */

const ratio = window.devicePixelRatio || 1;
const screenWidth = screen.width * ratio;
const screenHeight = screen.height * ratio;
const windowWidth = () => window.innerWidth * ratio;
const windowHeight = () => window.innerHeight * ratio;
const gameWidth = screenWidth * 2;
const gameHeight = screenHeight * 2;

const renderer = PIXI.autoDetectRenderer(gameWidth, gameHeight, { view: $('canvas')[0] }, false);
const stage = new PIXI.Container();

const game = new Game();
const resources = game.resources;

// Canvas twice as large as screen
renderer.view.style.width = `${gameWidth}px`;
renderer.view.style.height = `${gameHeight}px`;

// Set up canvas css-driven dragging
renderer.view.onpointerdown = dragBegin;
renderer.view.onpointermove = dragContinue;
renderer.view.onpointerup = dragEnd;
renderer.view.onpointerout = dragEnd;

// Center with absolute positioning
center();

window.size = { x: window.innerWidth, y: window.innerHeight };
window.onresize = resize;

const setup = () => {
  const edgeLength = getSuggestedEdgeLength();

  resources.ids.forEach((id) => {
    resources[id].setSprite(new PIXI.Sprite(PIXI.loader.resources['img/resource.png'].texture));
    resources[id].setEdgeLength(edgeLength);
    stage.addChild(resources[id].sprite);
  });

  mapLocs(edgeLength);
  renderer.render(stage);
};

PIXI.loader.add('img/resource.png')
  .on('progress', (loader, resource) => { console.log(`Loading ${resource.url} [${loader.progress}%]`); })
  .load(setup);
