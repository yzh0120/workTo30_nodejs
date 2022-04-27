module.exports = function(callback,old_result,handler,res,mysqlG){
	// itemArr.push(
		return function(callback){
			
			handler.exec({
			res : res,
			callback : callback,
			//根据old_result.info_is_reply_comment 查看 回复的评论和评论人的信息
			 sql: `SELECT comment.*,${mysqlG.userBase} FROM comment , user where comment.comment_user_id = user.user_id and comment.comment_id = ? `,
			 params: [old_result.info_is_reply_comment],
			 success: resultTwo => {
					if(resultTwo[0]){//评论和信息在
						old_result.user_info = resultTwo[0]
						handler.exec({
						res : res,
						callback : callback,
						//根据old_result.info_quoted_id 查看 被回复的评论
						 sql: 'SELECT comment.comment_content FROM comment  where comment.comment_id = ? ',
						 params: [old_result.info_quoted_id], 
						 success: resTwo => {
								old_result.user_info.replyTemp = resTwo[0] || {comment_content : ''}
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
	// )
}