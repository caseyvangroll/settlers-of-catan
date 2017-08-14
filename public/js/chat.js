/* eslint-disable */
$('#chat').submit(() => {
  socket.emit('submit message', $('#messageInput').val());
  $('#messageInput').val('');
  return false;
});
socket.on('broadcast message', (msg) => {
  $('#messages').append($('<li>').text(msg));
  window.scrollTo(0, document.body.scrollHeight);
});
