/* 
	 前端提交上的数据{
		req.body.article_id :文章id
		req.body.comment_user_id : 点击评论的用户id
		req.body.time : 封号多长时间 单位是天数
	 }
	 */
module.exports = function(req,res,handler,async){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
	
		check_body_data : [function(global_callback){
			handler.selectArr({//查询当前用户是否是文章作者且是炒鸡认证(是否有权限)
				res : res,
				callback : global_callback,
				sqlArr: [`select user.user_authen,article.article_user_id from user,article where user_id = ? and article.article_id = ?`],
				paramsArr: [[req.headers.authorization,req.body.article_id]],
				success: selectArrResult => {
					var result1 =  selectArrResult[0];
					if(result1[0] && result1[0].user_authen == 2 && result1[0].article_user_id == req.headers.authorization){//检查权限
						global_callback(null, 'success')	//当前流程结束
					}else{//没有权限
						res.send('err')
						global_callback('err')	//后面的流程不执行 	
						return;
					}
					
					
				}
			})
			
		}],
		choose : ['check_body_data',function(doing_res,global_callback){
			global_callback(null, 'success')//当前流程结束
		}],
		stop : ['choose',function(doing_res,global_callback){
			let now = new Date(),//当前时间
			time = new Date(now.setDate(now.getDate()+req.body.time))//封号几天
			handler.exec({//查询stop数据库中是否存在数据
			res : res,
			callback : global_callback,
			 sql: `select stop_time from stop where stop_user_id = ? And stop_authen_id = ?`,
			 params: [req.body.comment_user_id,req.headers.authorization],
			 success: resultAuthen => {
				if(resultAuthen[0]){//如果评论人和文章作者存在stop中
					if(resultAuthen[0].stop_time-new Date()>0){//未到解封时间
						res.send('stop')
						global_callback('err')//后面的流程不执行
					}else{//到了解封时间 更新
						handler.transaction({
							res : res,
							callback : global_callback,
						 sqlArr: [`UPDATE stop SET stop_time = ? WHERE stop_user_id = ? And stop_authen_id = ?`],
						 paramsArr: [[time,req.body.comment_user_id,req.headers.authorization]],
						 success: result => {
							 res.send('success')
							 global_callback(null,'success')//当前流程结束
						 }
						})
					}
					
				}else{//如果评论人和文章作者不存在stop中
					handler.transaction({
						res : res,
						callback : global_callback,
					 sqlArr: [`INSERT INTO stop(stop_user_id,stop_authen_id,stop_time) VALUES (?,?,?)`],
					 paramsArr: [[req.body.comment_user_id,req.headers.authorization,time]],
					 success: result => {
						 res.send('success')
						 global_callback(null,'success')//当前流程结束
					 }
					})
				}
			 }
			})
		}]
	},function(err, async_global_res){
		if(err){
			
			return;
		}	
			
	})
}

