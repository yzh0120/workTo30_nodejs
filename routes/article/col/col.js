/* 
	 前端提交上的数据{
		req.body.articleId : 文章id
	 }
	 */
module.exports = function(req,res,handler,async){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
	
		check_body_data : [function(global_callback){
			global_callback(null,"success")//当前流程结束
		}],
		select_col : ['check_body_data',function(doing_res,global_callback){
			handler.exec({//查询用户是否收藏了此文章
				res : res,
				callback : global_callback,
				sql: 'select col_article_id from col where col_user_id = ? and col_article_id = ?',
				params: [req.headers.authorization,req.body.articleId],
				success: result => {
					if(result[0]){// 用户以前收藏了文章,现在需要取消
						handler.transaction({
							res : res,
							callback : global_callback,
						 sqlArr: ['UPDATE user SET user_col_count = user_col_count - 1 WHERE user_id = ?','DELETE FROM col WHERE col_user_id = ? and col_article_id = ?','UPDATE article SET article_col_count = article_col_count - 1 WHERE article_id = ?'],
						 paramsArr: [[req.headers.authorization],[req.headers.authorization,req.body.articleId],[req.body.articleId]],
						 success: result => {
							res.send('noCol')
							global_callback(null,"success")//当前流程结束	
						 }
						})
					}else{// 用户以前没有收藏了文章,现在需要收藏
						handler.transaction({
							res : res,
							callback : global_callback,
						 sqlArr: ['UPDATE user SET user_col_count = user_col_count + 1 WHERE user_id = ?','INSERT INTO col(col_user_id,col_article_id,col_publish_time) VALUES (?,?,?)','UPDATE article SET article_col_count = article_col_count + 1 WHERE article_id = ?'],
						 paramsArr: [[req.headers.authorization],[req.headers.authorization,req.body.articleId,new Date()],[req.body.articleId]],
						 success: result => {
							res.send('isCol')
							global_callback(null,"success")//当前流程结束	
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

