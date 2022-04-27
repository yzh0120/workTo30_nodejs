/* 
	 前端提交上的数据{
	 }
	 */
module.exports = function(req,res,handler,async,fs){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
		check_body_data : [function(global_callback){
			handler.selectArr({//检查权限
				res : res,
				callback : global_callback,
				sqlArr: ['select article_id from article where article_id = ?','select user.user_super_admin,article.article_user_id from user,article where user_id = ? and article.article_id = ?'],
				paramsArr: [[req.body.articleId],[req.headers.authorization,req.body.articleId]],
				success: selectArrResult => {
					result1 = selectArrResult[0]//文章是否存在
					result2 = selectArrResult[1]//文章的作者是否是req.headers.authorization
					if(result1[0] && (result2[0].article_user_id == req.headers.authorization || result2[0].user_super_admin == 1)){
						global_callback(null,'success')
					}else{
						res.send('err')
						global_callback('err')	
					}
				}
			})
		}],
		/* *****************************************判断评论的用户是否被禁言或者封号 */
		compute_stop : ['check_body_data',function(doing_res,global_callback){
			handler.selectArr({//检测用户是否被封禁
			res : res,
			callback : global_callback,
			 sqlArr: [`select admin_stop_time from admin_stop where admin_stop_user_id = ? `],
			 paramsArr: [[req.headers.authorization]],
			 success: selectArrResult => {
				 if(selectArrResult[0][0]){
					 /* 有封禁记录*/
					if(selectArrResult[0][0].admin_stop_time-new Date()>0){/* 未到解封时间 */
						res.send({
							admin_stop : selectArrResult[0][0].admin_stop_time
						})
						global_callback('err')
					}else{//到了解封时间
						global_callback(null,{
							real_mo_publish :true,
							del_admin_stop : true
						})
						
					}
				 }else{//没有封禁记录
					 global_callback(null,{
					 	real_mo_publish :true
					 })
				 }
			 }
			})
			/* *************************************** */
			
		}],
		/* *****************************************删除admin_stop表中的记录 */
		del_admin_stop:['compute_stop',function(doing_res,global_callback){
			if(!doing_res.compute_stop.del_admin_stop){
				global_callback(null,'over')
				return;
			}
			handler.transaction({//删除admin_stop表中的记录
				res : res,
				callback : global_callback,
			 sqlArr: [`DELETE FROM admin_stop WHERE admin_stop_user_id = ?`],
			 paramsArr: [[req.headers.authorization]],
			 success: result => {
			 }
			})
		}],
		/* *****************************************修改文章*/
		real_mo_publish : ['compute_stop',function(doing_res,global_callback){
			if(!doing_res.compute_stop.real_mo_publish){
				global_callback(null,'over')
				return;
			}
			// 文章发布时间
			var article_publish_time = new Date()
			//////////////////////////////////////////////////////////////formatDate(new Date())
			async.auto({
				base:function(callback){
					handler.exec({//根据文章id查询文章path
						res : res,
						callback : callback,
					 sql: 'select article_content from article where article_id = ?',
					 params: [req.body.articleId],
					 success: result => {
						 callback(null, result[0].article_content)	
					 }
					})	
				},
				a : function(callback){// 将文章插入到article
					handler.transaction({
						res : res,
						callback : callback,
					 sqlArr: ['UPDATE article SET article_title = ?,article_publish_time = ? ,article_plate=?,article_tag=? WHERE article_id = ?'],
					 paramsArr: [[req.body.title,article_publish_time,req.body.finalValue[0],req.body.finalValue[1],req.body.articleId]],
					 success: result => {
						callback(null, "success")	
					 }
					})
					//////////////////////////////////////////////
				},
				b : ['base',function(autoRes,callback){//根据文章path将修改的文章写入磁盘
					var tempPath = autoRes.base
					fs.writeFile(autoRes.base, req.body.editorContent,  function(err) {
						if (err) {
						    return callback('异步错误');		
						}
						callback(null, 'good')	
						
					})
				}]
			},function(error, asyncRes){
				
				if(error){
					global_callback('err')
					return;
				}
				res.send('success')
				global_callback(null,'success')
				
			})
		}]
		
	},function(err, async_global_res){
		if(err){
			
			return;
		}	
			
	})
}

