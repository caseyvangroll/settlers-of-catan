"use strict";

$(function () {
  var socket = io();;
  socket.emit("bind user", document.cookie);;
  $("form.chat-form").submit(function () {
    return socket.emit("submit message", $("input.chat-form").val()), $("input.chat-form").val(""), !1;
  }), socket.on("broadcast message", function (nickname, msg) {
    $("#messages").append("<li><b>" + nickname + "</b>: " + msg + "</li>"), $("div.chat-messages ul").animate({ scrollTop: $("div.chat-messages ul")[0].scrollHeight }, "fast");
  });
});
