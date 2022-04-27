/* 
	 前端提交上的数据{
		req.body.userId : 需要查看个人信息的用户id
	 }
	 */
module.exports = function(req,res,handler,mysqlG,async){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
	
		check_body_data : [function(global_callback){
			global_callback(null, 'success')	
		}],
		select_article : ['check_body_data',function(doing_res,global_callback){
			handler.exec({
				res : res,
				callback : global_callback,
			 sql:`select ${mysqlG.userInfo} from user where user_id = ?`,
			 params: [req.body.userId],
			 success: result => {
				if(result[0]){//数据库有此id信息
					res.send(result[0])
				}else{//数据库没有此id信息
					res.send('No_information')
				}
				global_callback(null,'success')
			 }
			})
		}]
	},function(err, async_global_res){
		if(err){
			
			return;
		}	
		
	})
}

