"use strict";$(function(){var socket=io(),Console=function(msg){return console.log(msg)},game=void 0,resources=void 0,vertices=void 0;!function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/iPad/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))}(navigator.userAgent||navigator.vendor||window.opera);var mobile=jQuery.browser.mobile;socket.emit("bind user",document.cookie,mobile),$("div#chat-messages")[0].scrollTop=$("div#chat-messages")[0].scrollHeight;var hidden=!1;$("div#chat-handle").click(function(){hidden?$("div#chat-overlay").animate({right:"-292px"},400):$("div#chat-overlay").animate({right:"0"},400),hidden=!hidden}),$("form.chat-form").submit(function(){return socket.emit("submit message",$("input.chat-form").val()),$("input.chat-form").val(""),!1}),socket.on("broadcast message",function(nickname,hexColor,msg){$("#messages").append('<li style="color:'+hexColor+'"><b>'+nickname+"</b>: "+msg+"</li>"),$("div#chat-messages").animate({scrollTop:$("div#chat-messages")[0].scrollHeight},"fast"),"pause"===msg?pause(!0):"unpause"===msg?pause(!1):"setup"===msg?setState("setup"):"game"===msg&&setState("game")}),socket.on("chat action",function(nickname,action){$("#messages").append('<li class="join-message"><center>'+nickname+" "+action+"</center></li>"),$("div#chat-messages").animate({scrollTop:$("div#chat-messages")[0].scrollHeight},"fast")});var extendResources=function(){resources.ids.forEach(function(id){resources[id].highlight=function(toggle){this.sprite.tint=toggle?16021367:16777215},resources[id].place=function(x,y){this.sprite.position.set(x,y)},resources[id].select=function(toggle){this.sprite.tint=toggle?16711680:16777215},resources[id].setEdgeLength=function(edgeLength){this.sprite.width=2*edgeLength,this.sprite.height=Math.sqrt(3)*edgeLength,this.sprite.anchor.set(.5),this.sprite.hitArea=new PIXI.Polygon([2*-edgeLength,0,-edgeLength,-edgeLength*Math.sqrt(3),edgeLength,-edgeLength*Math.sqrt(3),2*edgeLength,0,edgeLength,edgeLength*Math.sqrt(3),-edgeLength,edgeLength*Math.sqrt(3)])},resources[id].setInteractive=function(toggle){var _this=this;this.sprite.interactive=toggle,toggle&&this.sprite.on("pointerdown",function(){clickResource(_this.id)})}})},extendVertices=function(){vertices.ids.forEach(function(id){vertices[id].highlight=function(toggle){this.sprite.tint=toggle?8498159:16777215},vertices[id].place=function(x,y){this.sprite.position.set(x,y)},vertices[id].select=function(toggle){this.sprite.tint=toggle?3220461:16777215},vertices[id].setEdgeLength=function(edgeLength){this.sprite.width=edgeLength/3,this.sprite.height=edgeLength/3,this.sprite.anchor.set(.5),this.sprite.hitArea=new PIXI.Circle(0,0,edgeLength/3)},vertices[id].setInteractive=function(toggle){var _this2=this;this.sprite.interactive=toggle,toggle&&this.sprite.on("pointerdown",function(){clickVertex(_this2.id)})}})},loadGame=function(gamestate){game=JSON.parse(gamestate),resources=game.resources,vertices=game.vertices,extendResources(),extendVertices(),PIXI.loader.load(setup),setState(game.state),socket.on("highlight vertex",function(ids){Console("highlight vertex "+ids),ids.forEach(function(id){vertices[id].highlight(!0)}),renderer.render(stage)}),socket.on("highlight resource",function(ids){Console("highlight resource "+ids),ids.forEach(function(id){resources[id].highlight(!0)}),renderer.render(stage)})},getCenter=function(){return new PIXI.Point(gameWidth/2,gameHeight/2)},getSuggestedEdgeLength=function(){return screenHeight>screenWidth?screenWidth/(5*Math.sqrt(3))*1.5:Math.min(.75*screenWidth/(5*Math.sqrt(3)),.75*screenHeight/8)},mapLocs=function(edgeLength){var center=getCenter(),resourceYShift=Math.sqrt(3)*edgeLength,resourceXShift=1.5*edgeLength,currentLoc=new PIXI.Point(center.x-2*resourceXShift,center.y-resourceYShift),i=0;[3,4,5,4,3].forEach(function(height){currentLoc.y=center.y-(height-1)/2*resourceYShift;for(var j=0;j<height;j++)resources[resources.ids[i++]].place(currentLoc.x,currentLoc.y),currentLoc.y+=resourceYShift;currentLoc.x+=resourceXShift});var vertexYShift=Math.sqrt(3)*edgeLength/2,vertexXShift=edgeLength/2;i=0,[{resource:"A",height:7},{resource:"D",height:9},{resource:"H",height:11},{resource:"H",height:11,backwards:!0},{resource:"M",height:9,backwards:!0},{resource:"Q",height:7,backwards:!0}].forEach(function(config){var topResource=resources[config.resource].sprite;config.backwards?currentLoc.set(topResource.x+vertexXShift,topResource.y-vertexYShift):currentLoc.set(topResource.x-vertexXShift,topResource.y-vertexYShift);for(var xShiftSign=config.backwards?1:-1,j=0;j<config.height;j++)vertices[vertices.ids[i++]].place(currentLoc.x,currentLoc.y),currentLoc.y+=vertexYShift,currentLoc.x+=vertexXShift*xShiftSign,xShiftSign*=-1})},dragEnd=function(){stage.dragOrigin=null},pause=function(toggle){stage.filters=toggle?[pauseFilter]:null,frontdrop.interactive=toggle,renderer.render(stage)},clearSelections=function(){resources.ids.forEach(function(id){resources[id].select(!1)}),vertices.ids.forEach(function(id){vertices[id].select(!1)})},clickResource=function(resourceID){clearSelections(),resources[resourceID].select(!0),socket.emit("resource",resourceID),renderer.render(stage)},clickVertex=function(vertexID){clearSelections(),vertices[vertexID].select(!0),socket.emit("vertex",vertexID),renderer.render(stage)},registerGameActions=function(){resources.ids.forEach(function(id){resources[id].setInteractive(!0)}),vertices.ids.forEach(function(id){vertices[id].setInteractive(!0)})};socket.on("gamestate",function(gamestate){Console("game: "+JSON.stringify(gamestate)),loadGame(gamestate)});var ratio=window.devicePixelRatio||1,screenWidth=screen.width*ratio,screenHeight=screen.height*ratio,windowWidth=function(){return window.innerWidth*ratio},windowHeight=function(){return window.innerHeight*ratio},gameWidth=2*screenWidth,gameHeight=2*screenHeight,renderer=PIXI.autoDetectRenderer(gameWidth,gameHeight,{view:$("canvas")[0]},!1),stage=new PIXI.Container,backdrop=(new PIXI.Graphics).beginFill(12901119).drawRect(0,0,gameWidth,gameHeight).endFill();backdrop.interactive=!0,backdrop.hitArea=new PIXI.Rectangle(0,0,gameWidth,gameHeight),backdrop.on("pointerdown",function(loc){clearSelections(),renderer.render(stage),stage.prevLeft=parseInt(renderer.view.style.left.slice(0,-2)),stage.prevTop=parseInt(renderer.view.style.top.slice(0,-2)),stage.dragOrigin={x:loc.data.originalEvent.clientX,y:loc.data.originalEvent.clientY}}),backdrop.on("pointermove",function(loc){if(stage.dragOrigin){var newLeft=Math.min(0,stage.prevLeft+(loc.data.originalEvent.clientX-stage.dragOrigin.x)),newTop=Math.min(0,stage.prevTop+(loc.data.originalEvent.clientY-stage.dragOrigin.y));newLeft=Math.max(newLeft,-parseInt(renderer.view.style.width.slice(0,-2))/2),newTop=Math.max(newTop,-parseInt(renderer.view.style.height.slice(0,-2))/2),renderer.view.style.left=newLeft+"px",renderer.view.style.top=newTop+"px"}}),backdrop.on("pointerup",dragEnd),backdrop.on("pointerout",dragEnd);var frontdrop=new PIXI.Container;frontdrop.hitArea=new PIXI.Rectangle(0,0,gameWidth,gameHeight);var pauseFilter=new PIXI.filters.ColorMatrixFilter;pauseFilter.desaturate(),renderer.view.style.width=gameWidth+"px",renderer.view.style.height=gameHeight+"px",window.size={x:window.innerWidth,y:window.innerHeight},window.onresize=function(){var oldWidth=window.size.x,oldHeight=window.size.y;window.size={x:windowWidth(),y:windowHeight()};var deltaX=window.size.x-oldWidth,deltaY=window.size.y-oldHeight;renderer.view.style.left=parseInt(renderer.view.style.left.slice(0,-2))+deltaX/2+"px",renderer.view.style.top=parseInt(renderer.view.style.top.slice(0,-2))+deltaY/2+"px"},renderer.view.style.left="-"+(gameWidth-windowWidth())/2+"px",renderer.view.style.top="-"+(gameHeight-windowHeight())/2+"px";var setup=function(){stage.addChild(backdrop);var edgeLength=getSuggestedEdgeLength();resources.ids.forEach(function(id){resources[id].sprite=new PIXI.Sprite(PIXI.loader.resources["img/game-objects/resource.png"].texture),resources[id].setEdgeLength(edgeLength),stage.addChild(resources[id].sprite)}),vertices.ids.forEach(function(id){vertices[id].sprite=new PIXI.Sprite(PIXI.loader.resources["img/game-objects/vertex.png"].texture),vertices[id].setEdgeLength(edgeLength),stage.addChild(vertices[id].sprite)}),mapLocs(edgeLength),registerGameActions(),stage.addChild(frontdrop),renderer.render(stage)};PIXI.loader.add("img/game-objects/resource.png").add("img/game-objects/vertex.png");var setState=function(state){"setup"===state?mobile?(pause(!0),$("div#mobile-overlay").show()):(pause(!0),$("div#non-colors").css("width",.49*screenWidth+"px"),$("div#non-colors").css("height",screenHeight+"px"),$("div#colors").css("min-width",.11*screenWidth+"px"),$("div#colors").css("width","calc((100% - "+.49*screenWidth+"px)/2)"),$("div#colors").css("height",.74*screenHeight+"px"),$("div#colors table").css("width",.1*screenWidth+"px"),$("div#main-overlay").css("min-width",.72*screenWidth+"px"),$("div#main-overlay").show(),$("td.self div.name").append("Player 1"),$("td.other div.name").each(function(index,other){return other.append("Player "+(index+2))})):($("canvas").show(),$("div#main-overlay").hide(),$("div#mobile-overlay").hide(),pause(!1))}});