/* 前端提交的数据

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
				sql: `select ${mysqlG.userInfo} from user where user_id = ?`,
				params: [req.headers.authorization],
				success: result => {
				 console.log(req.headers.authorization,'req.headers.authorization')
					if(result[0]){
						res.send(result[0])
					}else{
						res.send('No_information')
					}
					global_callback(null,'success')
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

