const loadGame = (gamestate) => {
  game = JSON.parse(gamestate);
  resources = game.resources;
  vertices = game.vertices;

  extendResources();
  extendVertices();
  PIXI.loader.load(setup);

  //////// TO BE REMOVED ////////
  setState(game.state);

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
  ///////////////////////////////////
};
