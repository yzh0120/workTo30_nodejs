/* 
	 前端提交上的数据{
		req.body.articleId : 如果有文章id 说明是从竞标也进入的
	 }
	 */
module.exports = function(req,res,handler,async,fromBidding){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
		check_body_data : [function(global_callback){
			global_callback(null, 'success')	
		}],
		select_article : ['check_body_data',function(doing_res,global_callback){
			handler.exec({
				res : res,
				callback : global_callback,
				// `SELECT article.*,user.user_name,user.user_img,user.user_gold,user.user_lv FROM article LEFT JOIN user ON article.article_user_id = user.user_id ORDER BY article.${value} desc LIMIT 10`
			    sql: `select * from bidding where bidding_type = ? ORDER BY bidding_price desc LIMIT 5`,
			    params: [req.body.bidding_type],
			    success:  result => {
						/* ******************************************** 先定义需要异步的函数*/
						function abc(callback){
						 	var itemArr = []
						 	for(let j=0;j<result.length;j++){
								console.log(result[j],j,'获取竞标')
								itemArr.push(
									function(callback){
										handler.exec({//查询文章标题
											res : res,
											callback : callback,
										 sql: 'select article_title from article where article_id = ?',
										 params: [result[j].bidding_article_id],
										 success: resA => {
											 if(resA[0]){
												result[j].tit = resA[0].article_title
											 }else{
											 }
											callback(null,j)
										 }
										})
									}
								)	
						 	}
						 	return itemArr;
						 }
						/* ******************************************** 先定义需要异步的函数*/
						if(!result[0]){//如果数据库中的结果是零(已经对查询数据库结果判断是否为空)
							res.send({result : []})
							global_callback(null,'success')
							return;
						}
						async.parallel(//并行无关联 asyncRes等于callback(null,value)的数组	 
							abc()
						,function(error, asyncRes){
							if(error){
								res.send('err')
								global_callback('err')
								return ;
							}
							/* ************************************************ */
							if(req.body.articleId){/* 如果有articleId则是在竞标页面*/
								handler.exec({
									res : res,
									callback : global_callback,
								 sql: 'select bidding_price from bidding where bidding_article_id = ? and bidding_type = ?',
								 params: [req.body.articleId,req.body.bidding_type],
								 success: resFinally => {
									 if(resFinally[0]){/* 如果用户有文章在竞标中*/
										 if(fromBidding == 'fromBidding'){//fromBidding是指点击竞标后的计算
											handler.exec({/*此查询是用户刚刚竞标了文章 更新前端金币 */
											res : res,
											callback : global_callback,
											  sql: `select user_gold from user where user_id = ?`,
											  params: [req.headers.authorization],
											  success: resultQuery => {
												  // console.log(req.body.bidding_type,resultQuery[0].user_gold,'-------------------------')
											 	res.send({
											 		user_gold : resultQuery[0].user_gold,
													/* 用户在竞标中的文章的价值 */
													bidding_price:resFinally[0].bidding_price,
													/* 五个首页锦标 */
													result:result
											 			})
											  }
											 })
										 }else{
											 res.send({
												bidding_price:resFinally[0].bidding_price,
												result:result
											 })
										 }
									 }else{/* 如果用户没有文章在竞标中*/
										 res.send({
										 	bidding_price:0,
										 	result:result
										 })
									 }
									
								 }
								})
							}else{/* 如果没有articleId则是在首页获取竞标 */
								res.send({
									result:result
								})
							}
							/* ************************************************ */
							global_callback(null,"success")
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

