var express=require('express');//引入express模块
var app =express();//获得express实例
var server = require('http').createServer(app);//创建服务

app.all("*", (req, res, next) => {
    let host = req.headers.host;
    host = host.replace(/\:\d+$/, ''); // Remove port number
    res.redirect(307, `https://${host}${req.path}`);
});

server.listen(80,function(){//服务监听
 		 console.log('服务已启动')
 	});