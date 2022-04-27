function new_user(req,res,handler,JwtUtil,mysqlG){
	// var user_name = '梁山'+new Date().getTime()
	// 在user表 插入新用户信息
	handler.transaction({
	 sqlArr: ['INSERT INTO user(user_name,user_account) VALUES (?,?)'],
	 paramsArr: [['新用户',req.body.user_account]],
	 success: result => {
		 /* ***************************************88**/
		 handler.exec({
		  sql: `select ${mysqlG.userInfo} from user where user_id = ?`,
		  params: [result[0].insertId],
		  success: resultInfo => {
		 		if(resultInfo[0]){
					let insertId = result[0].insertId
					let jwt = new JwtUtil(insertId);
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
		 /* ********************************************8*/
	 },
	 error : result => {
		res.send(500)
	 }
	})
}
module.exports = new_user