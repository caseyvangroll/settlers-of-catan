'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(function () {
  var socket = io();
  var loud = true;
  (function (a) {
    (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /iPad/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
  })(navigator.userAgent || navigator.vendor || window.opera);
  var mobile = jQuery.browser.mobile;
  console.log('mobile: ' + mobile);
  ;
  $('div#chat-messages')[0].scrollTop = $('div#chat-messages')[0].scrollHeight;

  var hidden = false;
  $("div#chat-handle").click(function () {
    if (hidden) {
      $("div#chat-overlay").animate({ 'right': '-292px' }, 400);
    } else {
      $("div#chat-overlay").animate({ 'right': '0' }, 400);
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
    $("div#chat-messages").animate({ scrollTop: $("div#chat-messages")[0].scrollHeight }, "fast");
    if (msg === "pause") {
      pause(true);
    } else if (msg === "unpause") {
      pause(false);
    } else if (msg === "setup") {
      setState('setup');
    } else if (msg === "game") {
      setState('game');
    }
  });

  // Add join notifications to the chat (and scroll to see)
  socket.on('chat action', function (nickname, action) {
    $('#messages').append('<li class="join-message"><center>' + nickname + ' ' + action + '</center></li>');
    $("div#chat-messages").animate({ scrollTop: $("div#chat-messages")[0].scrollHeight }, "fast");
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
          this.sprite.tint = 0Xf47777;
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
      key: 'select',
      value: function select(toggle) {
        if (toggle) {
          this.sprite.tint = 0Xff0000;
        } else {
          this.sprite.tint = 0X00FFFFFF;
        }
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
      key: 'setInteractive',
      value: function setInteractive(toggle) {
        var _this = this;

        this.sprite.interactive = toggle;
        if (toggle) {
          this.sprite.on('pointerdown', function () {
            clickResource(_this.id);
          });
        }
      }
    }]);

    return Resource;
  }();

  ;

  var Vertex = function () {
    function Vertex(id) {
      _classCallCheck(this, Vertex);

      this.id = id;
    }

    _createClass(Vertex, [{
      key: 'highlight',
      value: function highlight(toggle) {
        if (toggle) {
          this.sprite.tint = 0X81abef;
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
      key: 'select',
      value: function select(toggle) {
        if (toggle) {
          this.sprite.tint = 0X3123ed;
        } else {
          this.sprite.tint = 0X00FFFFFF;
        }
      }
    }, {
      key: 'setEdgeLength',
      value: function setEdgeLength(edgeLength) {
        this.sprite.width = edgeLength / 3;
        this.sprite.height = edgeLength / 3;
        this.sprite.anchor.set(0.5);
        // Redefine hit area - i don't understand why all of this needs to be double what i calculated
        this.sprite.hitArea = new PIXI.Circle(0, 0, edgeLength / 3);
      }
    }, {
      key: 'setInteractive',
      value: function setInteractive(toggle) {
        var _this2 = this;

        this.sprite.interactive = toggle;
        if (toggle) {
          this.sprite.on('pointerdown', function () {
            clickVertex(_this2.id);
          });
        }
      }
    }]);

    return Vertex;
  }();

  ;

  var getCenter = function getCenter() {
    return new PIXI.Point(gameWidth / 2, gameHeight / 2);
  };

  var getSuggestedEdgeLength = function getSuggestedEdgeLength() {
    return screenHeight > screenWidth ? // indicates mobile
    screenWidth / (5 * Math.sqrt(3)) * 1.5 : Math.min(screenWidth * 0.75 / (5 * Math.sqrt(3)), screenHeight * 0.75 / 8);
  };

  // Maps all locations for resources/vertices based on edge-length of one side of hexagon
  var mapLocs = function mapLocs(edgeLength) {
    var center = getCenter();

    // Map resource locations
    var resourceYShift = Math.sqrt(3) * edgeLength;
    var resourceXShift = 1.5 * edgeLength;
    var currentLoc = new PIXI.Point(center.x - 2 * resourceXShift, center.y - resourceYShift); // Start at A
    var i = 0;
    [3, 4, 5, 4, 3].forEach(function (height) {
      currentLoc.y = center.y - (height - 1) / 2 * resourceYShift;

      for (var j = 0; j < height; j++) {
        resources[resources.ids[i++]].place(currentLoc.x, currentLoc.y);
        currentLoc.y += resourceYShift;
      }

      currentLoc.x += resourceXShift;
    });

    // Map vertex locations
    var vertexYShift = Math.sqrt(3) * edgeLength / 2;
    var vertexXShift = edgeLength / 2;
    i = 0;
    // The top resource of each trickle-down
    [{ resource: 'A', height: 7 }, { resource: 'D', height: 9 }, { resource: 'H', height: 11 }, { resource: 'H', height: 11, backwards: true }, { resource: 'M', height: 9, backwards: true }, { resource: 'Q', height: 7, backwards: true }].forEach(function (config) {
      var topResource = resources[config.resource].sprite;

      // Start at top resource
      if (config.backwards) {
        currentLoc.set(topResource.x + vertexXShift, topResource.y - vertexYShift);
      } else {
        currentLoc.set(topResource.x - vertexXShift, topResource.y - vertexYShift);
      }
      var xShiftSign = config.backwards ? 1 : -1;
      for (var j = 0; j < config.height; j++) {
        vertices[vertices.ids[i++]].place(currentLoc.x, currentLoc.y);
        currentLoc.y += vertexYShift;
        currentLoc.x += vertexXShift * xShiftSign;
        xShiftSign *= -1;
      }
    });
  };

  var dragBegin = function dragBegin(loc) {
    clearSelections();
    renderer.render(stage);
    stage.prevLeft = parseInt(renderer.view.style.left.slice(0, -2));
    stage.prevTop = parseInt(renderer.view.style.top.slice(0, -2));
    stage.dragOrigin = { x: loc.data.originalEvent.clientX, y: loc.data.originalEvent.clientY };
  };

  var dragContinue = function dragContinue(loc) {
    if (stage.dragOrigin) {
      var newLeft = Math.min(0, stage.prevLeft + (loc.data.originalEvent.clientX - stage.dragOrigin.x));
      var newTop = Math.min(0, stage.prevTop + (loc.data.originalEvent.clientY - stage.dragOrigin.y));
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
    renderer.view.style.left = '-' + (gameWidth - windowWidth()) / 2 + 'px';
    renderer.view.style.top = '-' + (gameHeight - windowHeight()) / 2 + 'px';
  };

  // Maintain focus on same area during resize
  var resize = function resize() {
    var oldWidth = window.size.x;
    var oldHeight = window.size.y;
    window.size = { x: windowWidth(), y: windowHeight() };

    var deltaX = window.size.x - oldWidth;
    var deltaY = window.size.y - oldHeight;
    renderer.view.style.left = parseInt(renderer.view.style.left.slice(0, -2)) + deltaX / 2 + 'px';
    renderer.view.style.top = parseInt(renderer.view.style.top.slice(0, -2)) + deltaY / 2 + 'px';
  };

  var pause = function pause(toggle) {
    stage.filters = toggle ? [pauseFilter] : null;
    frontdrop.interactive = toggle;
    renderer.render(stage);
  };

  var setState = function setState(state, json) {
    if (state === 'setup') {
      if (!mobile) {
        pause(true);
        $('div#non-colors').css('width', screenWidth * 0.49 + 'px');
        $('div#non-colors').css('height', screenHeight + 'px');

        $('div#colors').css('min-width', screenWidth * 0.11 + 'px');
        $('div#colors').css('width', 'calc((100% - ' + screenWidth * 0.49 + 'px)/2)');
        $('div#colors').css('height', screenHeight * 0.74 + 'px');

        $('div#colors table').css('width', screenWidth * 0.1 + 'px');

        $('div#main-overlay').css('min-width', screenWidth * 0.72 + 'px');
        $('div#main-overlay').show();
      } else {
        // Don't bother adapting char selection screen for mobile
        pause(true);
        $('div#mobile-overlay').show();
      }
    } else {
      $('canvas').show();
      $('div#main-overlay').hide();
      $('div#mobile-overlay').hide();
      pause(false);
    }
  };

  ;

  var clearSelections = function clearSelections() {
    resources.ids.forEach(function (id) {
      resources[id].select(false);
    });
    vertices.ids.forEach(function (id) {
      vertices[id].select(false);
    });
  };

  var clickResource = function clickResource(resourceID) {
    clearSelections();
    resources[resourceID].select(true);
    socket.emit('resource', resourceID);
    renderer.render(stage);
  };

  var clickVertex = function clickVertex(vertexID) {
    clearSelections();
    vertices[vertexID].select(true);
    socket.emit('vertex', vertexID);
    renderer.render(stage);
  };

  var registerGameActions = function registerGameActions() {
    resources.ids.forEach(function (id) {
      resources[id].setInteractive(true);
    });
    vertices.ids.forEach(function (id) {
      vertices[id].setInteractive(true);
    });
  };

  socket.on('mode', function (mode) {
    if (loud) {
      console.log('mode: ' + mode);
    }
    if (mode === 'player') {
      registerGameActions();

      socket.on('highlight vertex', function (ids) {
        if (loud) {
          console.log('highlight vertex ' + ids);
        }
        ids.forEach(function (id) {
          vertices[id].highlight(true);
        });
        renderer.render(stage);
      });

      socket.on('highlight resource', function (ids) {
        if (loud) {
          console.log('highlight resource ' + ids);
        }
        ids.forEach(function (id) {
          resources[id].highlight(true);
        });
        renderer.render(stage);
      });
    }
  });

  socket.on('state', function (state, json) {
    if (loud) {
      console.log('state: ' + state + ', ' + json);
    }
    setState(state, json);
  });
  ;

  // Canvas/Screen/Window Sizing
  var ratio = window.devicePixelRatio || 1;
  var screenWidth = screen.width * ratio;
  var screenHeight = screen.height * ratio;
  var windowWidth = function windowWidth() {
    return window.innerWidth * ratio;
  };
  var windowHeight = function windowHeight() {
    return window.innerHeight * ratio;
  };
  var gameWidth = screenWidth * 2;
  var gameHeight = screenHeight * 2;

  // PIXI objects
  var renderer = PIXI.autoDetectRenderer(gameWidth, gameHeight, { view: $('canvas')[0] }, false);
  // renderer.backgroundColor = 0Xc4daff;
  var stage = new PIXI.Container();

  // Make backdrop - used for dragging to entire canvas

  var backdrop = new PIXI.Graphics().beginFill(0Xc4daff).drawRect(0, 0, gameWidth, gameHeight).endFill();
  backdrop.interactive = true;
  backdrop.hitArea = new PIXI.Rectangle(0, 0, gameWidth, gameHeight);
  backdrop.on('pointerdown', dragBegin);
  backdrop.on('pointermove', dragContinue);
  backdrop.on('pointerup', dragEnd);
  backdrop.on('pointerout', dragEnd);

  // Make frontdrop - used for masking to disable interacting with game
  var frontdrop = new PIXI.Container();
  frontdrop.hitArea = new PIXI.Rectangle(0, 0, gameWidth, gameHeight);

  // Make paused-state filter
  var pauseFilter = new PIXI.filters.ColorMatrixFilter();
  pauseFilter.desaturate();

  // Game Objects
  var game = new Game();
  var resources = game.resources;
  var vertices = game.vertices;

  // Canvas twice as large as screen
  renderer.view.style.width = gameWidth + 'px';
  renderer.view.style.height = gameHeight + 'px';
  window.size = { x: window.innerWidth, y: window.innerHeight };
  window.onresize = resize;
  center();

  var setup = function setup() {
    stage.addChild(backdrop);

    var edgeLength = getSuggestedEdgeLength();

    resources.ids.forEach(function (id) {
      resources[id].sprite = new PIXI.Sprite(PIXI.loader.resources['img/resource.png'].texture);
      resources[id].setEdgeLength(edgeLength);
      stage.addChild(resources[id].sprite);
    });

    vertices.ids.forEach(function (id) {
      vertices[id].sprite = new PIXI.Sprite(PIXI.loader.resources['img/vertex.png'].texture);
      vertices[id].setEdgeLength(edgeLength);
      stage.addChild(vertices[id].sprite);
    });

    mapLocs(edgeLength);
    stage.addChild(frontdrop);
    renderer.render(stage);
    socket.emit('bind user', document.cookie, mobile);
  };

  PIXI.loader.add('img/resource.png').add('img/vertex.png').load(setup);
});
