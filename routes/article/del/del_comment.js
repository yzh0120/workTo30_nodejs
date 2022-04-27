	/* 
	 前端提交上的数据{
		req.body.article_id : 文章id
		req.body.comment_id : 评论id
	 }
	 */
module.exports = function(req,res,handler,async){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象

		check_body_data : [function(global_callback){
			handler.selectArr({//查询用户是否是文章作者或者是否有管理
				res : res,
				callback : global_callback,
				sqlArr: ['select user.user_authen ,user.user_super_admin,article.article_user_id from user,article where user_id = ? and article.article_id = ?'],
				paramsArr: [[req.headers.authorization,req.body.article_id]],
				success: selectArrResult => {
					result0 = selectArrResult[0]
					if((result0[0].user_authen >= 1 && result0[0].article_user_id == req.headers.authorization)
					|| result0[0].user_super_admin == 1){
						global_callback(null,'success')
					}else{
						res.send('err')
						global_callback('err')
					}
					
				}
			})	
		}],
		select_article : ['check_body_data',function(doing_res,global_callback){
			handler.transaction({//更新评论为''
				res : res,
				callback : global_callback,
				sqlArr: ['UPDATE comment SET comment_content = "" WHERE comment_id = ?'],
				paramsArr: [[req.body.comment_id]],
				success: result => {
				res.send('del_success')
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

