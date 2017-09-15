"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}();$(function(){var socket=io();$("div#chat-messages")[0].scrollTop=$("div#chat-messages")[0].scrollHeight;var hidden=!1;$("div.chat-handle").click(function(){hidden?$("div#chat-overlay").animate({right:"-292px"},400):$("div#chat-overlay").animate({right:"0"},400),hidden=!hidden}),$("form.chat-form").submit(function(){return socket.emit("submit message",$("input.chat-form").val()),$("input.chat-form").val(""),!1}),socket.on("broadcast message",function(nickname,hexColor,msg){$("#messages").append('<li style="color:'+hexColor+'"><b>'+nickname+"</b>: "+msg+"</li>"),$("div#chat-messages").animate({scrollTop:$("div#chat-messages")[0].scrollHeight},"fast"),"pause"===msg?pause(!0):"unpause"===msg?pause(!1):"setup"===msg?setState("setup"):"game"===msg&&setState("game")}),socket.on("chat action",function(nickname,action){$("#messages").append('<li class="join-message"><center>'+nickname+" has "+action+"</center></li>"),$("div#chat-messages").animate({scrollTop:$("div#chat-messages")[0].scrollHeight},"fast")});var Resource=function(){function Resource(id){_classCallCheck(this,Resource),this.id=id}return _createClass(Resource,[{key:"highlight",value:function(toggle){this.sprite.tint=toggle?16021367:16777215}},{key:"place",value:function(x,y){this.sprite.position.set(x,y)}},{key:"select",value:function(toggle){this.sprite.tint=toggle?16711680:16777215}},{key:"setEdgeLength",value:function(edgeLength){this.sprite.width=2*edgeLength,this.sprite.height=Math.sqrt(3)*edgeLength,this.sprite.anchor.set(.5),this.sprite.hitArea=new PIXI.Polygon([2*-edgeLength,0,-edgeLength,-edgeLength*Math.sqrt(3),edgeLength,-edgeLength*Math.sqrt(3),2*edgeLength,0,edgeLength,edgeLength*Math.sqrt(3),-edgeLength,edgeLength*Math.sqrt(3)])}},{key:"setInteractive",value:function(toggle){var _this=this;this.sprite.interactive=toggle,toggle&&this.sprite.on("pointerdown",function(){clickResource(_this.id)})}}]),Resource}(),Vertex=function(){function Vertex(id){_classCallCheck(this,Vertex),this.id=id}return _createClass(Vertex,[{key:"highlight",value:function(toggle){this.sprite.tint=toggle?8498159:16777215}},{key:"place",value:function(x,y){this.sprite.position.set(x,y)}},{key:"select",value:function(toggle){this.sprite.tint=toggle?3220461:16777215}},{key:"setEdgeLength",value:function(edgeLength){this.sprite.width=edgeLength/3,this.sprite.height=edgeLength/3,this.sprite.anchor.set(.5),this.sprite.hitArea=new PIXI.Circle(0,0,edgeLength/3)}},{key:"setInteractive",value:function(toggle){var _this2=this;this.sprite.interactive=toggle,toggle&&this.sprite.on("pointerdown",function(){clickVertex(_this2.id)})}}]),Vertex}(),getCenter=function(){return new PIXI.Point(gameWidth/2,gameHeight/2)},getSuggestedEdgeLength=function(){return screenHeight>screenWidth?screenWidth/(5*Math.sqrt(3))*1.5:Math.min(.75*screenWidth/(5*Math.sqrt(3)),.75*screenHeight/8)},mapLocs=function(edgeLength){var center=getCenter(),resourceYShift=Math.sqrt(3)*edgeLength,resourceXShift=1.5*edgeLength,currentLoc=new PIXI.Point(center.x-2*resourceXShift,center.y-resourceYShift),i=0;[3,4,5,4,3].forEach(function(height){currentLoc.y=center.y-(height-1)/2*resourceYShift;for(var j=0;j<height;j++)resources[resources.ids[i++]].place(currentLoc.x,currentLoc.y),currentLoc.y+=resourceYShift;currentLoc.x+=resourceXShift});var vertexYShift=Math.sqrt(3)*edgeLength/2,vertexXShift=edgeLength/2;i=0,[{resource:"A",height:7},{resource:"D",height:9},{resource:"H",height:11},{resource:"H",height:11,backwards:!0},{resource:"M",height:9,backwards:!0},{resource:"Q",height:7,backwards:!0}].forEach(function(config){var topResource=resources[config.resource].sprite;config.backwards?currentLoc.set(topResource.x+vertexXShift,topResource.y-vertexYShift):currentLoc.set(topResource.x-vertexXShift,topResource.y-vertexYShift);for(var xShiftSign=config.backwards?1:-1,j=0;j<config.height;j++)vertices[vertices.ids[i++]].place(currentLoc.x,currentLoc.y),currentLoc.y+=vertexYShift,currentLoc.x+=vertexXShift*xShiftSign,xShiftSign*=-1})},dragEnd=function(){stage.dragOrigin=null},pause=function(toggle){stage.filters=toggle?[pauseFilter]:null,frontdrop.interactive=toggle,renderer.render(stage)},setState=function(state,json){"setup"===state?(pause(!0),$("div#non-colors").css("width",.49*screen.width+"px"),$("div#non-colors").css("height",screen.height+"px"),$("div#colors").css("min-width",.11*screen.width+"px"),$("div#colors").css("width","calc((100% - "+.49*screen.width+"px)/2)"),$("div#colors").css("height",.74*screen.height+"px"),$("div#colors table").css("width",.1*screen.width+"px"),$("div#main-overlay").css("min-width",.72*screen.width+"px"),$("div#main-overlay").show()):($("canvas").show(),$("div#main-overlay").hide(),pause(!1))},clearSelections=function(){resources.ids.forEach(function(id){resources[id].select(!1)}),vertices.ids.forEach(function(id){vertices[id].select(!1)})},clickResource=function(resourceID){clearSelections(),resources[resourceID].select(!0),socket.emit("resource",resourceID),renderer.render(stage)},clickVertex=function(vertexID){clearSelections(),vertices[vertexID].select(!0),socket.emit("vertex",vertexID),renderer.render(stage)},registerGameActions=function(){resources.ids.forEach(function(id){resources[id].setInteractive(!0)}),vertices.ids.forEach(function(id){vertices[id].setInteractive(!0)})};socket.on("mode",function(mode){console.log("mode "+mode),"player"===mode&&(registerGameActions(),socket.on("highlight vertex",function(ids){console.log("highlight vertex "+ids),ids.forEach(function(id){vertices[id].highlight(!0)}),renderer.render(stage)}),socket.on("highlight resource",function(ids){console.log("highlight resource "+ids),ids.forEach(function(id){resources[id].highlight(!0)}),renderer.render(stage)}))}),socket.on("state",function(state,json){console.log("state "+state+", "+json),setState(state,json)});var ratio=window.devicePixelRatio||1,screenWidth=screen.width*ratio,screenHeight=screen.height*ratio,windowWidth=function(){return window.innerWidth*ratio},windowHeight=function(){return window.innerHeight*ratio},gameWidth=2*screenWidth,gameHeight=2*screenHeight,renderer=PIXI.autoDetectRenderer(gameWidth,gameHeight,{view:$("canvas")[0]},!1),stage=new PIXI.Container,backdrop=(new PIXI.Graphics).beginFill(12901119).drawRect(0,0,gameWidth,gameHeight).endFill();backdrop.interactive=!0,backdrop.hitArea=new PIXI.Rectangle(0,0,gameWidth,gameHeight),backdrop.on("pointerdown",function(loc){clearSelections(),renderer.render(stage),stage.prevLeft=parseInt(renderer.view.style.left.slice(0,-2)),stage.prevTop=parseInt(renderer.view.style.top.slice(0,-2)),stage.dragOrigin={x:loc.data.originalEvent.clientX,y:loc.data.originalEvent.clientY}}),backdrop.on("pointermove",function(loc){if(stage.dragOrigin){var newLeft=Math.min(0,stage.prevLeft+(loc.data.originalEvent.clientX-stage.dragOrigin.x)),newTop=Math.min(0,stage.prevTop+(loc.data.originalEvent.clientY-stage.dragOrigin.y));newLeft=Math.max(newLeft,-parseInt(renderer.view.style.width.slice(0,-2))/2),newTop=Math.max(newTop,-parseInt(renderer.view.style.height.slice(0,-2))/2),renderer.view.style.left=newLeft+"px",renderer.view.style.top=newTop+"px"}}),backdrop.on("pointerup",dragEnd),backdrop.on("pointerout",dragEnd);var frontdrop=new PIXI.Container;frontdrop.hitArea=new PIXI.Rectangle(0,0,gameWidth,gameHeight);var pauseFilter=new PIXI.filters.ColorMatrixFilter;pauseFilter.desaturate();var game=new function Game(){_classCallCheck(this,Game),this.resources=Array.apply(null,Array(19)).map(function(_,i){return String.fromCharCode(65+i)}).reduce(function(acc,cur){return acc[cur]=new Resource(cur),acc},{}),this.resources.ids=Object.keys(this.resources),this.vertices=Array.apply(null,Array(54)).map(function(_,i){return i+1}).reduce(function(acc,cur){return acc[cur]=new Vertex(cur),acc},{}),this.vertices.ids=Object.keys(this.vertices)},resources=game.resources,vertices=game.vertices;renderer.view.style.width=gameWidth+"px",renderer.view.style.height=gameHeight+"px",window.size={x:window.innerWidth,y:window.innerHeight},window.onresize=function(){var oldWidth=window.size.x,oldHeight=window.size.y;window.size={x:windowWidth(),y:windowHeight()};var deltaX=window.size.x-oldWidth,deltaY=window.size.y-oldHeight;renderer.view.style.left=parseInt(renderer.view.style.left.slice(0,-2))+deltaX/2+"px",renderer.view.style.top=parseInt(renderer.view.style.top.slice(0,-2))+deltaY/2+"px"},renderer.view.style.left="-"+(gameWidth-windowWidth())/2+"px",renderer.view.style.top="-"+(gameHeight-windowHeight())/2+"px";PIXI.loader.add("img/resource.png").add("img/vertex.png").load(function(){stage.addChild(backdrop);var edgeLength=getSuggestedEdgeLength();resources.ids.forEach(function(id){resources[id].sprite=new PIXI.Sprite(PIXI.loader.resources["img/resource.png"].texture),resources[id].setEdgeLength(edgeLength),stage.addChild(resources[id].sprite)}),vertices.ids.forEach(function(id){vertices[id].sprite=new PIXI.Sprite(PIXI.loader.resources["img/vertex.png"].texture),vertices[id].setEdgeLength(edgeLength),stage.addChild(vertices[id].sprite)}),mapLocs(edgeLength),stage.addChild(frontdrop),renderer.render(stage),socket.emit("bind user",document.cookie)})});