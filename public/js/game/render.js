/* eslint-disable no-undef, one-var, no-multiple-empty-lines, no-plusplus, radix */

let renderer;
let stage;

const game = new Game();

const init = () => {
  const canvas = $('canvas')[0];
  renderer = PIXI.autoDetectRenderer(screen.width * 2, screen.height * 2, { view: canvas }, false);
  stage = new PIXI.Container();

  // Set up canvas css-driven dragging
  canvas.onmousedown = dragBegin;
  canvas.onmousemove = dragContinue;
  canvas.onmouseup = dragEnd;
  canvas.onmouseout = dragEnd;
};

const setup = () => {
  const edgeLength = getSuggestedEdgeLength();

  game.resources.forEach((resource) => {
    resource.sprite = new PIXI.Sprite(PIXI.loader.resources['img/resource.png'].texture);
    resource.setEdgeLength(edgeLength);
  });

  mapLocs(game.resources, getCenter(), edgeLength);
  game.resources.forEach((resource) => {
    resource.highlight(false);
    stage.addChild(resource.sprite);
  });
  renderer.render(stage);
};

PIXI.loader.add('img/resource.png')
  .on('progress', (loader, resource) => { console.log(`Loading ${resource.url} [${loader.progress}%]`); })
  .load(setup);

$(() => {
  init();

  // Canvas twice as large as screen
  renderer.view.style.width = `${screen.width * 2}px`;
  renderer.view.style.height = `${screen.height * 2}px`;

  // Center with absolute positioning
  center();

  window.size = { x: window.innerWidth, y: window.innerHeight };
  window.onresize = resize;

  renderer.render(stage);
});



