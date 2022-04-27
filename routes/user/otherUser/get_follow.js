/* 
	 前端提交上的数据{
		req.body.userId : 当前用户是否关注了该用户
	 }
	 */
module.exports = function(req,res,handler,async){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
	
		check_body_data : [function(global_callback){
			global_callback(null, 'success')	
		}],
		select_article : ['check_body_data',function(doing_res,global_callback){
			handler.exec({//当前用户是否关注了该用户
				res : res,
				callback : global_callback,
				sql: 'select * from follow where follow_user_id = ? and follow_befollowed_user_id = ?',
				params: [req.headers.authorization,req.body.userId],
				success: result => {
					if(result[0]){// 用户以前关注了该用户
						res.send('isFol')
					}else{// 用户以前没有关注该用户
						res.send('noFol')
					}
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

