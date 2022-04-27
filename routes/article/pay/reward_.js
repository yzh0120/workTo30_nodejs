/* 
	 前端提交上的数据{
		req.body.articleId : 打赏的文章id
		req.body.articleUserId : 打赏的用户
		req.body.num : 打赏的数量
	 }
*/
module.exports = function(req,res,handler,redis,io,async){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
		check_body_data : [function(global_callback){
			global_callback(null, 'success')	//当前流程结束
		}],
		choose : ['check_body_data',function(doing_res,global_callback){
			handler.exec({//判断该用户曾经是否打赏过该主播
				res : res,
				callback : global_callback,
				sql: `select get_reward_user_id from get_reward where get_reward_user_id = ? And get_reward_article_id = ?`,
				params: [req.headers.authorization,req.body.articleId],
				success: result => {
					if(result[0]){//曾经有打赏的记录  更新
						global_callback(null,{
							has_reward : true
						})
					}else{//没有打赏的记录  插入
						global_callback(null,{
							no_reward : true
						})
					}
				}
			})
		}],
		/* ***********************************当前用户之前打赏过此片文章 */
		has_reward : ['choose',function(doing_res,global_callback){
			if(!doing_res.choose.has_reward){
				global_callback(null,'success')
				return;
			}
			handler.transaction({//当前用户之前打赏过此片文章
			res : res,
			callback : global_callback,
			 sqlArr: ['UPDATE user SET user_gold = user_gold - ? WHERE user_id = ?','UPDATE user SET user_gold=user_gold + ? WHERE user_id = ?','UPDATE article SET article_gold=article_gold + ? WHERE article_id = ?','INSERT INTO info(info_user_id,info_is_reward,info_article_id,info_time,info_reward_num) VALUES (?,?,?,?,?)','UPDATE get_reward SET get_reward_num = get_reward_num + ? , get_reward_time = ?  WHERE get_reward_user_id = ? And get_reward_article_id = ?','UPDATE user SET user_unread = user_unread + 1 WHERE user_id = ?'],   
			 paramsArr: [[req.body.num,req.headers.authorization],[req.body.num,req.body.articleUserId],[req.body.num,req.body.articleId],[req.body.articleUserId,req.headers.authorization,req.body.articleId,new Date(),req.body.num],[req.body.num,new Date(),req.headers.authorization,req.body.articleId],[req.body.articleUserId]],
			 success: result => {
				 handler.exec({//查询打赏人的金币数量
				 res : res,
				 callback : global_callback,
				  sql: `select user_gold from user where user_id = ?`,
				  params: [req.headers.authorization],
				  success: result => {
				 	res.send({
						user_gold : result[0].user_gold
					})
					global_callback(null,'success')
				  }
				 })
				redis.get(req.body.articleUserId, function(err,result){
					if (err) {return;}
					if (io.sockets.connected[result]) {
						io.sockets.connected[result].emit('newInfo','reward');
					}
				})
			 }
			})
		}],
		/* ***************************************当前用户之前没有打赏过此片文章 */
		no_reward : ['choose',function(doing_res,global_callback){
			if(!doing_res.choose.no_reward){
				global_callback(null,'success')
				return;
			}
			handler.transaction({//当前用户之前没有打赏过此片文章
			res : res,
			callback : global_callback,
			 sqlArr: ['UPDATE user SET user_gold = user_gold - ? WHERE user_id = ?','UPDATE user SET user_gold=user_gold + ? WHERE user_id = ?','UPDATE article SET article_gold=article_gold + ? WHERE article_id = ?','INSERT INTO info(info_user_id,info_is_reward,info_article_id,info_time,info_reward_num) VALUES (?,?,?,?,?)','INSERT INTO get_reward( get_reward_num , get_reward_time, get_reward_user_id, get_reward_article_id ) VALUES (?,?,?,?)','UPDATE user SET user_unread = user_unread + 1 WHERE user_id = ?'],   
			 paramsArr: [[req.body.num,req.headers.authorization],[req.body.num,req.body.articleUserId],[req.body.num,req.body.articleId],[req.body.articleUserId,req.headers.authorization,req.body.articleId,new Date(),req.body.num],[req.body.num,new Date(),req.headers.authorization,req.body.articleId],[req.body.articleUserId]],
			 success: result => {
				 handler.exec({//查询打赏人的金币数量
					 res : res,
					 callback : global_callback,
				  sql: `select user_gold from user where user_id = ?`,
				  params: [req.headers.authorization],
				  success: result => {
				 	res.send({
						user_gold : result[0].user_gold
					})
					global_callback(null,'success')
				  }
				 })
				redis.get(req.body.articleUserId, function(err,result){
					if (err) {return;}
					if (io.sockets.connected[result]) {
						io.sockets.connected[result].emit('newInfo','reward');
					}
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

