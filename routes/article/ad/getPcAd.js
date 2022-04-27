let arr = [
	{	
		jump_src : 'http://baidu.com',
		img : 'https://s1.ax1x.com/2020/06/25/N0PXqK.jpg'
	},{
		jump_src : 'http://baidu.com',
		img : 'https://s1.ax1x.com/2020/06/25/N0PLKx.jpg'
	},{
		jump_src : 'http://baidu.com',
		img : 'https://s1.ax1x.com/2020/06/25/N0POr6.jpg'
	}
]
module.exports = function(req,res,async){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
		check_body_data : [function(global_callback){
			global_callback(null, 'success')	
		}],
		select_article : ['check_body_data',function(doing_res,global_callback){
			res.send(arr)
			global_callback(null, 'success')
		}]
	},function(err, async_global_res){
		if(err){
			console.log('-------------------------错误-------------------------');
			return;
		}	
		console.log(async_global_res,'-------------------------成功-------------------------');		
	})
}
