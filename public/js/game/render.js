
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
    resources[id].sprite = new PIXI.Sprite(PIXI.loader.resources['img/game-objects/resource.png'].texture);
    resources[id].setEdgeLength(edgeLength);
    stage.addChild(resources[id].sprite);
  });

  vertices.ids.forEach((id) => {
    vertices[id].sprite = new PIXI.Sprite(PIXI.loader.resources['img/game-objects/vertex.png'].texture);
    vertices[id].setEdgeLength(edgeLength);
    stage.addChild(vertices[id].sprite);
  });

  mapLocs(edgeLength);
  registerGameActions();
  stage.addChild(frontdrop);
  renderer.render(stage);
};

PIXI.loader
  .add('img/game-objects/resource.png')
  .add('img/game-objects/vertex.png');

const setState = (state) => {
  if (state === 'setup') {
    if (!mobile) {
      pause(true);
      $('div#non-colors').css('width', `${screenWidth * 0.49}px`);
      $('div#non-colors').css('height', `${screenHeight}px`);

      $('div#colors').css('min-width', `${screenWidth * 0.11}px`);
      $('div#colors').css('width', `calc((100% - ${screenWidth * 0.49}px)/2)`);
      $('div#colors').css('height', `${screenHeight * 0.74}px`);

      $('div#colors table').css('width', `${screenWidth * 0.1}px`);

      $('div#main-overlay').css('min-width', `${screenWidth * 0.72}px`);
      $('div#main-overlay').show();

      $('td.self div.name').append('Player 1');
      $('td.other div.name').each((index, other) => other.append(`Player ${index + 2}`));
    }
    else {
      // Don't bother adapting char selection screen for mobile
      pause(true);
      $('div#mobile-overlay').show();
    }
  }
  else {
    $('canvas').show();
    $('div#main-overlay').hide();
    $('div#mobile-overlay').hide();
    pause(false);
  }
};
