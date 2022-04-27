/* 
	 前端提交上的数据{
		req.body.articleId :文章id
		req.body.time : list最后一个item的时间
	 }
	 */
module.exports = function(req,res,handler,async,mysqlG,globalVar){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
	
		check_body_data : [function(global_callback){
			global_callback(null,"success")//当前流程结束
		}],
		select_article : ['check_body_data',function(doing_res,global_callback){

			var time_sql;
			if(req.body.time){//如果有时间 则根据时间来过滤上次查询过的数据
				time_sql = `and get_reward_time < ${handler.escape(new Date(req.body.time))}`
			}else{
				time_sql = ''
			}
			handler.exec({//根据文章查询文章有多少打赏
			res : res,
			callback : global_callback,
			 sql: `select get_reward_time,get_reward_num,${mysqlG.userBase} from get_reward,user where get_reward_user_id = user_id And get_reward_article_id = ? ${time_sql} ORDER BY get_reward_time desc LIMIT ${globalVar.limit}`,
			 params: [req.body.articleId],
			 success: result => {
				if(!result[0]){//没有数据
					res.send("no_data")
					global_callback('err')//后面的流程不执行
					return;
				}else if(result.length < `${globalVar.limit}`){
					// 当结果小于10条的时候无需继续请求
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
				global_callback(null,"success")//当前流程结束
			 }
			})
		}]
	},function(err, async_global_res){
		if(err){
			
			return;
		}	
			
	})
}

