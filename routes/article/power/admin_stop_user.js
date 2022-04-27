/* 
	 前端提交上的数据{
		req.body.comment_user_id : 点击评论的用户id
		req.body.time : 封号多长时间 单位是天数
	 }
	 */
module.exports = function(req,res,handler,async){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
		check_body_data : [function(global_callback){
			handler.selectArr({//查询当前用户是否是user_super_admin(是否有权限)
				res : res,
				callback : global_callback,
				sqlArr: ['select user_super_admin from user where user_id = ?'],
				paramsArr: [[req.headers.authorization]],
				success: selectArrResult => {
					var result1 =  selectArrResult[0];
					if(result1[0] && result1[0].user_super_admin == 1){//检查权限
						global_callback(null, 'success')	
					}else{
						res.send('err')
						global_callback('err')//后面的流程不执行 
						return;
					}
					
					
				}
			})
			
		}],
		choose : ['check_body_data',function(doing_res,global_callback){
			global_callback(null, 'success')//当前流程结束
		}],
		stop : ['choose',function(doing_res,global_callback){
			let now = new Date(),//现在的时间
			time = new Date(now.setDate(now.getDate()+req.body.time))//需要封号多少天
			handler.exec({//查询stop数据库中是否存在数据
			res : res,
			callback : global_callback,
			 sql: `select admin_stop_time from admin_stop where admin_stop_user_id = ? `,
			 params: [req.body.comment_user_id],
			 success: resultAuthen => {
				if(resultAuthen[0]){//如果评论人和文章作者存在stop中
					if(resultAuthen[0].admin_stop_time-new Date()>0){//未到解封时间
						res.send('stop')
						global_callback('err')//后面的流程不执行
					}else{//到了解封时间 更新
						handler.transaction({
							res : res,
							callback : global_callback,
						 sqlArr: [`UPDATE admin_stop SET admin_stop_time = ? WHERE admin_stop_user_id = ? `],
						 paramsArr: [[time,req.body.comment_user_id]],
						 success: result => {
							 res.send('success')
							 global_callback(null,"success")//当前流程结束
						 }
						})
					}
					
				}else{
					/* 如果评论人和文章作者不存在stop中 */
					handler.transaction({
						res : res,
						callback : global_callback,
					 sqlArr: [`INSERT INTO admin_stop(admin_stop_user_id,admin_stop_authen_id,admin_stop_time) VALUES (?,?,?)`],
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

