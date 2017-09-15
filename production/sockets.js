const cookie=require("cookie"),socketio=require("socket.io"),jwt=require("jsonwebtoken");module.exports=((server,db,Log,game)=>{const io=socketio.listen(server),enableGameEvents=socket=>{socket.on("resource",id=>{socket.emit("highlight vertex",game.resources[id].vertices)}),socket.on("vertex",id=>{socket.emit("highlight resource",game.vertices[id].resources),socket.emit("highlight vertex",game.vertices[id].vertices)})};io.on("connection",socket=>{const ip=socket.request.headers["x-forwarded-for"]||socket.request.connection.remoteAddress;socket.nickname=ip,db.ChatEvent.find({},(err,found)=>{found.forEach(event=>{switch(event.type){case"action":socket.emit("chat action",event.nickname,event.body);break;default:socket.emit("broadcast message",event.nickname,event.color,event.body)}})}),socket.on("bind user",(cookies,mobile)=>{const signedToken=cookie.parse(cookies).superEvilVirus,decodedToken=jwt.verify(signedToken,db.config.secret),assignedMode=game.players.length<game.MAX_PLAYERS&&!mobile?"player":"spectator";db.User.findOneAndUpdate({nickname:decodedToken.nickname,token:signedToken},{mode:assignedMode,state:"Connected."},(err,found)=>{found?(socket.color=found.color,socket.ip=found.ip,socket.mode=found.mode,socket.nickname=found.nickname,socket.state=found.state,socket.token=found.token,Log.game(socket.nickname,{action:"bind",agent:ip,mode:socket.mode}),io.emit("chat action",socket.nickname,`joined as ${socket.mode}`),"player"===socket.mode&&enableGameEvents(socket),socket.emit("state",game.state),socket.emit("mode",socket.mode),new db.ChatEvent({body:`joined as ${socket.mode}`,nickname:socket.nickname,type:"action"}).save()):(io.emit("chat action",socket.nickname,"joined"),Log.error({action:"error",agent:ip,message:`Couldn't find user in database...  ${JSON.stringify({nickname:decodedToken.nickname,token:signedToken})}`}))})}),socket.on("submit message",msg=>{Log.chat(`${socket.nickname}: ${msg}`),io.emit("broadcast message",socket.nickname,socket.color,msg),new db.ChatEvent({body:msg,color:socket.color,nickname:socket.nickname,type:"message"}).save()}),socket.on("disconnect",()=>{Log.game({action:"disconnect",agent:socket.nickname}),0===io.engine.clientsCount?db.ChatEvent.remove({},()=>{Log.chat("Cleared chat history")}):(io.emit("chat action",socket.nickname,"left"),new db.ChatEvent({body:"left",nickname:socket.nickname,type:"action"}).save()),db.User.findOneAndUpdate({token:socket.token},{state:"Disconnected."})})})});