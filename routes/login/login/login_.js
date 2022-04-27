/* 
	 前端提交上的数据{
		req.body.phoneNum : 手机号
		req.body.phone_code  : 验证码
	 }
	 */
module.exports = function(req,res,JwtUtil,handler,async,mysqlG){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
	
		check_body_data : [function(global_callback){
			global_callback(null, 'success')	
		}],
		/* **************************检查手机是否存在并且验证码相等未过期 */
		check_code_phone : ['check_body_data',function(doing_res,global_callback){
			handler.exec({// 判断phone表是否存在该手机号码(是否获取了验证码)
				res : res,
				callback : global_callback,
				sql: 'select * from phone where phone_num = ?',
				params: [req.body.phoneNum],
				success: result => {// 
					if(result[0]){// 获取了验证码
						if(result[0].phone_code == req.body.phone_code 
						&& req.body.phone_code.toString().length == 6){// 验证码相等 判断验证码是否过期
							var nowTime = new Date()
							var codeTime = result[0].phone_time
							var nowTimeGetTime = new Date(nowTime).getTime();
							var codeTimeGetTime = new Date(codeTime).getTime();
							if(nowTimeGetTime-codeTimeGetTime<600000){// 验证码未过期
								handler.transaction({
									res : res,
									callback : global_callback,
									sqlArr: ['UPDATE phone SET phone_code = ? WHERE phone_num = ?'],
									paramsArr: [["",req.body.phoneNum]],
									success: result => {
										global_callback(null,{
											old_or_new : true
										})
									}
								 })
							/* ********************************************************** */
									
							}else{//验证码过期
								res.send("code_overdue")
								global_callback(null,'success')								
							}
						}else{//验证码错误					
							res.send("code_err")
							global_callback(null,'success')		
						}
					}else{// phone表不存在该手机号码(也就是没有获取验证码)
						res.send("no_phone_num")
						global_callback(null,'success')	
					}
				}
			 })
		}],
		/* ***********************************判断是新用户还是老用户 */
		old_or_new : ['check_code_phone',function(doing_res,global_callback){
			if(!doing_res.check_code_phone.old_or_new){
				global_callback(null,'success')	
				return;
			}
			handler.exec({//判断是新用户还是老用户
				res : res,
				callback : global_callback,
			 sql: 'select user_id  from user where user_phone_num = ?',
			 params: [req.body.phoneNum],
			 success: result => {		// 判断user表中是否有该手机信息 
				if(result[0]){// 用户信息存在user表中 老用户登录 只需要比较验证码清空验证码
					global_callback(null,{
						old_user_id : result[0].user_id,//老用户id
						old_user : true
					})
				}else{// 新用户 除了比较验证码 清空验证码 还需要在user表中写入数据
					global_callback(null,{
						new_user : true
					})
				}
			 }
			})
		}],
		/* **************************************老用户登录 */
		old_user : ['old_or_new',function(doing_res,global_callback){
			if(!doing_res.old_or_new.old_user){
				global_callback(null,'success')	
				return;
			}
			handler.exec({//根据老用户id查询用户信息
				res : res,
				callback : global_callback,
				sql: `select ${mysqlG.userInfo} from user where user_id = ?`,
				params: [doing_res.old_or_new.old_user_id],
				success: resultInfo => {
					if(resultInfo[0]){//用户信息存在
					let jwt = new JwtUtil(doing_res.old_or_new.old_user_id);
					let token = jwt.generateToken();
						res.send({ 
							token:token,
							result :resultInfo[0]
						})
					}else{//用户信息不存在
						res.send('No_information')
					}
					global_callback(null,'success')	
				}
			})
		}],
		/*************************************** 新用户登录 */
		new_user : ['old_or_new',function(doing_res,global_callback){
			if(!doing_res.old_or_new.new_user){
				global_callback(null,'success')	
				return;
			}
			var user_name = '新用户'
			handler.transaction({// 在user表 插入新用户信息
				res : res,
				callback : global_callback,
				sqlArr: ['INSERT INTO user(user_name,user_phone_num) VALUES (?,?)'],
				paramsArr: [[user_name,req.body.phoneNum]],
				success: result => {
				handler.exec({//根据新用户id查询信息
					res : res,
					callback : global_callback,
					sql: `select ${mysqlG.userInfo} from user where user_id = ?`,
					params: [result[0].insertId],
					success: resultInfo => {
						if(resultInfo[0]){//新用户信息存在
							let insertId = result[0].insertId
							let jwt = new JwtUtil(insertId);
							let token = jwt.generateToken();
							res.send({ 
									token:token,
									result :resultInfo[0]
							})
						}else{//新用户信息不存在
							res.send('No_information')
						}
						global_callback(null,'success')	
					}
				})
				}
			})
			/* ********************************* */
		}]
	},function(err, async_global_res){
		if(err){
			
			return;
		}	
			
	})
}

