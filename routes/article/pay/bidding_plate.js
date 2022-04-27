/* 
	 前端提交上的数据{
		req.body.articleId : 文章id
		req.body.num : 竞标数量
		req.body.bidding_type : 竞标的文章类型
	 }
	 */
module.exports = function(req,res,handler,getNowBiddingPlate,async){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
		check_body_data : [function(global_callback){
			handler.selectArr({//查询文章id和用户id是否匹配
				res : res,
				callback : global_callback,
				sqlArr: ['select article_id from article where article_id = ? and article_user_id=?'],
				paramsArr: [[req.body.articleId,req.headers.authorization]],
				success: selectArrResult => {
					result1 = selectArrResult[0]
					if(result1[0]){//匹配成功
						global_callback(null,'success')
					}else{
						res.send('err')
						global_callback('err')
						return;
					}
				}
			})
		}],
		select_article : ['check_body_data',function(doing_res,global_callback){
			
			handler.exec({// 文章id和用户id匹配成功
			res : res,
			callback : global_callback,
			 sql: 'select * from bidding where bidding_article_id = ? and bidding_type = ?',
			 params: [req.body.articleId,req.body.bidding_type],
			 success: result => {
				if(result[0]){
					handler.transaction({// 之前已经有竞标记录 更新语句
						res : res,
						callback : global_callback,
					 sqlArr: ['UPDATE bidding SET bidding_price = bidding_price + ? WHERE bidding_article_id = ? and bidding_type = ?','UPDATE user SET user_gold=user_gold - ? WHERE user_id = ?'],
					 paramsArr: [[req.body.num,req.body.articleId,req.body.bidding_type],[req.body.num,req.headers.authorization]],
					 success: result => {
						getNowBiddingPlate(req,res,handler,async,'fromBidding')
						global_callback(null,'success')
					 }
					})
				}else{
					handler.transaction({// 之前没有有竞标记录 插入语句
						res : res,
						callback : global_callback,
					 sqlArr: ['INSERT INTO bidding(bidding_article_id,bidding_price,bidding_type) VALUES (?,?,?)','UPDATE user SET user_gold=user_gold - ? WHERE user_id = ?'],
					 paramsArr: [[req.body.articleId,req.body.num,req.body.bidding_type],[req.body.num,req.headers.authorization]],
					 success: result => {
						getNowBiddingPlate(req,res,handler,async,'fromBidding')
						global_callback(null,'success')
					 },
					})
				}
			 }
			})
		}]
	},function(err, async_global_res){
		if(err){
			
			return;
		}	
			
	})
}

