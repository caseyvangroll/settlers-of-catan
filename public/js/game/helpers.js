/* eslint-disable no-undef, one-var, no-multiple-empty-lines, no-plusplus, no-unused-vars */

const getCenter = () => new PIXI.Point(gameWidth / 2, gameHeight / 2);

const getSuggestedEdgeLength = () => {
  return (screenHeight > screenWidth) ? // indicates mobile
    (screenWidth / (5 * Math.sqrt(3))) * 1.5 :
    Math.min((screenWidth * 0.75) / (5 * Math.sqrt(3)), (screenHeight * 0.75) / 8);
};

const mapLocs = (edgeLength) => {
  const center = getCenter();
  const vertShift = Math.sqrt(3) * edgeLength;
  const horShift = 1.5 * edgeLength;
  // Start at A
  const currentLoc = new PIXI.Point(center.x - (2 * horShift), center.y - vertShift);
  let i = 0;
  [3, 4, 5, 4, 3].forEach((height) => {
    currentLoc.y = center.y - (((height - 1) / 2) * vertShift);

    for (let j = 0; j < height; j++) {
      resources[resources.ids[i++]].place(currentLoc.x, currentLoc.y);
      currentLoc.y += vertShift;
    }

    currentLoc.x += horShift;
  });
};

const dragBegin = (loc) => {
  stage.prevLeft = parseInt(renderer.view.style.left.slice(0, -2));
  stage.prevTop = parseInt(renderer.view.style.top.slice(0, -2));
  stage.dragOrigin = { x: loc.screenX, y: loc.screenY };
};

const dragContinue = (loc) => {
  if (stage.dragOrigin) {
    let newLeft = Math.min(0, stage.prevLeft + (loc.screenX - stage.dragOrigin.x));
    let newTop = Math.min(0, stage.prevTop + (loc.screenY - stage.dragOrigin.y));
    newLeft = Math.max(newLeft, -parseInt(renderer.view.style.width.slice(0, -2)) / 2);
    newTop = Math.max(newTop, -parseInt(renderer.view.style.height.slice(0, -2)) / 2);
    renderer.view.style.left = `${newLeft}px`;
    renderer.view.style.top = `${newTop}px`;
  }
};

const dragEnd = () => { stage.dragOrigin = null; };

// Center the canvas on window
const center = () => {
  const newLeft = (gameWidth - windowWidth()) / 2;
  const newTop = (gameHeight - windowHeight()) / 2;
  renderer.view.style.left = `-${(gameWidth - windowWidth()) / 2}px`;
  renderer.view.style.top = `-${(gameHeight - windowHeight()) / 2}px`;
};

// Maintain focus on same area during resize
const resize = () => {
  const oldWidth = window.size.x;
  const oldHeight = window.size.y;
  window.size = { x: windowWidth(), y: windowHeight() };

  const deltaX = window.size.x - oldWidth;
  const deltaY = window.size.y - oldHeight;
  renderer.view.style.left = `${parseInt(renderer.view.style.left.slice(0, -2)) + (deltaX / 2)}px`;
  renderer.view.style.top = `${parseInt(renderer.view.style.top.slice(0, -2)) + (deltaY / 2)}px`;
};
