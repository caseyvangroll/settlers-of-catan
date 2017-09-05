'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getCenter = function getCenter() {
  return new PIXI.Point(renderer.width / 2, renderer.height / 2);
};

var getSuggestedEdgeLength = function getSuggestedEdgeLength() {
  return Math.min(screen.width * 0.7 / (5 * Math.sqrt(3)), screen.height * 0.7 / 8);
};

var mapLocs = function mapLocs(resources, center, edgeLength) {
  var vertShift = Math.sqrt(3) * edgeLength;
  var horShift = 1.5 * edgeLength;
  // Start at A
  var currentLoc = new PIXI.Point(center.x - 2 * horShift, center.y - vertShift);
  var i = 0;
  [3, 4, 5, 4, 3].forEach(function (height) {
    currentLoc.y = center.y - (height - 1) / 2 * vertShift;

    for (var j = 0; j < height; j++) {
      resources[i++].place(currentLoc.x, currentLoc.y);
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
    }
  }]);

  return Resource;
}();

;

var Vertex = function Vertex(id) {
  _classCallCheck(this, Vertex);

  this.id = id;
  this.resources = [];
  this.edges = [];
};

;

var Game = function Game() {
  _classCallCheck(this, Game);

  this.resources = Array.apply(null, Array(19)).map(function (_, i) {
    return new Resource(String.fromCharCode(65 + i));
  }); // A-S
  this.vertices = Array.apply(null, Array(54)).map(function (_, i) {
    return new Vertex(i + 1);
  }); // 1-54
};

;
var renderer = void 0;
var stage = void 0;

var game = new Game();

var init = function init() {
  var canvas = $('canvas')[0];
  renderer = PIXI.autoDetectRenderer(screen.width * 2, screen.height * 2, { view: canvas }, false);
  stage = new PIXI.Container();

  // Set up canvas css-driven dragging
  canvas.onmousedown = dragBegin;
  canvas.onmousemove = dragContinue;
  canvas.onmouseup = dragEnd;
  canvas.onmouseout = dragEnd;
};

var setup = function setup() {
  var edgeLength = getSuggestedEdgeLength();

  game.resources.forEach(function (resource) {
    resource.sprite = new PIXI.Sprite(PIXI.loader.resources['img/resource.png'].texture);
    resource.setEdgeLength(edgeLength);
  });

  mapLocs(game.resources, getCenter(), edgeLength);
  game.resources.forEach(function (resource) {
    resource.highlight(false);
    stage.addChild(resource.sprite);
  });
  renderer.render(stage);
};

PIXI.loader.add('img/resource.png').on('progress', function (loader, resource) {
  console.log('Loading ' + resource.url + ' [' + loader.progress + '%]');
}).load(setup);

$(function () {
  init();

  // Canvas twice as large as screen
  renderer.view.style.width = screen.width * 2 + 'px';
  renderer.view.style.height = screen.height * 2 + 'px';

  // Center with absolute positioning
  renderer.view.style.left = '-' + screen.width / 2 + 'px';
  renderer.view.style.top = '-' + screen.height / 2 + 'px';

  renderer.render(stage);
});
