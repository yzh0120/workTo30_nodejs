module.exports = function(req,res,handler,formidable,fs,path,headPorLog,ipObj,async){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
		check_body_data : [function(global_callback){
			/* 判断目录是否存在 */
			fs.stat(path.join(`public/headPor/${req.headers.authorization}`), function (err, stat) {
			  //这里不需要err 因为在else里面已经包含了
			  if (stat && stat.isDirectory()) {//isDirectory() isFile()
				global_callback(null, 'success')
			    console.log('目录存在');
			  } else {
			    console.log('目录不存在');
				/* 创建目录*/
				fs.mkdir(path.join(`public/headPor/${req.headers.authorization}`), function(err){
				  if(err){
						global_callback('err')
				     console.log(err);
				     return;
				   }
					global_callback(null, 'success')
					console.log('新文件夹创建成功!!');
				});
			  }
			  // console.log(stat)
			})
			/* ******************************************* */
		}],
		save_head_por : ['check_body_data',function(doing_res,global_callback){
			var form = new formidable.IncomingForm();
			form.uploadDir = path.join("public/headPor")//设置文件上传存放地址（需要先把这个文件夹，在项目中建好）
			//执行里面的回调函数的时候，表单已经全部接收完毕了。
			form.parse(req, function(err, fields, files) {			
				var oldpath = files.file.path; //file是我们前端自定义的后台接受的名称；
				//因为formidable这个时候存在我们刚路径上的，只是一个path，还没有具体的名字，如：2.png这样的
				//   根据图片的文件名和扩展名定义新的路径由组成 files.file.name是文件的名称加上扩展名 //file是我们前端自定义的后台接受的名称；
				// var last_path = path.join("public/headPor",imgName);	
				var last_path = path.join(`public/headPor/${req.headers.authorization}`,`${new Date().getTime()}--${files.file.name}`)
				//改名
			    fs.rename(oldpath, last_path, function(err) { //把之前存的图片换成真的图片的完整路径
					if(err) {
						global_callback(null,'success')
						return ;
			        }
					global_callback(null,{
						fields : fields,
						update_del : true,
						last_path : last_path
					})
					
					
				})
			})
			/* ****************************************************************************************** */
		}],
		update_del:['save_head_por',function(doing_res,global_callback){
			if(!doing_res.save_head_por.update_del){
				global_callback(null,'success')
				return;
			}
			var return_path = doing_res.save_head_por.last_path.replace("public",ipObj.address); 
			var fields = doing_res.save_head_por.fields
			handler.transaction({
				res : res,
				callback : global_callback,
				sqlArr: ['UPDATE user SET user_img = ? WHERE user_id = ?'],
				paramsArr: [[return_path, req.headers.authorization]],
				success: result => {
				if(fields.oldHeadPort == `${ipObj.address}/default.jpg`){
					console.log('默认头像')
				}else{ 
					fields.oldHeadPort = fields.oldHeadPort.replace(ipObj.address,"public") 
					fs.unlink(path.join(fields.oldHeadPort), function (err) {
					   if (err) {
						headPorLog.info('删除原头像失败@:',fields.oldHeadPort,'错误原因@:',err)
						// console.log('积极急急急急急急急急急')
					   }
						res.send(return_path)
					})
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

