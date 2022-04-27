/*
	 前端提交上的数据{
		req.body.value : 判断是根据article_publish_time还是article_comment_time排序
		req.body.plate : 查看哪一个板块
		req.body.tag :   查询板块的细分标签
		req.body.time : list最后一个item的时间
	 }
	 */
module.exports = function(req,res,fs,path,handler,async,mysqlG,globalVar){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
		check_body_data : [function(global_callback){
			if(req.body.value == 'article_publish_time' || req.body.value == 'article_comment_time'){//检查req.body.value是否非法
				
			}else{
				req.body.value = 'article_comment_time'//req.body.value非法
			}
			global_callback(null, 'success')	//当前流程结束
		}],
		select_article : ['check_body_data',function(doing_res,global_callback){
			var value = req.body.value//最新文章还是最新评论
			var time_sql;
			if(req.body.time){//如果有时间 则根据时间来过滤上次查询过的数据
				time_sql = `and article.${value} < ${handler.escape(new Date(req.body.time))}`
			}else{
				time_sql = ''
			}

			var tag_sql;
			if(req.body.tag){//如果是查询板块的细分标签
				tag_sql = `And article.article_tag = ${handler.escape(req.body.tag)}`
			}else{
				tag_sql = ''
			}
			handler.exec({//根据req.body.value, req.body.plate, req.body.tag, req.body.time在数据库中查询
				res : res,
				callback : global_callback,
			    sql:  `SELECT article.*,${mysqlG.userBase} FROM article , user where article.article_plate = ? ${tag_sql} And article.article_user_id = user.user_id  ${time_sql} ORDER BY article.${value} desc LIMIT ${globalVar.limit}`,
			    params: [req.body.plate],
			    success:  result => {
						/* ******************************************** 先定义需要异步的函数*/
						function abc(callback){//先定义需要异步的函数
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
						/* ******************************************** 先定义需要异步的函数*/
						if(!result[0]){//如果数据库中的结果是零
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

