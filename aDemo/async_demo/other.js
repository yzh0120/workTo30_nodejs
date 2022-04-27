series//

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
				/////////////////////////////////////////////////////////
				if(result[0]){//数据库没有数据
					res.send("no_data")
				}else{
					//async.series( 串行无关联 asyncRes等于callback(null,value)的数组	 
					//async.waterfall( 串行有关联 asyncRes等于最后一个callback(null,value)的value 
					//async.parallel( 并行无关联 asyncRes等于callback(null,value)的数组	 
						abc()
					,function(err, asyncRes){
						if(err){
							return;
						}
						if(asyncRes.length < 10){
							res.send({// 当结果小于10条的时候无需继续请求
								result : asyncRes,
								finished : true
							})
						}else{
							res.send( asyncRes)
						}
					})
				}