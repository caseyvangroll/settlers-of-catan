'use strict';

$(function () {
  var socket = io();;
  socket.emit('bind user', document.cookie);;
  // Send Message
  $('form.chat-form').submit(function () {
    socket.emit('submit message', $('input.chat-form').val());
    $('input.chat-form').val('');
    return false;
  });

  // Add received messages to the chat (and scroll to see them)
  socket.on('broadcast message', function (nickname, msg) {
    $('#messages').prepend('<li><b>' + nickname + '</b>: ' + msg + '</li>');
    $("div.chat-messages ul").animate({ scrollTop: 0 }, "fast");
  });
});
