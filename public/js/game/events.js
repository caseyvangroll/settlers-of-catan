
const clickResource = (resourceID) => {
  resources.ids.forEach((id) => {
    resources[id].highlight(id === resourceID);
  });
  socket.emit('resource', resourceID);
  renderer.render(stage);
};