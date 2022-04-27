function judge_in_db(req,res,handler,JwtUtil,new_user,mysqlG){
	handler.exec({
	 sql: 'select user_id  from user where user_account = ?',
	 params: [req.body.user_account],
	 success: result => {
		 // 判断user表中是否有该账号信息
		if(!!result[0] == true){
			// 用户信息存在user表中
			handler.exec({
			 sql: `select ${mysqlG.userInfo} from user where user_id = ?`,
			 params: [result[0].user_id],
			 success: resultInfo => {
					if(resultInfo[0]){
						let jwt = new JwtUtil(result[0].user_id);
						let token = jwt.generateToken();
						res.send({ 
								token:token,
								result :resultInfo[0]
						})
					}else{
						res.send('No_information')
					}
			 },
			 error : result => {
				res.send(500)
			 }
			})
			// 老用户登录
		}else{
			// 新用户 需要在user表中写入数据
			new_user(req,res,handler,JwtUtil,mysqlG)
		}
	 },
	 error : result => {
		res.send(500)
	 }
	})
}
module.exports = judge_in_db