/* eslint-disable */

$("div.chat-messages")[0].scrollTop = $("div.chat-messages")[0].scrollHeight;

// Send Message
$('form.chat-form').submit(function () {
  socket.emit('submit message', $('input.chat-form').val());
  $('input.chat-form').val('');
  return false;
});

// Add received messages to the chat (and scroll to see)
socket.on('broadcast message', function (nickname, msg) {
  $('#messages').append('<li><b>' + nickname + '</b>: ' + msg + '</li>');
  $("div.chat-messages").animate({ scrollTop: $("div.chat-messages")[0].scrollHeight}, "fast");
});

// Add join notifications to the chat (and scroll to see)
  socket.on('join', function (nickname, color, msg) {
    $('#messages').append('<li><b>' + nickname + '</b>: ' + msg + '</li>');
    $("div.chat-messages").animate({ scrollTop: $("div.chat-messages")[0].scrollHeight }, "fast");
  });