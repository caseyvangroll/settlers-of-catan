'use strict';

$(function () {
  var socket = io();;
  socket.emit('bind user', document.cookie);;
  $('div.chat-messages')[0].scrollTop = $('div.chat-messages')[0].scrollHeight;

  var hidden = false;
  $("div.chat-handle").click(function () {
    if (hidden) {
      $("div.chat-overlay").animate({ 'right': '-292px' }, 400);
    } else {
      $("div.chat-overlay").animate({ 'right': '0' }, 400);
    }
    hidden = !hidden;
  });

  // Send Message
  $('form.chat-form').submit(function () {
    socket.emit('submit message', $('input.chat-form').val());
    $('input.chat-form').val('');
    return false;
  });

  // Add received messages to the chat (and scroll to see)
  socket.on('broadcast message', function (nickname, hexColor, msg) {
    $('#messages').append('<li style="color:' + hexColor + '"><b>' + nickname + '</b>: ' + msg + '</li>');
    $("div.chat-messages").animate({ scrollTop: $("div.chat-messages")[0].scrollHeight }, "fast");
  });

  // Add join notifications to the chat (and scroll to see)
  socket.on('chat action', function (nickname, action) {
    $('#messages').append('<li class="join-message"><center>' + nickname + ' has ' + action + '</center></li>');
    $("div.chat-messages").animate({ scrollTop: $("div.chat-messages")[0].scrollHeight }, "fast");
  });
});
