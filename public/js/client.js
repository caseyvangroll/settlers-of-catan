'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(function () {
  var socket = io();;
  socket.emit('bind user', document.cookie);
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
  });;

  var Game = function Game() {
    _classCallCheck(this, Game);

    this.resources = Array.apply(null, Array(19)).map(function (_, i) {
      return String.fromCharCode(65 + i);
    }) // A-S
    .reduce(function (acc, cur) {
      acc[cur] = new Resource(cur);return acc;
    }, {});
    this.resources.ids = Object.keys(this.resources);
    this.vertices = Array.apply(null, Array(54)).map(function (_, i) {
      return i + 1;
    }) // 1-54
    .reduce(function (acc, cur) {
      acc[cur] = new Vertex(cur);return acc;
    }, {});
    this.vertices.ids = Object.keys(this.vertices);
  };

  ;

  var Resource = function () {
    function Resource(id) {
      _classCallCheck(this, Resource);

      this.id = id;
    }

    _createClass(Resource, [{
      key: 'highlight',
      value: function highlight(toggle) {
        if (toggle) {
          this.sprite.tint = 0Xffc6c6;
        } else {
          this.sprite.tint = 0X00FFFFFF;
        }
      }
    }, {
      key: 'place',
      value: function place(x, y) {
        this.sprite.position.set(x, y);
      }
    }, {
      key: 'setEdgeLength',
      value: function setEdgeLength(edgeLength) {
        this.sprite.width = 2 * edgeLength;
        this.sprite.height = Math.sqrt(3) * edgeLength;
        this.sprite.anchor.set(0.5);
        // Redefine hit area - i don't understand why all of this needs to be double what i calculated
        this.sprite.hitArea = new PIXI.Polygon([-edgeLength * 2, 0, -edgeLength, -edgeLength * Math.sqrt(3), edgeLength, -edgeLength * Math.sqrt(3), edgeLength * 2, 0, edgeLength, edgeLength * Math.sqrt(3), -edgeLength, edgeLength * Math.sqrt(3)]);
      }
    }, {
      key: 'setSprite',
      value: function setSprite(sprite) {
        var _this = this;

        this.sprite = sprite;
        this.sprite.interactive = true;
        this.sprite.on('mousedown', function () {
          clickResource(_this.id);
        });
      }
    }]);

    return Resource;
  }();

  ;

  var Vertex = function Vertex(id) {
    _classCallCheck(this, Vertex);

    this.id = id;
  };

  ;
  var getCenter = function getCenter() {
    return new PIXI.Point(renderer.width / 2, renderer.height / 2);
  };

  var getSuggestedEdgeLength = function getSuggestedEdgeLength() {
    return Math.min(screen.width * 0.7 / (5 * Math.sqrt(3)), screen.height * 0.7 / 8);
  };

  var mapLocs = function mapLocs(edgeLength) {
    var center = getCenter();
    var vertShift = Math.sqrt(3) * edgeLength;
    var horShift = 1.5 * edgeLength;
    // Start at A
    var currentLoc = new PIXI.Point(center.x - 2 * horShift, center.y - vertShift);
    var i = 0;
    [3, 4, 5, 4, 3].forEach(function (height) {
      currentLoc.y = center.y - (height - 1) / 2 * vertShift;

      for (var j = 0; j < height; j++) {
        resources[resources.ids[i++]].place(currentLoc.x, currentLoc.y);
        currentLoc.y += vertShift;
      }

      currentLoc.x += horShift;
    });
  };

  var dragBegin = function dragBegin(loc) {
    stage.prevLeft = parseInt(renderer.view.style.left.slice(0, -2));
    stage.prevTop = parseInt(renderer.view.style.top.slice(0, -2));
    stage.dragOrigin = { x: loc.screenX, y: loc.screenY };
  };

  var dragContinue = function dragContinue(loc) {
    if (stage.dragOrigin) {
      var newLeft = Math.min(0, stage.prevLeft + (loc.screenX - stage.dragOrigin.x));
      var newTop = Math.min(0, stage.prevTop + (loc.screenY - stage.dragOrigin.y));
      newLeft = Math.max(newLeft, -parseInt(renderer.view.style.width.slice(0, -2)) / 2);
      newTop = Math.max(newTop, -parseInt(renderer.view.style.height.slice(0, -2)) / 2);
      renderer.view.style.left = newLeft + 'px';
      renderer.view.style.top = newTop + 'px';
    }
  };

  var dragEnd = function dragEnd() {
    stage.dragOrigin = null;
  };

  // Center the canvas on window
  var center = function center() {
    var newLeft = (renderer.width - window.innerWidth) / 2;
    var newTop = (renderer.height - window.height) / 2;
    renderer.view.style.left = '-' + (renderer.width - window.innerWidth) / 2 + 'px';
    renderer.view.style.top = '-' + (renderer.height - window.innerHeight) / 2 + 'px';
  };

  // Maintain focus on same area during resize
  var resize = function resize() {
    var oldWidth = window.size.x;
    var oldHeight = window.size.y;
    window.size = { x: window.innerWidth, y: window.innerHeight };

    var deltaX = window.size.x - oldWidth;
    var deltaY = window.size.y - oldHeight;
    renderer.view.style.left = parseInt(renderer.view.style.left.slice(0, -2)) + deltaX / 2 + 'px';
    renderer.view.style.top = parseInt(renderer.view.style.top.slice(0, -2)) + deltaY / 2 + 'px';
  };
  ;

  var clickResource = function clickResource(resourceID) {
    resources.ids.forEach(function (id) {
      resources[id].highlight(id === resourceID);
    });
    socket.emit('resource', resourceID);
    renderer.render(stage);
  };;
  var renderer = PIXI.autoDetectRenderer(screen.width * 2, screen.height * 2, { view: $('canvas')[0] }, false);
  var stage = new PIXI.Container();

  var game = new Game();
  var resources = game.resources;

  // Canvas twice as large as screen
  renderer.view.style.width = screen.width * 2 + 'px';
  renderer.view.style.height = screen.height * 2 + 'px';

  // Set up canvas css-driven dragging
  renderer.view.onmousedown = dragBegin;
  renderer.view.onmousemove = dragContinue;
  renderer.view.onmouseup = dragEnd;
  renderer.view.onmouseout = dragEnd;

  // Center with absolute positioning
  center();

  window.size = { x: window.innerWidth, y: window.innerHeight };
  window.onresize = resize;

  var setup = function setup() {
    var edgeLength = getSuggestedEdgeLength();

    resources.ids.forEach(function (id) {
      resources[id].setSprite(new PIXI.Sprite(PIXI.loader.resources['img/resource.png'].texture));
      resources[id].setEdgeLength(edgeLength);
      stage.addChild(resources[id].sprite);
    });

    mapLocs(edgeLength);
    renderer.render(stage);
  };

  PIXI.loader.add('img/resource.png').on('progress', function (loader, resource) {
    console.log('Loading ' + resource.url + ' [' + loader.progress + '%]');
  }).load(setup);
});
