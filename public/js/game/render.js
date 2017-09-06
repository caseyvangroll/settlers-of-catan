/* eslint-disable no-undef, one-var, no-multiple-empty-lines, no-plusplus, radix */

// Canvas/Screen/Window Sizing
const ratio = window.devicePixelRatio || 1;
const screenWidth = screen.width * ratio;
const screenHeight = screen.height * ratio;
const windowWidth = () => window.innerWidth * ratio;
const windowHeight = () => window.innerHeight * ratio;
const gameWidth = screenWidth * 2;
const gameHeight = screenHeight * 2;

// PIXI objects
const renderer = PIXI.autoDetectRenderer(gameWidth, gameHeight, { view: $('canvas')[0] }, false);
const stage = new PIXI.Container();
const backdrop = new PIXI.Container();
backdrop.interactive = true;
backdrop.hitArea = new PIXI.Rectangle(0, 0, gameWidth, gameHeight);
// Set up css-driven dragging
backdrop.on('pointerdown', dragBegin);
backdrop.on('pointermove', dragContinue);
backdrop.on('pointerup', dragEnd);
backdrop.on('pointerout', dragEnd);

// Game Objects
const game = new Game();
const resources = game.resources;
const vertices = game.vertices;

// Canvas twice as large as screen
renderer.view.style.width = `${gameWidth}px`;
renderer.view.style.height = `${gameHeight}px`;
window.size = { x: window.innerWidth, y: window.innerHeight };
window.onresize = resize;
center();


// renderer.view.onpointerdown = dragBegin;
// renderer.view.onpointermove = dragContinue;
// renderer.view.onpointerup = dragEnd;
// renderer.view.onpointerout = dragEnd;

const setup = () => {
  stage.addChild(backdrop);
  const edgeLength = getSuggestedEdgeLength();

  resources.ids.forEach((id) => {
    resources[id].setSprite(new PIXI.Sprite(PIXI.loader.resources['img/resource.png'].texture));
    resources[id].setEdgeLength(edgeLength);
    stage.addChild(resources[id].sprite);
  });

  vertices.ids.forEach((id) => {
    vertices[id].setSprite(new PIXI.Sprite(PIXI.loader.resources['img/vertex.png'].texture));
    vertices[id].setEdgeLength(edgeLength);
    stage.addChild(vertices[id].sprite);
  });

  mapLocs(edgeLength);
  renderer.render(stage);
};

PIXI.loader
  .add('img/resource.png')
  .add('img/vertex.png')
  .load(setup);
