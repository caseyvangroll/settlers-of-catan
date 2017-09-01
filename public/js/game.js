/* eslint-disable no-undef */

// Create the renderer
const renderer = PIXI.autoDetectRenderer(256, 256);

// Add the canvas to the HTML document
document.body.appendChild(renderer.view);

// Create a container object called the `stage`
const stage = new PIXI.Container();

// Canvas takes up full window
renderer.view.style.position = 'absolute';
renderer.view.style.display = 'block';
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

// Styling
renderer.backgroundColor = '0xc0d8d4';

// Setup (Load sprites and render)
const setup = () => {
  const flyingCat = new PIXI.Sprite(
    PIXI.loader.resources['img/flying-cat.png'].texture,
  );
  stage.addChild(flyingCat);
  renderer.render(stage);
};


// Loader
PIXI.loader
  .add('img/flying-cat.png')
  .load(setup);
