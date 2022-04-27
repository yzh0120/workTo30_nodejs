/* 
	 前端提交上的数据{
		req.body.articleId : 删除的文章id
		req.body.article_content : 文章在磁盘的路径
		req.body.imgsSrc : 文章图片的路径
	 }
	 */
module.exports = function(req,res,fs,path,handler,async,articleImgsLog,ipObj){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
	
		check_body_data : [function(global_callback){
			handler.selectArr({//查询用户权限
				res : res,
				callback : global_callback,
				sqlArr: ['select article_id from article where article_id = ?','select user_super_admin from user where user_id = ?'],
				paramsArr: [[req.body.articleId],[req.headers.authorization]],
				success: selectArrResult => {
					result0 = selectArrResult[0]
					result1 = selectArrResult[1]
					if(result0[0] && result1[0].user_super_admin == 1){
						global_callback(null,'success')
					}else{
						res.send('err')
						global_callback('err')
					}
					
				}
			})	
		}],
		select_article : ['check_body_data',function(doing_res,global_callback){
			/* ******************************************************* */
			function abc(callback){
				var itemArr = []
				///////////////////////////
				itemArr.push(
					function(callback){
						handler.transaction({//根据文章id删除数据库的文章
							res : res,
							callback : callback,
						 sqlArr: ['DELETE FROM article WHERE article_id = ?'],
						 paramsArr: [[req.body.articleId]],
						 success: result => {
							callback(null, 'success')
						 }
						})
					}
				)
				////////////////////////////
				itemArr.push(
					function(callback){//根据文章在磁盘的路径删除文章
						fs.unlink(path.join(req.body.article_content), function (err) {
						   if (err) {
							articleImgsLog.info('删除文章txt失败@:',req.body.article_content,'错误原因@:',err)
						   }
							callback(null, 'success')	
						});
					}
				)
				//////////////////////////////
				var imgsSrcArr = req.body.imgsSrc
				for(let i=0;i<imgsSrcArr.length;i++){
					itemArr.push(
						function(callback){//删除文章的图片
							// imgsSrcArr[i] = imgsSrcArr[i].replace("http://localhost","public"); 
							imgsSrcArr[i] = imgsSrcArr[i].replace(ipObj.address,"public"); 
							console.log(imgsSrcArr[i],'imgsSrcArr[i]')
							fs.unlink(path.join(imgsSrcArr[i]), function (err) {
							   if (err) {
								articleImgsLog.info('删除文章头像失败@:',imgsSrcArr[i],'错误原因@:',err)
							   }
								callback(null, 'success')	
							});
						}
					)
				}
				return itemArr;
			}
			/* 异步*************************************** */
			async.series(
				abc()
			,function(err, asyncRes){
				if(err){
					console.log('err: ', err);
					global_callback('err')
					return;
				}
				res.send('del_success')
				global_callback(null,'success')
				
			})
			/* ************************************************************* */
		}]
	},function(err, async_global_res){
		if(err){
			
			return;
		}	
			
	})
}

