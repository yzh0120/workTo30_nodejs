module.exports = function(req,res,handler,async,mysqlG,report_comment_id,report_article_id){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
	/*
	 前端提交上的数据{
		
	 }
	 */
		check_body_data : [function(global_callback){
			handler.selectArr({
				res : res,
				callback : global_callback,
				sqlArr: ['select user.user_super_admin from user where user_id = ?'],
				paramsArr: [[req.headers.authorization],[req.headers.authorization]],
				success: selectArrResult => {
					result0 = selectArrResult[0]
					if( result0[0].user_super_admin == 1){
						global_callback(null,'success')
					}else{
						global_callback('err')
					}
				}
			})
		}],
		select_report : ['check_body_data',function(doing_res,global_callback){
			handler.exec({
				res : res,
				callback : global_callback,
				sql: `select * from report ORDER BY report_date desc LIMIT 1`,
				params: [],
				success: result => {
					/* *****************************先定义一个需要异步的函数************** */
					function abc(callback){
						var itemArr = []
						/* ***********************删除记录 */
						itemArr.push(function(callback){
							handler.transaction({
							 sqlArr: ['DELETE FROM report WHERE report_id = ?'],
							 paramsArr: [[result[0].report_id]],
							 success: delResult => {
								// console.log("删除--------------------------------------------",result[0])
								callback(null,'1')
							 },
							 error : result => {
								res.send(500)
								callback('err');
							 }
							})
						})
						/* ***********************删除记录 */
						//如果举报是评论 这里是回复作者评论的评论id
						if(result[0].report_comment_id != 0){
							itemArr.push(report_comment_id(callback,result[0],handler,res,mysqlG))
						}else{//举报的是文章
							itemArr.push(report_article_id(callback,result[0],handler,res,mysqlG))
						}
						
						return itemArr
					}
					/* *********************定义需要异步的函数********************** */
					if(!result[0]){
						console.log('1111111111')
						res.send("no_data")
						global_callback(null,'success');
						return;
					}
					async.series(
						abc()
					,function(error, asyncRes){
						if(error){
							console.log('111111111122222222222222')
							res.send('err')
							global_callback(null,'success');
							return
						}
						/* 发送举报信息 */
						console.log('111111111133333333333333333',asyncRes[1])
						res.send( asyncRes[1])
						global_callback(null,'success')
						
					})
					
					/* ************************************************ */
			
				}
			})
		}]
	},function(err, async_global_res){
		if(err){
			console.log('-------------------------错误-------------------------');
			return;
		}	
		console.log(async_global_res,'-------------------------成功-------------------------');		
	})
}

