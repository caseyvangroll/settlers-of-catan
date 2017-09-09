
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
renderer.backgroundColor = 0Xc4daff;
const stage = new PIXI.Container();

// Make backdrop - used for dragging to entire canvas
const backdrop = new PIXI.Container();
backdrop.interactive = true;
backdrop.hitArea = new PIXI.Rectangle(0, 0, gameWidth, gameHeight);
backdrop.on('pointerdown', dragBegin);
backdrop.on('pointermove', dragContinue);
backdrop.on('pointerup', dragEnd);
backdrop.on('pointerout', dragEnd);


// Make frontdrop - used for masking to disable interacting with game
const frontdrop = new PIXI.Container();
frontdrop.interactive = true;
frontdrop.hitArea = new PIXI.Rectangle(0, 0, gameWidth, gameHeight);

// Make ticker for smooth visual transition to paused state
const pauseTicker = new PIXI.ticker.Ticker();
pauseTicker.autoStart = false;

const blurFilter = new PIXI.filters.BlurFilter();
blurFilter.blur = 5;
const MAX_BLUR = 5;
let deltaBlur = 1;


pauseTicker.add(() => {
  blurFilter.blur += deltaBlur;
  renderer.render(stage);

  if (blurFilter.blur >= MAX_BLUR) {
    frontdrop.interactive = true;
    pauseTicker.stop();
  }
  else if (blurFilter.blur <= 0) {
    frontdrop.interactive = false;
    blurFilter.blur = 0;
    pauseTicker.stop();
  }
});

stage.filters = [blurFilter];

frontdrop.on('pointerdown', () => {
  deltaBlur *= -1;
  pauseTicker.start();
});


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
    resources[id].setSprite(new PIXI.Sprite(PIXI.loader.resources['img/resource.png'].texture));
    resources[id].setEdgeLength(edgeLength);
    stage.addChild(resources[id].sprite);
  });

  vertices.ids.forEach((id) => {
    vertices[id].setSprite(new PIXI.Sprite(PIXI.loader.resources['img/vertex.png'].texture));
    vertices[id].setEdgeLength(edgeLength);
    stage.addChild(vertices[id].sprite);

    stage.addChild(frontdrop);
  });

  mapLocs(edgeLength);
  renderer.render(stage);
};

PIXI.loader
  .add('img/resource.png')
  .add('img/vertex.png')
  .load(setup);
