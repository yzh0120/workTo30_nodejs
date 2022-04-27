function formatDate(date){
        var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            // var h = date.getHours();
            // var minute = date.getMinutes();
            // minute = minute < 10 ? ('0' + minute) : minute;
            // var second= date.getSeconds();
            // second = second < 10 ? ('0' + second) : second;
            return y + '-' + m + '-' + d;
}
/* 
	 前端提交上的数据{
		
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
			 sql: 'select user_reTime_last,user_reTime_log from user where user_id = ?',
			 params: [req.headers.authorization],
			 success: result => {
				 if(!result[0]){
					 global_callback(null,'success')
					 return;
				 }
				var timeLog = result[0].user_reTime_log		//用户签到次数	
				var lastDay = new Date(formatDate(result[0].user_reTime_last))     //用户最后一次签到的时间
				var nowDay = new Date(formatDate(new Date()));//现在时间
				//var log_date = formatDate(new Date(nowDay.setDate(nowDay.getDate()+1)))//如果签到成功写入的时间
				var timeRes = (nowDay - lastDay) / (1000 * 60 * 60 * 24)//相差几天
				console.log(timeRes,lastDay,'lastDay',nowDay)
				if( timeRes== 1){ console.log('等于一天')
					handler.transaction({
						res : res,
						callback : global_callback,
					 sqlArr: ['UPDATE user SET user_gold= user_gold+?,user_lv= user_lv+? ,user_reTime_last = ?,user_reTime_log = user_reTime_log+1 WHERE user_id = ?'],
					 paramsArr: [[((timeLog+1)*10 +10),((timeLog+1)*100 +100),nowDay,req.headers.authorization]],
					 success: result => {
						 handler.exec({
							 res : res,
							 callback : global_callback,
						  sql: `select ${mysqlG.userInfo} from user where user_id = ?`,
						  params: [req.headers.authorization],
						  success: result => {
							res.send(result[0])
							global_callback(null,'success')
						  }
							  
						 }) 
					 }
					})	
				}else if(timeRes > 1){ console.log('大于一天')
					handler.transaction({
						res : res,
						callback : global_callback,
					 sqlArr: ['UPDATE user SET user_gold= user_gold+?,user_lv= user_lv+?,user_reTime_last = ?,user_reTime_log = 1 WHERE user_id = ?'],
					 paramsArr: [[(10 +10),(100 +100),nowDay,req.headers.authorization]],
					 success: result => {
						handler.exec({
							res : res,
							callback : global_callback,
						 sql: `select ${mysqlG.userInfo} from user where user_id = ?`,
						 params: [req.headers.authorization],
						 success: result => {
							res.send(result[0])
							global_callback(null,'success')
						 }
							  
						})
					 }
					})
				}else{// 重复签到				
					res.send('repeat_check_in')
					 global_callback(null,'success')
				}
			 }
			})
		}]
	},function(err, async_global_res){
		if(err){
			
			return;
		}	
		
	})
}

