/* ********************************************************引入基本模块 开始*/
var express = require('express'); //引入express模块
var app = express(); //获得express实例
var fs = require("fs"); //获得文件模块
var server = require('http').createServer(app); //创建服务





/* ****************************************************socketio 开始 */

let socketId = undefined;//只是为了测试
var socketio = require('socket.io');
var io = socketio(4000); //4000端口

io.on('connection', function (socket) {
	socketId = socket.id
	console.log('socket连接成功---------', socket.handshake.query.token)

	socket.on('disconnect', function () {
		console.log('disconnect: ' + socket.id);
	});
});

/* 发送事件 */
// setInterval(() => {
// 	if (io.sockets.connected[socketId]) {
// 		io.sockets.connected[socketId].emit('newInfo', 'reward');
// 		console.log('发送成功')
// 	} else {
// 		console.log('没有此socketId')
// 	}
// }, 2000)

/* ********************************************************socketio 结束*/


app.use(express.static(__dirname + '/public')); // 设置静态资源中间件

var bodyParser = require('body-parser'); //引用bodyParser 这个不要忘了写
app.use(bodyParser.json()); // 创建 application/json 解析
app.use(bodyParser.urlencoded({
	extended: true
})); // ture->使用queryString库（默认） false->使用qs库。

const launch_cors = require('./utils/launch/launch_cors'); //3  launch_cors 全球资源共享 设置跨域访问
launch_cors(app)


app.get('/socket', function (req, res) {
	io.sockets.connected[socketId].emit('newInfo', 'reward');
   res.send({code:200,data:{}});
   
})
/* ********************************************总接口开始**************************/

// var login = require('./routes/login/login');// 登录注册接口
// app.use('/login',login);

var login = require('./routes/new/login'); // 登录注册接口
var request = require('./routes/new/request'); // 请求接口
var table = require('./routes/new/table'); // table接口


app.use('/user', login);
// app.use('/request', request);
app.use('/test', table);
/* ********************************************总接口结束**************************/
// server.listen(80,function(){//服务监听
//  		 console.log('服务已启动')
//  	});

server.listen(880, '0.0.0.0', function () { //服务监听
	console.log('服务已启动')
});
