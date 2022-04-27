module.exports = function (server, socketio) {
	var io = socketio(4000);

	/* ********************* 设置令牌*/

	/* ********************* */
	io.on('connection', function (socket) {
		socketId = socket.id
		console.log('socket连接成功---------', socket.handshake.query.token)

		//断开链接
		socket.on('disconnect', function () {
			console.log('disconnect: ' + socket.id);
		});
	});



	return io

}
// var globalVar = require('../global/globalVar.js');//引入 globalVar 全局变量
// var redis = require('../myRedis/myRedis');//引入redis 实例
// const JwtUtil = require('../pem/jwt');// 引入jwt token工具
// module.exports = function(server,socketio){
// 	var port = globalVar.socketIo_StartPort + parseInt(process.env.NODE_APP_INSTANCE);
// 	//单线程下 parseInt(process.env.NODE_APP_INSTANCE)是NaN 所以 port 也是NaN
// 	if(parseInt(globalVar.choosePort)){//1就是多线程模式
// 		var io = socketio(port);
// 		console.log('多线程',port)
// 	}else{
// 		var io = socketio(globalVar.socketIo_StartPort);
// 		console.log('单线程',port)
// 	}
// 	/* ********************* 设置令牌*/

// 	/* ********************* */
// 	io.on('connection', function(socket) {
// 		console.log('socket连接成功---------',socket.handshake.query.token)
// 		let token = socket.handshake.query.token
// 		let jwt = new JwtUtil(token);
// 		let result = jwt.verifyToken();
// 		if(result == 'err'){//非法
// 			socket.disconnect()
// 			// if (io.sockets.connected[socket.id]) {
// 			// 	io.sockets.connected[socket.id].emit('illegal','illegal');
// 			// }
// 			console.log('socket非法')
// 			return;
// 		}else{//合法
// 			console.log('socket合法')
// 		}
// 		// 将用户id和socket.id绑定在一起  //socket.id  用户唯一标识
// 		redis.set(result, socket.id,  function(err,result){	  
// 			if (err) {return console.log(err);}
// 		})

// 		socket.on('disconnect', function() {
// 			console.log('disconnect: ' + socket.id);
// 		});
// 	    });



// 		return io

// }


/* socket ******************************************************************/
//  var server = require('http').Server(app);
//  var socketio = require('socket.io'); 

//  // var port = 3131 + parseInt(process.env.NODE_APP_INSTANCE);
//  //多线程
//  // io = socketio(port);
//  //var io = socketio(port);
//  //单线程
//  // var io = socketio(3131);
//  var port = globalVar.socketIo_StartPort + parseInt(process.env.NODE_APP_INSTANCE);
//  //单线程下 parseInt(process.env.NODE_APP_INSTANCE)是NaN 所以 port 也是NaN
//  if(parseInt(globalVar.choosePort)){//1就是多线程模式
// 	var io = socketio(port);
// 	console.log('1111111111111111111',port)
//  }else{
// 	var io = socketio(globalVar.socketIo_StartPort);
// 	console.log('222222222222222222222',port)
//  }



// io.on('connection', function(socket) {
// 	console.log('socket连接成功---------socket.id')
// 	// if(socket.handshake.query.token){
// 	// 		redis.set(socket.handshake.query.token, socket.id,  function(err,result){
// 	// 				if (err) {return console.log(err);}
// 	// 		})
// 	// 	console.log(socket.handshake.query.token,'用户已经登录')
// 	// }else{
// 	// 	console.log('--------------------用户未登录')
// 	// }
// 	/* 将用户id和socket.id绑定在一起 */
// 	  redis.set(socket.handshake.query.token, socket.id,  function(err,result){	  
// 		if (err) {return console.log(err);}
// 	  })
// 	  //socket.id  用户唯一标识
// 		// console.log('新用户通过socket.io连接成功',socket.handshake.headers.origin,socket.id)
//         socket.on('disconnect', function() {
// 			console.log('disconnect: ' + socket.id);
//         });
// 		// socket.on('sendMsg',function(data){
// 		// 	console.log(data)		
// 		// 	// 除了自己以外的客户端发送消息
// 		// 	socket.broadcast.emit("every",
// 		// 	{
// 		// 		ip:socket.handshake.headers.origin,
// 		// 		msg : data
// 		// 	}); 

// 		// 	socket.emit('returnMsg', {
// 		// 		 code : '发送成功',
// 		// 		ip:socket.handshake.headers.origin,
// 		// 		msg : socket.handshake.query.token,
// 		// 		// msg : data
// 		// 	});
// 		// })
//     });
