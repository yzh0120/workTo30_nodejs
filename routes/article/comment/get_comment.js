/*******************************************************
	req.body.commentSort : 评论排序
	req.body.lookAuthor : 只看作者		
	req.body.articleId : 评论的文章id
	req.body.time : list最后一个item的时间
	*/
module.exports = function(req,res,handler,async,mysqlG,globalVar){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
		check_body_data : [function(global_callback){
			handler.selectArr({//查询文章是否存在
				res : res,
				callback : global_callback,
				sqlArr: ['select article_id from article where article_id = ?'],
				paramsArr: [[req.body.articleId]],
				success: selectArrResult => {
					result1 = selectArrResult[0]
					if(result1[0]){//文章存在
						global_callback(null, 'success')
					}else{//文章不存在
						res.send('article_not_found')
						global_callback('err')//后面的流程不执行
						return;
					}
							
				}
			})
			
		}],
		select_article : ['check_body_data',function(doing_res,global_callback){
			let lookAuthor;
			if(req.body.lookAuthor){//是否只看楼主
				lookAuthor = `and comment_user_id = ${handler.escape(req.body.lookAuthor)}`
			}else{
				lookAuthor = ''
			}

			let time_sql;
			if(req.body.time){//如果有时间 则根据时间来过滤上次查询过的数据
				if(req.body.commentSort == 'first'){//有时间的情况下按什么排序
					time_sql =`and comment.comment_time > ${handler.escape(new Date(req.body.time))}`
				}else{
					time_sql = `and comment.comment_time < ${handler.escape(new Date(req.body.time))}`
				}
			}else{
				time_sql = ''
			}
			
			let desc;
			if(req.body.commentSort == 'first'){// 评论排序
				desc = ''
			}else{
				desc = 'desc'
			}
			handler.exec({//根据文章id查询数据
				res : res,
				callback : global_callback,
			    sql: `SELECT comment.*,${mysqlG.userBase} FROM comment , user where comment.comment_user_id = user.user_id  ${time_sql}  and comment.comment_article_id = ? ${lookAuthor}  ORDER BY comment.comment_id ${desc} LIMIT ${globalVar.limit}`,
			    params: [req.body.articleId],
			    success:  result => {
						/* ******************************************** 先定义需要异步的函数*/
						function abc(callback){//先定义需要异步的函数
							var itemArr = []
							for(let j=0;j<result.length;j++){
								itemArr.push(
									function(callback){
										if(result[j].comment_reply_comment_id != null){
											handler.exec({
											res : res,
											callback : callback,
											 sql: 'SELECT comment.*,user.user_name FROM comment , user where comment.comment_user_id = user.user_id and comment.comment_id = ? ',
											 params: [result[j].comment_reply_comment_id],
											 success: resultTwo => {
													result[j].replyTemp = resultTwo[0] || {}
													callback(null, result[j])
											 }
											})
										}else{
											/* 如果是回复文章的评论 */
											callback(null, result[j])
										}
									}
									/* 888888888888 */
								)
							}
							return itemArr;
						}
						/* ******************************************** 先定义需要异步的函数*/
						if(!result[0]){//如果数据库中的结果是零(已经对查询数据库结果判断是否为空)
							res.send("no_data")
							global_callback('err')//后面的流程不执行 
							return;
						}
						async.parallel(//并行无关联 asyncRes等于callback(null,value)的数组	 
							abc()
						,function(error, asyncRes){
							if(error){
								res.send('err')
								global_callback('err')//后面的流程不执行 
								return ;
							}
							if(asyncRes.length < `${globalVar.limit}`){// 当结果小于10条的时候无需继续请求
								res.send({
									result : asyncRes,
									finished : true
								})
							}else{
								res.send({
									ok:true,
									result : asyncRes
								})
							}
							global_callback(null,"success")//当前流程结束
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

