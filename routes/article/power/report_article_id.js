module.exports = function(callback,old_result,handler,res,mysqlG){
	return function(callback){
		old_result.type = 'article'//告诉前端是什么举报类型的
		handler.exec({
			res:res,
			callback : callback,
			//根据文章id到 评论表查评论和个人信息
			sql: `SELECT article.article_title,${mysqlG.userBase} FROM article , user where article.article_user_id = user.user_id And article.article_id = ?`,
			params: [old_result.report_article_id],
			success: resultTwo => {//resultTwo是文章的标题和个人信息
			 if(resultTwo[0]){ /*如果评论表中确实与此id的评论和个人信息  */
				old_result.user_info = resultTwo[0]
			 }else{
				old_result.user_info_deleted = true
			 }
			 callback(null,old_result)
			}
		})	
	}
}
	