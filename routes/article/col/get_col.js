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
		select_article : ['check_body_data',function(doing_res,global_callback){
			handler.exec({// 根据id查询赞过的文章
				res : res,
				callback : global_callback,
				sql: 'select col_article_id from col where col_user_id = ? and col_article_id = ?',
				params: [req.headers.authorization,req.body.articleId],
				success: result => {					
					if(result[0]){// 用户赞过了此文章
						res.send("isCol")
					}else{// 用户没赞过
						res.send("noCol")
					}	
					global_callback(null,"success")//当前流程结束
				}
			})
		}]
	},function(err, async_global_res){
		if(err){
			
			return;
		}	
			
	})
}

