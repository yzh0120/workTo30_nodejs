/* 
	 前端提交上的数据{
		req.body.userId : 将要被关注的用户id
	 }
	 */
module.exports = function(req,res,handler,async){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
		check_body_data : [function(global_callback){
			global_callback(null, 'success')
		}],
		select_article : ['check_body_data',function(doing_res,global_callback){
			handler.exec({//查询当前用户是否关注了该用户
				res : res,
				callback : global_callback,
				sql: 'select * from follow where follow_user_id = ? and follow_befollowed_user_id = ?',
				params: [req.headers.authorization,req.body.userId],
				success: result => {
					if(result[0]){// 用户以前关注了该用户,现在需要取消
						handler.transaction({
							res : res,
							callback : global_callback,
						 sqlArr: ['DELETE FROM follow WHERE follow_user_id = ? and follow_befollowed_user_id = ?','UPDATE user SET user_follow = user_follow - 1 WHERE user_id = ?','UPDATE user SET user_fans = user_fans - 1 WHERE user_id = ?'],
						 paramsArr: [[req.headers.authorization,req.body.userId],[req.headers.authorization],[req.body.userId]],
						 success: result => {
							res.send('noFol')
							global_callback(null,"success")
						 }
						})
					}else{// 用户以前没有关注该用户,现在需要关注
						handler.transaction({
							res : res,
							callback : global_callback,
						 sqlArr: ['INSERT INTO follow(follow_user_id,follow_befollowed_user_id,follow_time) VALUES (?,?,?)','UPDATE user SET user_follow = user_follow + 1 WHERE user_id = ?','UPDATE user SET user_fans = user_fans + 1 WHERE user_id = ?'],
						 paramsArr: [[req.headers.authorization,req.body.userId,new Date()],[req.headers.authorization],[req.body.userId]],
						 success: result => {
							res.send('isFol')
							global_callback(null,"success")
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

