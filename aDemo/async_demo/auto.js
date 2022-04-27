module.exports = function(req,res,fs,path,handler,async,mysqlG,globalVar){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
		check_body_data : [function(global_callback){
			global_callback(null, 'success')	
		}],
		select_article : ['check_body_data',function(doing_res,global_callback){
			handler.exec({
				res : res,
				callback : global_callback,
				// `SELECT article.*,user.user_name,user.user_img,user.user_gold,user.user_lv FROM article LEFT JOIN user ON article.article_user_id = user.user_id ORDER BY article.${value} desc LIMIT 10`
			    sql: `sELECT article.*,${mysqlG.userBase} FROM article , user where article.article_user_id = user.user_id ORDER BY article.${value} desc LIMIT ${globalVar.limit}`,
			    params: [],
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
											callback(null, result[i])	 
										});
									}
								)
							}
							return itemArr;
						}
						/* ******************************************** 先定义需要异步的函数*/
						if(!result[0]){//如果数据库中的结果是零(已经对查询数据库结果判断是否为空)
							res.send("no_data")
							global_callback(null,'success')
							return;
						}
						async.parallel(//并行无关联 asyncRes等于callback(null,value)的数组	 
							abc()
						,function(error, asyncRes){
							if(error){
								res.send('err')
								global_callback(null,'success')
								return ;
							}
							if(asyncRes.length < `${globalVar.limit}`){// 当结果小于10条的时候无需继续请求
								res.send({
									result : asyncRes,
									finished : true
								})
							}else{
								res.send( asyncRes)
							}
							global_callback(null,"success")
						})
						
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

