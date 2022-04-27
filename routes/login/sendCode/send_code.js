/* 
	 前端提交上的数据{
		req.body.phoneNum : 手机号
	 }
	 */
const request = require('request');//请求
//const crypto = require('crypto');//加密 内置模块
module.exports = function(req,res,createSixNum,handler,async,signMD5_phone){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
		check_body_data : [function(global_callback){
			global_callback(null, 'success')	
		}],
		nodejs_request : ['check_body_data',function(doing_res,global_callback){
			let random = createSixNum();//六位手机字符串类型随机数
			let curTime = Math.floor(Date.now()/1000);//时间搓
			const config = {
			    url: 'https://live.moduyun.com/sms/v1/sendsinglesms',//这个v1接口没用
			    accesskey: '5eb3887cefb9a37990abca67',  // 根据实际填 accesskey
			    secretkey: 'd9f85dd0a8a84f7392fec40148efdd08'  // 根据实际填 secretkey
			}
			/* ******************************只有8个字段*************** */
			let formPostData =
			{
			"accesskey":config.accesskey, 
			"random": random, //0:通知短信;1:营销短信（强调：要按需填值，不然会影响到业务的正常使用）
			"msg": `【云锁峰】您好，你的验证码是${random}，请在10分钟内验证完毕`, //utf8编码 
			"sig": signMD5_phone(config.secretkey,random,curTime,req.body.phoneNum), //app凭证，具体计算方式见下注
			"time": curTime, //unix时间戳，请求发起时间，如果和系统时间相差超过10分钟则会返回失败
			"type": 0, //0:通知短信;1:营销短信（强调：要按需填值，不然会影响到业务的正常使用）
			"nationcode" : "86",
			"mobile" : req.body.phoneNum
			}
			/* *************************************************发送请求 */
			request({
			    url: 'https://live.moduyun.com/sms/v3/sendsinglesms',
				method : 'POST',
			    form:formPostData,
				headers : { 'Content-Type' : 'multipart/form-data' },
			
			}, (err, nodejsRes, body) => {
			    if (err) {
					res.send('fail')
			        global_callback(null,"success")
			        return;
			    }
				body = JSON.parse(body)
				if(body.result == 0){// 	0表示成功(计费依据)，非0表示失败
					handler.exec({/*查询phone表中是否有req.body.phoneNum的手机号 有则update验证码 没有则insert验证码  */
						res : res,
						callback : global_callback,
					    sql: 'SELECT phone_num FROM phone WHERE phone_num = ?',
					    params: [req.body.phoneNum],
					    success: result => {
							if(result[0]){//phone表中存在手机号  更新
								global_callback(null,{
									update_phone : true,
									random : random
								})
							}else{//phone表中存在手机号  插入
								global_callback(null,{
									insert_phone : true,
									random : random
								})
							}
							
						}
					})
					/* ************************************* */
				}else{//非0表示失败
					res.send('fail')
					global_callback(null,"success")
				}
			})
		}],
		update_phone : ['nodejs_request',function(doing_res,global_callback){
			if(!doing_res.nodejs_request.update_phone){
				global_callback(null,'success')
				return;
			}
			// phone数据库中有此手机号
			handler.transaction({
				res : res,
				callback : global_callback,
				sqlArr: ['UPDATE phone SET phone_code = ? , phone_time = ? WHERE phone_num = ?'],
				paramsArr: [[doing_res.nodejs_request.random,new Date(),req.body.phoneNum]],
				success: result => {
					res.send('success')
					global_callback(null,'success')
				}
			})
		}],
		insert_phone : ['nodejs_request',function(doing_res,global_callback){
			if(!doing_res.nodejs_request.insert_phone){
				global_callback(null,'success')
				return;
			}
			// 数据库中没有此手机
			handler.transaction({
				res : res,
				callback : global_callback,
				sqlArr: ['INSERT INTO phone(phone_time,phone_num,phone_code) VALUES (?,?,?)'],
				paramsArr: [[new Date(),req.body.phoneNum,doing_res.nodejs_request.random]],
				success: result => {
					res.send('success')
					global_callback(null,'success')
				}
			})
		}]
	},function(err, async_global_res){
		if(err){
			
			return;
		}	
			
	})
}

