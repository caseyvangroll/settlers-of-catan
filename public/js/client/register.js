/* eslint-disable */
const socket = io();
socket.emit('bind user', document.cookie);