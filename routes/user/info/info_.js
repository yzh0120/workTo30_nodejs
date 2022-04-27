/*
	 前端提交上的数据{
		req.body.time : list最后一个item的时间
	 }
	 */
module.exports = function(req,res,handler,async,mysqlG,globalVar,info_is_reply_comment,info_is_reply_article,info_is_reward){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
		check_body_data : [function(global_callback){
			global_callback(null, 'success')	
		}],
		clear_user_info : ['check_body_data',function(doing_res,global_callback){
			handler.transaction({//清空这个人的消息
			res : res,
			callback : global_callback,
			 sqlArr: ['UPDATE user SET user_unread = 0 WHERE user_id = ?'],
			 paramsArr: [[req.headers.authorization]],
			 success: result => {
				global_callback()//当前流程结束 
			 }
			})
		}],
		select_info : ['check_body_data',function(doing_res,global_callback){
			var time_sql;
			if(req.body.time){//如果有时间 则根据时间来过滤上次查询过的数据
				time_sql = `and  info_time< ${handler.escape(new Date(req.body.time))}`
			}else{
				time_sql = ''
			}
			handler.exec({//查询个人消息
			res : res,
			callback : global_callback,
			 sql: `select * from info where info_user_id = ? ${time_sql} ORDER BY info_time desc LIMIT  ${globalVar.limit}`,
			 params: [req.headers.authorization],
			 success: result => {
				 /* 先定义一个需要异步的函数*/
				 /* *****************************************************/
					 function abc(callback){
						
						var itemArr = []
						for(let j=0;j<result.length;j++){
							if(result[j].info_is_reply_comment){//该消息属于回复评论的消息
								itemArr.push(info_is_reply_comment(callback,result[j],handler,res,mysqlG))
							}else if(result[j].info_is_reply_article){//该消息属于回复文章的消息
								itemArr.push(info_is_reply_article(callback,result[j],handler,res,mysqlG))
							}else if(result[j].info_is_reward){//该消息属于打赏文章的消息
								itemArr.push(info_is_reward(callback,result[j],handler,res,mysqlG))
							}
						}
						return itemArr;
					 }
					 /* *****************************************************/
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

