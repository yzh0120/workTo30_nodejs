module.exports = function(callback,old_result,handler,res,mysqlG){
	return function(callback){
		handler.exec({//根据评论id 查评论和个人信息
		 sql: `SELECT comment.*,${mysqlG.userBase} FROM comment , user where comment.comment_user_id = user.user_id and comment.comment_id = ? `,
		 params: [old_result.report_comment_id],
		 success: resultTwo => {//resultTwo是评论和个人信息
				if(resultTwo[0]){// 如果数据库的评论表中根据评论id有评论和个人信息
					old_result.user_info = resultTwo[0]
					if(resultTwo[0].comment_reply_comment_id != null){//如果此评论是回复的评论
						old_result.type = 'commentForComment'//给前端设置举报类型
						handler.exec({//根据被评论的评论id 查被评论的评论内容
						 sql: 'SELECT comment.comment_content FROM comment  where comment.comment_id = ? ',
						 params: [resultTwo[0].comment_reply_comment_id], 
						 success: resTwo => {//resTwo是被评论的评论内容
								old_result.user_info.replyTemp = resTwo[0] || {comment_content : ''}
								callback(null,old_result)
						 }
						})
					}else{//此评论是回复的文章
						old_result.type = 'commentForArticle'//给前端设置举报类型
						handler.exec({//根据文章id到 文章表查文章标题
						 sql: 'select article_title from article where article_id = ?',
						 params: [old_result.report_article_id],
						 success: resTwo => {//resTwo 包含了文章标题
							 if(resTwo[0]){
								old_result.article_title = resTwo[0].article_title
							 }else{
								 old_result.article_title = ''
							 }
							callback(null,old_result)
						 }
						})
					}
					/*  */
					
				}else{// 如果数据库的评论表中根据评论id有评论和个人信息
					console.log('没有评论和个人信息')
					old_result.user_info_deleted = true
					callback(null,old_result)
				}	
		 }
		})
	}
}
	