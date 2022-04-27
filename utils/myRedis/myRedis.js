/*  
缓存过期的时候各个进程 获取值 判断值 设置过期值 获取值得速度都差不多
所以 无法 通过这种方法 来 解决多线程重复执行的问题
db.get(`has_mysql_${newMsg[1]}`, function(err,result){//给被回复用户发送消息
					if (err) {return console.log(err);}
					if(result){
						articleImgsLog.info('有')
					}else{
						articleImgsLog.info('没有')
						db.expire(`has_mysql_${newMsg[1]}`, '我是值',  '1',function(err,result){
							if (err) {return console.log(err);} 
							db.get(`has_mysql_${newMsg[1]}`, function(err,result){
								articleImgsLog.info(result)
							})
						})
					}
				})
*/
const handler = require('../../utils/mysqlHandler/mysqlHandler.js');//mysql数据库
var globalVar = require('../global/globalVar.js');//全局变量
var redis = require('redis');//redis
 var client = redis.createClient(6379,'localhost');//主要客户端
 client.auth(`${globalVar.redisPassWord}`);  //密码
 var Customer = redis.createClient(6379,'localhost');//订阅客户端
 Customer.auth(`${globalVar.redisPassWord}`);  //密码
 
 /* *********************************************日志***/
 var logOfConfig = require('../../log/logOfConfig.js');
   var articleImgsLog = logOfConfig.getLogger('articleImgsLog');
 /* ************************************************/
 client.on("error", function (err) {//主要客户端错误的时候
   console.log("redis连接错误:" , err);
 });
  
 client.on('connect', function(){//主要客户端连接的时候
   console.log('Redis连接成功.');

})
/* client 封装开始**********************************************************************/
var db = {}
/* 字符串过期缓存 */
db.expire = function(key, value,expire,callback){
	client.set(key, value, function(err, result){
		if (err) {
			callback(err,null);
			return console.log(err);
		}
		if (!isNaN(expire) && expire > 0) {
			client.expire(key, parseInt(expire));
		}
		callback(null,result)
	})
}
/* 
 let mysqlKey = 'mysql_' + req.headers.authorization
 redis.expire(mysqlKey, 'a',  `${globalVar.no_allow_pub}`,function(err,result){
 								if (err) {return console.log(err);} 
 								res.send('success')
 })
 */
/* 字符串 */
db.set = function(key, value, callback, expire){
	client.set(key, value, function(err, result){
		if (err) {
			callback(err,null);
			return console.log(err);
		}
		if (!isNaN(expire) && expire > 0) {
			client.expire(key, parseInt(expire));
		}
		callback(null,result)
	})
}
/* 
 redis.set(result, socket.id,  function(err,result){
 	if (err) {return console.log(err);}
 })
 */
db.get = function(key, callback){
	client.get(key, function(err,result){
		if (err) {
			callback(err,null);
			return console.log(err);
		}
		callback(null,result)
	});
}
/* 没有值 则是null
 redis.get(req.body.reply_comment_user_id, function(err,result){//给被回复用户发送消息
 	if (err) {return console.log(err);}
 	if (io.sockets.connected[result]) {
 		io.sockets.connected[result].emit('newInfo','commentForComment');
 	}
 })
 */
db.del = function(key, callback){
	client.del(key, function(err,result){
		if (err) {
			callback(err,null);
			return console.log(err);
		}
		callback(null,result)
	});
}
  //  发布订阅封装   频道   消息   
  db.pub = function(channel, data,callback){
 	 client.publish(channel,data,function(err,result){
 	        if (err) {
 	        	callback(err,null);
 	        	return console.log(err);
 	        }
 			callback(null,result)
 	    })
 }
 /* 
 redis.pub('chat', '你好',  function(err,result){
 	if (err) {return console.log(err);}
 	console.log('发布成功')
 })
 */
/* client 封装结束**********************************************************************/
  client.on('ready',function(err){//client 准备就绪ready事件
		console.log("client 准备好了");
		Customer.subscribe("chat",function(){//client准备就绪后让Customer订阅chat频道
			console.log("Customer订阅client的chat频道成功。");
		});
		
  })
   //Customer监听订阅成功事件          频道     订阅频道总数
  Customer.on("subscribe", function (channel, count) {
      console.log("Customer订阅了client发布的频道" + channel + ",client发布的频道的订阅总数" + count);
  });
  //Customer收到client pub 频道消息事件后执行回调，message是redis发布的消息
  Customer.on("message", function (channel, message) {
      console.log("我接收到了来自"+ channel+"的消息:"+ message);
	  if(channel == '__keyevent@0__:expired'){//来自缓存过期的频道
		//if (process.env.NODE_APP_INSTANCE === '0') {//在pm2下才有效
			var newMsg=message.split('_');//将字符串分隔成数组// console.log(newMsg[0],newMsg[1],'newMsg[1]')
			switch(newMsg[0]){
			case 'mysql'://允许用户发布文章
					articleImgsLog.info('数据库操作')
					handler.transaction({
						sqlArr: ['UPDATE user SET user_allow_pub = 1 WHERE user_id = ?'],
						paramsArr: [ [ newMsg[1] ] ],
						success: result => {	  	
						}
					})
			break;
			case 'newArticle'://取消新文章标识
					handler.transaction({
						sqlArr: ['UPDATE article SET article_new = 0 WHERE article_id = ?'],
						paramsArr: [ [ newMsg[1] ] ],
						success: result => {	  	
						}
					})
			break;
			}
		// }//在pm2下才有效
	  }else if(channel == 'chat'){//消息来自 chat 频道
		 // articleImgsLog.info(message)
		 if(message == 'init.js'){
			 
		 }
	  }
	  
  });
  //监听取消订阅事件
  Customer.on("unsubscribe", function (channel, count) {
 	 console.log("客户端已从" + channel + ", " + count + " 取消订阅")
  });
  /* ****************************************************************/
  //立即执行
  client.send_command('config', ['set', 'notify-keyspace-events', 'Ex'], SubscribeExpired);
  /* 过期事件*/
  function SubscribeExpired(e, r) {
      // let sub = redis.createClient(6380);
      const expired_subKey = '__keyevent@0__:expired';
      Customer.subscribe(expired_subKey, function () {
   //立即执行
   // console.log(123)
      })
  }
  /* **************************************************************/
module.exports = db;
