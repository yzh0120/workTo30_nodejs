	/* 
	 前端提交上的数据{
		req.body.user_name : 用户修改的名字
	 }
	 */
module.exports = function(req,res,handler,async){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
		check_body_data : [function(global_callback){
			global_callback(null, 'success')	
		}],
		select_article : ['check_body_data',function(doing_res,global_callback){
			handler.transaction({
				res : res,
				callback : global_callback,
			 sqlArr: ['UPDATE user SET user_name = ? WHERE user_id = ?'],
			 paramsArr: [[req.body.user_name, req.headers.authorization]],
			 success: result => {
				res.send(req.body.user_name)
				global_callback(null,"success")
			 }
			})
		}]
	},function(err, async_global_res){
		if(err){
			
			return;
		}	
		
	})
}

