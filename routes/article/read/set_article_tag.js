let arr = [
	'article_is_good'
]
/* 
	 前端提交上的数据{
		req.body.key : 文章的某个字段
		req.body.value : 文章的某个字段的值
		req.body.articleId : 文章id
	 }
	 */
module.exports = function(req,res,handler,async){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
	
		check_body_data : [function(global_callback){
			handler.selectArr({//查询用户是否有权限
				res : res,
				callback : global_callback,
				sqlArr: ['select user_super_admin from user where user_id = ?'],
				paramsArr: [[req.headers.authorization]],
				success: selectArrResult => {
					result1 = selectArrResult[0]
					if(result1[0] && result1[0].user_super_admin == 1){
						global_callback(null,"success")
					}else{
						res.send('no_power')
						global_callback("err")
						return;
					}
				}
			})
		}],
		select_article : ['check_body_data',function(doing_res,global_callback){
			let yes = false;
			for(let item of arr){
				if(item == req.body.key){
					yes = true
				}
			}
			if(yes){
				handler.transaction({// 修改其他用户标签 
				res : res,
				callback : global_callback,
				 sqlArr: [`UPDATE article SET ${req.body.key} = ${req.body.value} WHERE article_id = ?`],
				 paramsArr: [[req.body.articleId]],
				 success: result => {						
						res.send({
							key : req.body.key,
							value : req.body.value
						})
						global_callback(null,'success')
				 }
				})
			}else{
				global_callback('err')
			}
			
		}]
	},function(err, async_global_res){
		if(err){
			
			return;
		}	
			
	})
}

