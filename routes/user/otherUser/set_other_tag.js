let arr = [
	'user_beauty',
	'user_authen',
]
/* 
	 前端提交上的数据{
		req.body.value : 判断是根据article_publish_time还是article_comment_time排序
	 }
	 */
module.exports = function(req,res,handler,async){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
	
		check_body_data : [function(global_callback){
			handler.exec({//检查用户是否是超级管理员
				res : res,
				callback : global_callback,
				sql: `select user_super_admin from user where user_id = ?`,
				params: [req.headers.authorization ],
				success: result => {
					if(result[0].user_super_admin == 1){
						global_callback(null,'success')
					}else{
						res.send('err')
						global_callback('err')
					}
				}
			})
		}],
		select_article : ['check_body_data',function(doing_res,global_callback){
			let yes = false
			for(let item of arr){
				if(item == req.body.key){
					yes = true
				}
			}
			if(yes){
				handler.transaction({/* 修改其他用户标签 */
					res : res,
					callback : global_callback,
					sqlArr: [`UPDATE user SET ${req.body.key} = ? WHERE user_id = ?`],
					paramsArr: [[req.body.value,req.body.userId]],
					success: result => {
						res.send({
							key : req.body.key,
							value : req.body.value
						})
						global_callback(null,'success')
					}
				})
			}else{
				global_callback('err')
			}
			
		}]
	},function(err, async_global_res){
		if(err){
			
			return;
		}	
				
	})
}

