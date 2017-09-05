/* eslint-disable no-undef, one-var, no-multiple-empty-lines, no-plusplus, no-unused-vars */

const getCenter = () => new PIXI.Point(renderer.width / 2, renderer.height / 2);

const getSuggestedEdgeLength = () => Math.min((screen.width * 0.7) / (5 * Math.sqrt(3)), (screen.height * 0.7) / 8);

const mapLocs = (resources, center, edgeLength) => {
  const vertShift = Math.sqrt(3) * edgeLength;
  const horShift = 1.5 * edgeLength;
  // Start at A
  const currentLoc = new PIXI.Point(center.x - (2 * horShift), center.y - vertShift);
  let i = 0;
  [3, 4, 5, 4, 3].forEach((height) => {
    currentLoc.y = center.y - (((height - 1) / 2) * vertShift);

    for (let j = 0; j < height; j++) {
      resources[i++].place(currentLoc.x, currentLoc.y);
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
