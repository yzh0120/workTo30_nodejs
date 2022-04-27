/*
	 前端提交上的数据{
		req.body.folAndFans : 判断是根据follow还是fans排序
		req.body.otherUserId : 判断是否是看其他人的关注或者粉丝
		req.body.time : list最后一个item的时间
	 }
*/
module.exports = function(req,res,handler,async,mysqlG,globalVar){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
		check_body_data : [function(global_callback){
			if(req.body.folAndFans == 'follow' || req.body.folAndFans == 'fans'){
				
			}else{
				req.body.folAndFans = 'follow'//req.body.folAndFans非法
			}
			var select_user_id = req.headers.authorization;
			if(req.body.otherUserId){
				select_user_id = req.body.otherUserId
			}
			handler.exec({
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
			if(req.body.folAndFans != 'follow'){
				global_callback(null, 'success')
				return;
			}

			var time_sql;
			if(req.body.time){//如果有时间 则根据时间来过滤上次查询过的数据
				time_sql = `and follow_time < ${handler.escape(new Date(req.body.time))}`
			}else{
				time_sql = ''
			}
			handler.exec({//查询个人的关注
				res : res,
				callback : global_callback,
			 sql: `select ${mysqlG.userBase},temp.follow_time from(select follow_befollowed_user_id,follow_time from follow where follow_user_id = ? ${time_sql} ORDER BY follow_time desc LIMIT  ${globalVar.limit})AS temp ,user where user_id = temp.follow_befollowed_user_id`,
			 params: [doing_res.check_body_data.userId],
			 success: result => {
				 if(!result[0]){//如果数据库中的结果是零
				 	res.send("no_data")
				 	global_callback('err')//后面的流程不执行 
				 	return;
				 }
				if(result.length < `${globalVar.limit}`){// 当结果小于10条的时候无需继续请求
					res.send({
						result : result,
						finished : true
					})
				}else{
					res.send({
						ok:true,
						result : result
					})
				}
				global_callback(null,'success')//当前流程结束 
			 }
			})
		}],
		select_col : ['check_body_data',function(doing_res,global_callback){
			if(req.body.folAndFans != 'fans'){
				global_callback(null, 'success')
				return;
			}

			var time_sql;
			if(req.body.time){//如果有时间 则根据时间来过滤上次查询过的数据
				time_sql = `and follow_time < ${handler.escape(new Date(req.body.time))}`
			}else{
				time_sql = ''
			}
			handler.exec({//查询个人的粉丝
				res : res,
				callback : global_callback,
			 sql: `select ${mysqlG.userBase},temp.follow_time from(select follow_user_id,follow_time from follow where follow_befollowed_user_id = ? ${time_sql} ORDER BY follow_time desc LIMIT  ${globalVar.limit})AS temp ,user where user_id = follow_user_id`,
			 params: [doing_res.check_body_data.userId],
			 success: result => {
				if(!result[0]){//如果数据库中的结果是零
				 	res.send("no_data")
				 	global_callback('err')//后面的流程不执行 
				 	return;
				 }
				if(result.length < `${globalVar.limit}`){// 当结果小于10条的时候无需继续请求
					res.send({
						result : result,
						finished : true
					})
				}else{
					res.send({
						ok:true,
						result : result
					})
				}
				global_callback(null,'success')//当前流程结束 
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

