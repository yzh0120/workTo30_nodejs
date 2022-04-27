module.exports = function(req,handler,globalVar,async){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
		check_body_data : [function(global_callback){
			global_callback(null, 'success')	
		}],
		select_article : ['check_body_data',function(doing_res,global_callback){
			handler.exec({/* 通过文章的评论条数 是否设置显示评论多 */
			callback : global_callback,
			sql: `select article_comment_count from article where article_id = ?`,
			params: [req.body.articleId],
			success: result => {
				if(result[0].article_comment_count >= `${globalVar.check_many_comment}`){
					handler.transaction({/* 如果文章评论数量大于等于某个值 设置article_many_comment为真*/
						callback : global_callback,
						sqlArr: ['UPDATE article SET article_many_comment = 1 WHERE article_id = ?'],
						paramsArr: [[req.body.articleId]],
						success: result => {
						global_callback(null,'success')
						}
					})
				}else{
					global_callback(null,'success')/* 如果文章评论数量小于某个值 不操作*/
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


















