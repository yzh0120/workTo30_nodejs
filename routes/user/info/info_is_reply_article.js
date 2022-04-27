module.exports = function(callback,old_result,handler,res,mysqlG){
	return function(callback){
		handler.exec({
		res : res,
		callback : callback,
		//根据回复文章的评论id查评论具体内容和评论人
		 sql: `SELECT comment.*,${mysqlG.userBase} FROM comment , user where comment.comment_user_id = user.user_id and comment.comment_id = ?`,
		 params: [old_result.info_is_reply_article],
		 success: resultTwo => {
			 if(resultTwo[0]){//如果评论具体内容和评论人的信息存在
				old_result.user_info = resultTwo[0]
			 }else{
				old_result.user_info_not_found = true
			 }
			handler.exec({//根据文章id查文章标题
				res : res,
				callback : callback,
			 sql: 'select article_title from article where article_id = ?',
			 params: [old_result.info_article_id],
			 success: resTwo => {
				 if(resTwo[0]){//文章存在
					old_result.article_title = resTwo[0].article_title
				 }else{
					 old_result.article_title = ''
				 }
				callback(null,old_result)
			 }
			})
		 }
		})
	}
}
		