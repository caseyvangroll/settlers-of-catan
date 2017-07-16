const fs=require("fs"),winston=require("winston"),timeStamp=()=>{const datetime=new Date;return`${datetime.getMonth()+1}/${datetime.getDate()} ${datetime.toLocaleTimeString()}`};let buildNumber="Unknown";try{buildNumber=fs.readFileSync("current_build.txt","utf8").toString().replace(/\D/g,"")}catch(err){}const logger=new winston.Logger({transports:[new winston.transports.Console({timestamp:timeStamp,json:!1,showLevel:!1,colorize:!0,level:"server",formatter:options=>`${options.timestamp()} [${winston.config.colorize(options.level,`${options.meta.action} ${options.meta.agent}`)}] ${options.message?options.message:""}`}),new winston.transports.File({filename:`logs/Build-${buildNumber}.log`,timestamp:timeStamp,json:!1,showLevel:!1,level:"server",formatter:options=>`${options.timestamp()} [${options.meta.action} ${options.meta.agent}] ${options.message?options.message:""}`})],levels:{error:0,game:1,chat:1,server:2},colors:{error:"red",game:"magenta",chat:"cyan",server:"green"}});module.exports=logger;