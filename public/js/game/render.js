/* eslint-disable no-undef, one-var, no-multiple-empty-lines, no-plusplus, radix */

const renderer = PIXI.autoDetectRenderer(screen.width * 2, screen.height * 2, { view: $('canvas')[0] }, false);
const stage = new PIXI.Container();

const game = new Game();
const resources = game.resources;

// Canvas twice as large as screen
renderer.view.style.width = `${screen.width * 2}px`;
renderer.view.style.height = `${screen.height * 2}px`;

// Set up canvas css-driven dragging
renderer.view.onmousedown = dragBegin;
renderer.view.onmousemove = dragContinue;
renderer.view.onmouseup = dragEnd;
renderer.view.onmouseout = dragEnd;

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
