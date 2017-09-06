
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

socket.on('highlight vertex', (ids) => {
  ids.forEach((id) => {
    vertices[id].highlight(true);
  });
  renderer.render(stage);
});

socket.on('highlight resource', (ids) => {
  ids.forEach((id) => {
    resources[id].highlight(true);
  });
  renderer.render(stage);
});
