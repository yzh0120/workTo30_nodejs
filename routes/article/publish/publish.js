/* 
	 前端提交上的数据{
		 req.body.title : 文章标题
		 req.body.editorContent : 文章内容
	 }
	 */
module.exports = function(req,res,fs,path,handler,async,redis,globalVar){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
	
		check_body_data : [function(global_callback){
			/* 判断目录是否存在 */
			fs.stat(path.join(`article/${req.headers.authorization}`), function (err, stat) {
				//这里不需要err 因为在else里面已经包含了
			  if (stat && stat.isDirectory()) {//isDirectory() isFile()
				global_callback(null, 'success')
			    // console.log('目录存在');
			  } else {
			    // console.log('目录不存在');
				/* 创建目录*/
				fs.mkdir(path.join(`article/${req.headers.authorization}`), function(err){
				  if(err){
						global_callback('err')
				     // console.log(err);
				     return;
				   }
					global_callback(null, 'success')
					// console.log('新文件夹创建成功!!');
				});
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
							check_user_allow_pub :true,
							del_admin_stop : true
						})
						
					}
				 }else{//没有封禁记录
					 global_callback(null,{
					 	check_user_allow_pub :true
					 })
				 }
			 }
			})			
		}],
		/* *****************************************删除admin_stop表中的记录 */
		del_admin_stop:['compute_stop',function(doing_res,global_callback){
			if(!doing_res.compute_stop.del_admin_stop){
				global_callback(null,'success')
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
		/* *****************************************检查用户是否频频发文章*/
		check_user_allow_pub : ['compute_stop',function(doing_res,global_callback){
			if(!doing_res.compute_stop.check_user_allow_pub){
				global_callback(null,'success')
				return;
			}
			handler.exec({//用户是否允许发表文章*
			res : res,
			callback : global_callback,
			 sql: 'select user_allow_pub from user where user_id = ?',
			 params: [req.headers.authorization],
			 success: result => {
				if(result[0] && result[0].user_allow_pub){
					global_callback(null,{
						real_publish : true
					})
				}else{
					res.send('no_allow_pub')
					global_callback(null,'success')
				}
			 }
			})
		}],
		/* ******************************************在磁盘和数据库写入文章 */
		real_publish : ['check_user_allow_pub',function(doing_res,global_callback){
			if(!doing_res.check_user_allow_pub.real_publish){
				global_callback(null,'success')
				return;
			}
			// 定义文件名称
			var name =  new Date().getTime() + ".txt"
			// 定义文章路径		
			var article_Path = path.join(`article/${req.headers.authorization}`,name)
			// 文章发布时间
			var article_publish_time = new Date()
			//////////////////////////////////////////////////////////////formatDate(new Date())
			async.parallel({
				a : function(callback){/////////////////////将文章插入到article表
					handler.transaction({
						res : res,
						callback : callback,
					 sqlArr: ['UPDATE user SET user_article_count = user_article_count + 1 WHERE user_id = ?','INSERT INTO article(article_title,article_content,article_publish_time,article_user_id,article_plate,article_tag,article_comment_time) VALUES (?,?,?,?,?,?,?)'],
					 paramsArr: [[req.headers.authorization],[req.body.title,article_Path,article_publish_time,req.headers.authorization,req.body.finalValue[0],req.body.finalValue[1],article_publish_time]],
					 success: result => {
						callback(null, result[1].insertId)
					 }
					})
				},
				b : function(callback){//写进文件
					fs.writeFile(article_Path, req.body.editorContent,  function(err) {
						if (err) {
							res.send(500)
						    return callback('err');		
						}
						callback(null, 'success')	
					})
				}
			},function(error, asyncRes){
				if(error){
					res.send('err')
					global_callback(null,'success')
					return;
					}
					/*  给新文章自动添加评论*/
					// handler.transaction({
					//  sqlArr: ['INSERT INTO comment(comment_article_id,comment_user_id,comment_content,comment_time) VALUES (?,?,?,?)'],
					//  paramsArr: [[asyncRes.a,29,'作者加油,再接再厉哦',new Date()]],
					//  success: result => {
						
					//  },
					//  error : result => {
					// 	res.send(500)
					//  }
					// })
					/* 给作者设置定时器 */
					handler.transaction({
						res : res,
						callback : global_callback,
						sqlArr: ['UPDATE user SET user_allow_pub = 0 WHERE user_id = ?'],
						paramsArr: [[req.headers.authorization]],
						success: result => {
						 /* 发布文章的间隔*/
						 let mysqlKey = 'mysql_' + req.headers.authorization
						 redis.expire(mysqlKey, 'a',  `${globalVar.no_allow_pub}`,function(err,result){
								if (err) {return ;} 
								res.send('success')
						 })
						 /* 新文章标识*/
						 let newArticle = 'newArticle_' + asyncRes.a
						 redis.expire(newArticle, 'a',  `${globalVar.article_new}`,function(err,result){
								if (err) {return ;} 
												// res.send('success')
						 })
						 global_callback(null,'success')
						}
					})
					
			})
			/* *********************************************** */
		}]
		
	},function(err, async_global_res){
		if(err){
			
			return;
		}	
			
	})
}

