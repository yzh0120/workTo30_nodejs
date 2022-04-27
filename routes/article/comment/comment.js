/* 
	 前端提交上的数据{
		req.body.articleId: 文章id
		req.body.reply_comment_id  : 回复的评论的id
		req.body.comment_user_id : 被点击评论的用户id
	 }
	 */
module.exports = function(req,res,handler,redis,io,mysqlG,check_many_comment,globalVar,async){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
	
		check_body_data : [function(global_callback){
			handler.selectArr({//查询文章id是否存在
				res : res,
				callback : global_callback,
				sqlArr: ['select article_id from article where article_id = ?'],
				paramsArr: [[req.body.articleId]],
				success: selectArrResult => {
					result1 = selectArrResult[0]
					if(result1[0]){//文章存在
						req.body.reply_comment_id =  parseInt(req.body.reply_comment_id)// 将字符串变成数字类型
						global_callback(null, 'success')	
					}else{//文章不存在
						res.send('article_not_found')
						global_callback('err')//后面的流程不执行
						return;
					}				
				}
			})
		}],
		/* *****************************************判断评论的用户是否被禁言或者封号 */
		compute_stop : ['check_body_data',function(doing_res,global_callback){
			handler.selectArr({//在stop和admin_stop表中查看评论者是否被禁言或者封号
			res : res,
			callback : global_callback,
			 sqlArr: [`select stop_time from stop where stop_user_id = ? And stop_authen_id = ?`,`select admin_stop_time from admin_stop where admin_stop_user_id = ? `],
			 paramsArr: [[req.headers.authorization,req.body.article_user_id],[req.headers.authorization]],
			 success: selectArrResult => {
				if(selectArrResult[0][0]){/* 如果评论人和文章作者存在stop中 */
					if(selectArrResult[0][0].stop_time-new Date()>0){/* stop未到解封时间 */
						res.send({
							stop : selectArrResult[0][0].stop_time
						})
						global_callback('err')//后面的流程不执行 
						return;
					}else{/* stop到了解封时间 */
						global_callback(null,{
							del_stop : true,
							real_comment : true
						})
					}
					
				}else if(selectArrResult[1][0]){// 发表评论的用户存在admin表
					if(selectArrResult[1][0].admin_stop_time-new Date()>0){/* admin表未到解封时间 */
						res.send({
							admin_stop : selectArrResult[1][0].admin_stop_time
						})
						global_callback('err')//后面的流程不执行 
						return;
					}else{/* 到了解封时间 */
						global_callback(null,{
							del_admin_stop : true,
							real_comment : true
						})
					}
					
				}else{/* 如果评论人和文章作者不存在stop中和admin_stop中 */
					global_callback(null,{
						real_comment : true
					})
				}
			 }
			})	
			
		}],
		/* *****************************************删除stop表中的记录 */
		del_stop:['compute_stop',function(doing_res,global_callback){
			if(!doing_res.compute_stop.del_stop){
				global_callback(null,"success")//当前流程结束
				return;
			}
			handler.transaction({
				res : res,
				callback : global_callback,
				sqlArr: [`DELETE FROM stop WHERE stop_user_id = ? And stop_authen_id = ?`],
				paramsArr: [[req.headers.authorization,req.body.article_user_id]],
				success: result => {
					global_callback(null,over)
				}
			})	
		}],
		/* *****************************************删除admin_stop表中的记录 */
		del_admin_stop:['compute_stop',function(doing_res,global_callback){
			if(!doing_res.compute_stop.del_admin_stop){
				global_callback(null,"success")//当前流程结束
				return;
			}
			handler.transaction({
				res : res,
				callback : global_callback,
				sqlArr: [`DELETE FROM admin_stop WHERE admin_stop_user_id = ?`],
				paramsArr: [[req.headers.authorization]],
				success: result => {
					global_callback(null,over)
				}
			})
		}],
		/* *****************************************判断是回复评论还是文章 */
		real_comment : ['compute_stop',function(doing_res,global_callback){
			if(!doing_res.compute_stop.real_comment){
				global_callback(null,"success")//当前流程结束
				return;
			}
			// 设置评论发布时间
			var comment_time = new Date()
			handler.exec({/* 此查询是为了设置新评论在几楼 */
				res : res,
				callback : global_callback,
				sql: `select comment_id from comment where comment_article_id = ?`,
				params: [req.body.articleId],
				success: resultBoss => {
					var commentIndex = resultBoss.length+1
					if(req.body.reply_comment_id){//回复评论
						global_callback(null,{
							reply_comment : true,
							commentIndex : commentIndex,
							comment_time : comment_time
						})
					}else{//回复文章
						global_callback(null,{
							reply_article : true,
							commentIndex : commentIndex,
							comment_time : comment_time
						})
					}
				}
			})
		}],
		/* *****************************************回复评论 */
		reply_comment:['real_comment',function(doing_res,global_callback){
			if(!doing_res.real_comment.reply_comment){
				global_callback(null,"success")//当前流程结束
				return;
			}
			handler.transaction({//将评论插入评论表和更新文章的评论时间和评论次数
			res : res,
			callback : global_callback,
			 sqlArr: ['INSERT INTO comment(comment_index,comment_article_id,comment_user_id,comment_content,comment_time,comment_reply_comment_id) VALUES (?,?,?,?,?,?)','UPDATE article SET article_comment_time = ?,article_comment_count = article_comment_count + 1  WHERE article_id = ?'],
			 paramsArr: [[doing_res.real_comment.commentIndex,req.body.articleId,req.headers.authorization,req.body.content,doing_res.real_comment.comment_time,req.body.reply_comment_id],[doing_res.real_comment.comment_time,req.body.articleId]],
			 success: result => {
				 /* 需要result[0].insertId*/
				 handler.transaction({//将评论插入到被评论人的信息和更新用户未读消息
				 res : res,
				 callback : global_callback,
				  sqlArr: ['INSERT INTO info(info_user_id,info_is_reply_comment,info_quoted_id,info_article_id,info_time) VALUES (?,?,?,?,?)','UPDATE user SET user_unread = user_unread + 1 WHERE user_id = ?'],
				  paramsArr: [[req.body.reply_comment_user_id,result[0].insertId,req.body.reply_comment_id,req.body.articleId,doing_res.real_comment.comment_time],[req.body.reply_comment_user_id]],
				  success: resultO => {
					  /*查询刚刚插入的评论 *************123***/
					  handler.exec({
						  res : res,
						  callback : global_callback,
					   sql: `SELECT comment.*,${mysqlG.userBase} FROM comment , user where comment.comment_user_id = user.user_id and comment.comment_id = ? `,
					   params: [result[0].insertId],
					   success: resA => {
						   /*查询评论回复的原评论 ****************/
							handler.exec({
								res : res,
								callback : global_callback,
							 sql: `SELECT comment.*,user.user_name FROM comment , user where comment.comment_user_id = user.user_id and comment.comment_id = ? `,
							 params: [resA[0].comment_reply_comment_id],
							 success: resB => {
									if (resB[0]) {
										resA[0].replyTemp = resB[0]
									}
									res.send(resA[0])
									/* 通过文章的评论条数 是否设置显示评论多 */
									check_many_comment(req,handler,globalVar,async)
									global_callback(null,'over')	
							 }
							})
					   }
					  })
					redis.get(req.body.reply_comment_user_id, function(err,result){//给被回复用户发送消息
						if (err) {return;}
						if (io.sockets.connected[result]) {
							io.sockets.connected[result].emit('newInfo','commentForComment');
						}
					})
				  }
				 })
			 }
			})
		}],
		/* *****************************************回复文章 */
		reply_article : ['real_comment',function(doing_res,global_callback){
			if(!doing_res.real_comment.reply_article){
				global_callback(null,'over')
				return;
			}
			handler.transaction({//将评论插入评论表和更新文章的评论时间和评论次数
			res : res,
			callback : global_callback,
			 sqlArr: ['INSERT INTO comment(comment_index,comment_article_id,comment_user_id,comment_content,comment_time) VALUES (?,?,?,?,?)','UPDATE article SET article_comment_time = ?,article_comment_count = article_comment_count + 1  WHERE article_id = ?'],
			 paramsArr: [[doing_res.real_comment.commentIndex,req.body.articleId,req.headers.authorization,req.body.content,doing_res.real_comment.comment_time],[doing_res.real_comment.comment_time,req.body.articleId]],
			 success: result => {
				 /* 需要result[0].insertId*/
				handler.transaction({//将评论插入到被评论人的信息和更新用户未读消息
				res : res,
				callback : global_callback,
				 sqlArr: ['INSERT INTO info(info_user_id,info_is_reply_article,info_article_id,info_time) VALUES (?,?,?,?)','UPDATE user SET user_unread = user_unread + 1 WHERE user_id = ?'],
				 paramsArr: [[req.body.article_user_id,result[0].insertId,req.body.articleId,doing_res.real_comment.comment_time],[req.body.article_user_id]],
				 success: resultO => {
					 /*查询插入的评论 ****************/
					 handler.exec({
					res : res,
					callback : global_callback,
					  sql: `SELECT comment.*,${mysqlG.userBase} FROM comment , user where comment.comment_user_id = user.user_id and comment.comment_id = ? `,
					  params: [result[0].insertId],
					  success: resA => {
							res.send(resA[0])
							/* 通过文章的评论条数 是否设置显示评论多 */
							check_many_comment(req,handler,globalVar,async)
							global_callback(null,'over')
					  }
					 })
					redis.get(req.body.article_user_id, function(err,result){
						if (err) {return ;}
						if (io.sockets.connected[result]) {
							io.sockets.connected[result].emit('newInfo','commentForArticle');
						}
					})
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

