"use strict";

$(function () {
  var socket = io();;
  socket.emit('bind user', document.cookie);;
  $("div.chat-messages")[0].scrollTop = $("div.chat-messages")[0].scrollHeight;

  // Send Message
  $('form.chat-form').submit(function () {
    socket.emit('submit message', $('input.chat-form').val());
    $('input.chat-form').val('');
    return false;
  });

  // Add received messages to the chat (and scroll to see them)
  socket.on('broadcast message', function (nickname, msg) {
    $('#messages').append('<li><b>' + nickname + '</b>: ' + msg + '</li>');
    $("div.chat-messages").animate({ scrollTop: $("div.chat-messages")[0].scrollHeight }, "fast");
  });
});
