
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

socket.on('mode', (mode) => {
  if (loud) { console.log(`mode ${mode}`); }
  if (mode === 'player') {
    registerGameActions();

    socket.on('highlight vertex', (ids) => {
      if (loud) { console.log(`highlight vertex ${ids}`); }
      ids.forEach((id) => {
        vertices[id].highlight(true);
      });
      renderer.render(stage);
    });
    
    socket.on('highlight resource', (ids) => {
      if (loud) { console.log(`highlight resource ${ids}`); }
      ids.forEach((id) => {
        resources[id].highlight(true);
      });
      renderer.render(stage);
    });
  }
});

socket.on('state', (state, json) => {
  if (loud) { console.log(`state ${state}, ${json}`); }
  setState(state, json);
});
