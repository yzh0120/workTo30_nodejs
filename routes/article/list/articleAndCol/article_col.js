/*
	 前端提交上的数据{
		req.body.articleAndCol : 判断是根据article还是col排序
		req.body.otherUserId : 判断是否是看其他人的收藏或者文章
		req.body.time : list最后一个item的时间
	 }
*/
module.exports = function(req,res,fs,path,handler,async,mysqlG,globalVar){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
		check_body_data : [function(global_callback){
			if(req.body.articleAndCol == 'article' || req.body.articleAndCol == 'col'){//看文章还是收藏
			}else{
				req.body.articleAndCol = 'article'//req.body.articleAndCol 非法
			}
			
			var select_user_id = req.headers.authorization;
			if(req.body.otherUserId){//看自己还是别人
				select_user_id = req.body.otherUserId
			}
			handler.exec({//检查otherUserId是否存在数据库
			res : res,
			callback : global_callback,
			 sql: `select user_id from user where user_id = ?`,
			 params: [select_user_id],
			 success: result => {
				if(result[0]){//select_user_id存在数据库
					global_callback(null, {userId : select_user_id})//当前流程结束
				}else{//select_user_id不存在数据库
					res.send('err')
					global_callback('err')//当前流程结束
					return;
				}

			 }
			})
			
		}],
		select_article : ['check_body_data',function(doing_res,global_callback){
			if(req.body.articleAndCol != 'article'){
				global_callback(null, 'success')
				return;
			}

			var time_sql;
			if(req.body.time){//如果有时间 则根据时间来过滤上次查询过的数据
				time_sql = `and article.article_publish_time < ${handler.escape(new Date(req.body.time))}`
			}else{
				time_sql = ''
			}
			handler.exec({//查询文章
				res : res,
				callback : global_callback,
			    sql: `SELECT article.*,${mysqlG.userBase} FROM article , user where article.article_user_id = user.user_id and article_user_id = ?  ${time_sql} ORDER BY article.article_publish_time desc LIMIT ${globalVar.limit}`,
			    params: [doing_res.check_body_data.userId],
			    success:  result => {
					/* *************************************************** */
						function abc(callback){//先定义一个需要异步的函数
							var itemArr = []
							for(let i=0;i<result.length;i++){
								itemArr.push(
									function(callback){
										fs.readFile(path.join(result[i].article_content), function (err, data) {	
											if (err) {
											   result[i].article_content = ''
											}else{
											  result[i].article_content = data.toString() 
											}
											callback(null, result[i])	 //callback流程结束 	
										});
									}
								)
							}
							return itemArr;
						}
						/* *************************************************** */
						if(!result[0]){//如果数据库中的结果是零(已经对查询数据库结果判断是否为空)
							res.send("no_data")
							global_callback('err')//后面的流程不执行 
							return;
						}
						async.parallel(//并行无关联 asyncRes等于callback(null,value)的数组	 
							abc()
						,function(err, asyncRes){
							if(err){
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
							global_callback(null,'success')//当前流程结束 
						})
							
			    }
			})
			/* ****************************************************** */
		}],
		select_col : ['check_body_data',function(doing_res,global_callback){
			if(req.body.articleAndCol != 'col'){
				global_callback(null, 'success')
				return;
			}

			var time_sql;
			if(req.body.time){//如果有时间 则根据时间来过滤上次查询过的数据
				time_sql = `and col.col_publish_time < ${handler.escape(new Date(req.body.time))}`
			}else{
				time_sql = ''
			}
			handler.exec({
				res : res,
				callback : global_callback,
			    sql: `SELECT temp.col_publish_time,article.*,${mysqlG.userBase} FROM(select col_article_id,col_publish_time from col where col_user_id = ? ${time_sql} ORDER BY col.col_publish_time desc LIMIT ${globalVar.limit}) AS temp ,article ,user  where article.article_id = temp.col_article_id And article.article_user_id = user.user_id `,
			    params: [doing_res.check_body_data.userId],
			    success:  result => {
					/* *************************************************** */
						function abc(callback){//先定义一个需要异步的函数
							var itemArr = []
							for(let i=0;i<result.length;i++){
								itemArr.push(
									function(callback){
										fs.readFile(path.join(result[i].article_content), function (err, data) {	
											if (err) {
											   result[i].article_content = ''
											}else{
											  result[i].article_content = data.toString() 
											}
											callback(null, result[i])	//callback流程结束  	
										});
									}
								)
							}
							return itemArr;
						}
						/* *************************************************** */
						if(!result[0]){//如果数据库中的结果是零
							res.send("no_data")
							global_callback('err')//后面的流程不执行 
							return;
						}
						async.parallel(//并行无关联 asyncRes等于callback(null,value)的数组	 
							abc()
						,function(err, asyncRes){
							if(err){
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
							global_callback(null,'success') //当前流程结束
						})
							
			    }
			})
			/* ****************************************************** */
		}],
	},function(err, async_global_res){
		if(err){
			
			return;
		}		
			
	})
}

