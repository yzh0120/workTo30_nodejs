	/******************************************************* 
	req.body.articleId : 根据文章id查询结果
	 */
	
module.exports = function(req,res,fs,path,handler,mysqlG,errLog,async){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
		check_body_data : [function(global_callback){
			global_callback(null, 'success')	
		}],
		/*******************************************************
			根据文章id查出文章和路径 解析后返回
		*/
		select_article : ['check_body_data',function(doing_res,global_callback){
			// var value = req.body.value
			handler.exec({//根据req.body.articleId 查具体数据
				res : res,
				callback : global_callback,
			    sql: `SELECT article.*,${mysqlG.userBase} FROM article , user where article.article_user_id = user.user_id and article_id = ?`,
			    params: [req.body.articleId],
			    success:  result => {
						if(!result[0]){//如果数据库中的结果是零(已经对查询数据库结果判断是否为空)
							res.send("not_found")
							global_callback('err')//后面的流程不执行
							return;
						}
						// 读取文本  result[0].article_content
						fs.readFile(path.join(result[0].article_content),function(err,data){
							if (err) {
								res.send('no_data')
								global_callback('err')//后面的流程不执行
								errLog.error('读取文章txt失败@:',result[0].article_content,'错误原因@:',err)
								return;
							}
							//此处为了方便删除文章
							result[0].article_contentHTML = data.toString()
							res.send( result[0] )
							// 添加文章阅读量
							handler.exec({
								res : res,
								callback : global_callback,
								sql: 'update article set article_look_count = article_look_count + 1 where article_id = ?',
								params: [req.body.articleId],
								success: result => {
								}
							})
							global_callback(null,'success')//当前流程结束
							
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

