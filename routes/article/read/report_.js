/* 
	 前端提交上的数据{
		req.body.commentId :举报的评论id
		req.body.articleId : 文章id
		req.body.type : 举报类型
	 }
	 */
module.exports = function(req,res,handler,async){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
	
		check_body_data : [function(global_callback){
			global_callback(null, 'success')	//当前流程结束
		}],
		choose : ['check_body_data',function(doing_res,global_callback){
			if(req.body.commentId){//如果有举报的评论id
				global_callback(null, {
					report_comment : true
				})
			}else{//如果没有举报的评论id,则是举报的文章
				global_callback(null, {
					report_article : true
				})
			}
		}],
		/* ********************************举报的是评论 */
		report_comment : ['choose',function(doing_res,global_callback){
			if(!doing_res.choose.report_comment){
				global_callback(null,"success")
				return;
			}
			handler.exec({//查询 举报人和评论id是否存在数据库
			res : res,
			callback : global_callback,
			 sql: `select report_id from report where report_comment_id = ? And report_user_id = ?`,
			 params: [req.body.commentId,req.headers.authorization],
			 success: result => {
				if(result[0]){//举报的评论存在
					res.send('success')
					global_callback(null,"success")//当前流程结束
					return;	
				}
				handler.transaction({//不存在  插入
				res : res,
				callback : global_callback,
				 sqlArr: ['INSERT INTO report(report_article_id,report_type,report_date,report_comment_id,report_user_id) VALUES (?,?,?,?,?)'],
				 paramsArr: [[req.body.articleId,req.body.type,new Date(),req.body.commentId,req.headers.authorization]],
				 success: result => {
					res.send('success')
					global_callback(null,"success")//当前流程结束
					return;
				 }
				})
				
			 }
			})
		}],
		/* ********************************举报的是文章 */
		report_article: ['choose',function(doing_res,global_callback){
			if(!doing_res.choose.report_article){
				global_callback(null,"success")
				return;
			}
			handler.exec({//查询 举报人和文章id是否存在数据库
				res : res,
				callback : global_callback,
			 sql: `select report_id from report where report_article_id = ? And report_user_id = ? AND report_comment_id = 0`,
			 params: [req.body.articleId,req.headers.authorization],
			 success: result => {
				if(result[0]){//举报的评论存在
					res.send('success')
					global_callback(null,"success")
					return;
				}
				handler.transaction({//不存在插入
					res : res,
					callback : global_callback,
					sqlArr: ['INSERT INTO report(report_article_id,report_type,report_date,report_user_id) VALUES (?,?,?,?)'],
					paramsArr: [[req.body.articleId,req.body.type,new Date(),req.headers.authorization]],
					success: result => {
						res.send('success')
						global_callback(null,"success")
						return;
					}
				})
				
			 }
			})
		}]
	},function(err, async_global_res){
		if(err){
			
			return;
		}	
			
	})
}

