
const getCenter = () => new PIXI.Point(gameWidth / 2, gameHeight / 2);

const getSuggestedEdgeLength = () => {
  return (screenHeight > screenWidth) ? // indicates mobile
    (screenWidth / (5 * Math.sqrt(3))) * 1.5 :
    Math.min((screenWidth * 0.75) / (5 * Math.sqrt(3)), (screenHeight * 0.75) / 8);
};

// Maps all locations for resources/vertices based on edge-length of one side of hexagon
const mapLocs = (edgeLength) => {
  const center = getCenter();

  // Map resource locations
  const resourceYShift = Math.sqrt(3) * edgeLength;
  const resourceXShift = 1.5 * edgeLength;
  const currentLoc = new PIXI.Point(center.x - (2 * resourceXShift), center.y - resourceYShift); // Start at A
  let i = 0;
  [3, 4, 5, 4, 3].forEach((height) => {
    currentLoc.y = center.y - (((height - 1) / 2) * resourceYShift);

    for (let j = 0; j < height; j++) {
      resources[resources.ids[i++]].place(currentLoc.x, currentLoc.y);
      currentLoc.y += resourceYShift;
    }

    currentLoc.x += resourceXShift;
  });

  // Map vertex locations
  const vertexYShift = (Math.sqrt(3) * edgeLength) / 2;
  const vertexXShift = edgeLength / 2;
  i = 0;
  // The top resource of each trickle-down
  [{ resource: 'A', height: 7 },
   { resource: 'D', height: 9 },
   { resource: 'H', height: 11 },
   { resource: 'H', height: 11, backwards: true },
   { resource: 'M', height: 9, backwards: true },
   { resource: 'Q', height: 7, backwards: true }].forEach((config) => {
     const topResource = resources[config.resource].sprite;

    // Start at top resource
     if (config.backwards) {
       currentLoc.set(topResource.x + vertexXShift, topResource.y - vertexYShift);
     }
     else {
       currentLoc.set(topResource.x - vertexXShift, topResource.y - vertexYShift);
     }
     let xShiftSign = config.backwards ? 1 : -1;
     for (let j = 0; j < config.height; j++) {
       vertices[vertices.ids[i++]].place(currentLoc.x, currentLoc.y);
       currentLoc.y += vertexYShift;
       currentLoc.x += vertexXShift * xShiftSign;
       xShiftSign *= -1;
     }
   });
};

const dragBegin = (loc) => {
  clearSelections();
  renderer.render(stage);
  stage.prevLeft = parseInt(renderer.view.style.left.slice(0, -2));
  stage.prevTop = parseInt(renderer.view.style.top.slice(0, -2));
  stage.dragOrigin = { x: loc.data.originalEvent.clientX, y: loc.data.originalEvent.clientY };
};

const dragContinue = (loc) => {
  if (stage.dragOrigin) {
    let newLeft = Math.min(0, stage.prevLeft + (loc.data.originalEvent.clientX - stage.dragOrigin.x));
    let newTop = Math.min(0, stage.prevTop + (loc.data.originalEvent.clientY - stage.dragOrigin.y));
    newLeft = Math.max(newLeft, -parseInt(renderer.view.style.width.slice(0, -2)) / 2);
    newTop = Math.max(newTop, -parseInt(renderer.view.style.height.slice(0, -2)) / 2);
    renderer.view.style.left = `${newLeft}px`;
    renderer.view.style.top = `${newTop}px`;
  }
};

const dragEnd = () => { stage.dragOrigin = null; };

// Center the canvas on window
const center = () => {
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
