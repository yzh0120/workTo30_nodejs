module.exports = function(callback,old_result,handler,res,mysqlG){
	return function(callback){
		handler.exec({
			res : res,
			callback : callback,
			// 'SELECT comment.*,user.user_name,user_img,user_gold,user_lv FROM comment LEFT JOIN user ON comment.comment_user_id = user.user_id where comment.comment_id = ? '
		 sql: `SELECT ${mysqlG.userBase} FROM  user where  user.user_id = ? `,
		 params: [old_result.info_is_reward],
		 success: resultTwo => {
			 if(resultTwo[0]){
				old_result.user_info = resultTwo[0]
				handler.exec({
					res : res,
					callback : callback,
				 sql: 'select article_title from article where article_id = ?',
				 params: [old_result.info_article_id],
				 success: resTwo => {
				  if(resTwo[0]){
					old_result.article_title = resTwo[0].article_title
				  }else{
					old_result.article_title = ''
				  }
				callback(null,old_result)
				 }
				}) 
			 }else{
				 old_result.user_info_not_found = true
				 callback(null,old_result)
			 }
			 
		 }
		})
	}
}
	