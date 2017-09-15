
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
// renderer.backgroundColor = 0Xc4daff;
const stage = new PIXI.Container();

// Make backdrop - used for dragging to entire canvas

const backdrop = new PIXI.Graphics().beginFill(0Xc4daff).drawRect(0, 0, gameWidth, gameHeight).endFill();
backdrop.interactive = true;
backdrop.hitArea = new PIXI.Rectangle(0, 0, gameWidth, gameHeight);
backdrop.on('pointerdown', dragBegin);
backdrop.on('pointermove', dragContinue);
backdrop.on('pointerup', dragEnd);
backdrop.on('pointerout', dragEnd);


// Make frontdrop - used for masking to disable interacting with game
const frontdrop = new PIXI.Container();
frontdrop.hitArea = new PIXI.Rectangle(0, 0, gameWidth, gameHeight);

// Make paused-state filter
const pauseFilter = new PIXI.filters.ColorMatrixFilter();
pauseFilter.desaturate();

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

const setup = () => {
  stage.addChild(backdrop);

  const edgeLength = getSuggestedEdgeLength();

  resources.ids.forEach((id) => {
    resources[id].sprite = new PIXI.Sprite(PIXI.loader.resources['img/resource.png'].texture);
    resources[id].setEdgeLength(edgeLength);
    stage.addChild(resources[id].sprite);
  });

  vertices.ids.forEach((id) => {
    vertices[id].sprite = new PIXI.Sprite(PIXI.loader.resources['img/vertex.png'].texture);
    vertices[id].setEdgeLength(edgeLength);
    stage.addChild(vertices[id].sprite);
  });

  mapLocs(edgeLength);
  stage.addChild(frontdrop);
  renderer.render(stage);
  socket.emit('ready');
};

PIXI.loader
  .add('img/resource.png')
  .add('img/vertex.png')
  .add('img/displacementMap.jpg')
  .load(setup);
