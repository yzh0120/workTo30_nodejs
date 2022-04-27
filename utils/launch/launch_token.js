// 引入jwt token工具
const JwtUtil = require('../pem/jwt');
const app_token = require('../smallTool/app_token');
// const app_list_token = require('../smallTool/app_list_token');
module.exports = function(app){
	/* 接口是否需要登录身份*/
	app.use(function(req,res,next){
		  // 首页
		 if(
		 app_token(req.url)
		 ){
			 // 以下需要token认证接口
			 let token = req.headers.authorization
			 let jwt = new JwtUtil(token);
			 let result = jwt.verifyToken();
			 req.headers.authorization = result
			// 这是为跨域准备的
			if(
				(!!req.headers['access-control-request-headers']) == true
				||
				(!!req.headers['access-control-request-method']) ==true
			){
				// console.log('这是opinion')
				next()
			}else{
				if (result == 'err') {
					// if(app_list_token(req.url)){
					// 	res.send('no_list_login')
					// }else{
					// 	res.send('no_login')
					// }
					res.send('no_login')
					// console.log('no_login')
					
				}else{
					// console.log('next-----------------------------')
					next()
				}
			}
			
		 }else{
			 // console.log('该接口不需要token')
			 next()
		 }
	})
}