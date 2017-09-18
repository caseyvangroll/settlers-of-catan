
const clearSelections = () => {
  resources.ids.forEach((id) => {
    resources[id].select(false);
  });
  vertices.ids.forEach((id) => {
    vertices[id].select(false);
  });
};

const clickResource = (resourceID) => {
  clearSelections();
  resources[resourceID].select(true);
  socket.emit('resource', resourceID);
  renderer.render(stage);
};

const clickVertex = (vertexID) => {
  clearSelections();
  vertices[vertexID].select(true);
  socket.emit('vertex', vertexID);
  renderer.render(stage);
};

const registerGameActions = () => {
  resources.ids.forEach((id) => {
    resources[id].setInteractive(true);
  });
  vertices.ids.forEach((id) => {
    vertices[id].setInteractive(true);
  });
};

socket.on('gamestate', (gamestate) => {
  Console(`game: ${JSON.stringify(gamestate)}`);
  loadGame(gamestate);
});
