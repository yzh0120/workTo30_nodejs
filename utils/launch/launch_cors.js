module.exports = function(app){
	app.all('*', function (req, res, next) {
	  // 设置请求头为允许跨域
	  res.header('Access-Control-Allow-Origin', '*');
	  // 设置服务器支持的所有头信息字段
	  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, sessionToken');
	  // 设置服务器支持的所有跨域请求的方法
	  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	  if (req.method.toLowerCase() == 'options') {
	      res.send(200);  // 让options尝试请求快速结束
	  } else {
	      next();
	  }
	})
}


/* 
 module.exports = function(app){
 	app.all('*', function(req, res, next) {	
 		// if( 
 		// req.headers.origin == 'http://121.229.165.87'  
 		// || req.headers.origin == 'http://yinzhou.xyz' 
 		// || req.headers.origin == 'http://localhost:8889'
 		// || req.headers.origin == 'http://localhost:8081'
 		// ){
 			res.header("Access-Control-Allow-Origin", req.headers.origin);
 			res.header("Access-Control-Allow-Headers", "Origin,x-requested-with , Content-Type, Accept, Authorization");
 			res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
 		// }
 	    next();
 	 });
 }
 
 */