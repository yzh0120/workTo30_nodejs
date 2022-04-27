var formidable = require('formidable');  //上传图片处理的插件

module.exports = function(req,res,fs,path,async,ipObj){
	async.auto({//asyncRes等于每个属性的callback(null,value)的组成的对象
		check_body_data : [function(global_callback){
			/* 判断目录是否存在 */
			fs.stat(path.join(`public/articleImgs/${req.headers.authorization}`), function (err, stat) {
				//这里不需要err 因为在else里面已经包含了
			  if (stat && stat.isDirectory()) {//isDirectory() isFile()
				global_callback(null, 'success')
			    console.log('目录存在');
			  } else {
			    console.log('目录不存在');
				/* 创建目录*/
				fs.mkdir(path.join(`public/articleImgs/${req.headers.authorization}`), function(err){
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
		}],
		select_article : ['check_body_data',function(doing_res,global_callback){
			var form = new formidable.IncomingForm();
			form.uploadDir = path.join("public/articleImgs") //设置文件上传存放地址（需要先把这个文件夹，在项目中建好）
			form.parse(req, function(err, fields, files) {//执行里面的回调函数的时候，表单已经全部接收完毕了。
				//files.uploadImg.path是首先存在硬盘上的不带扩展名的无法识别的文件路径  oldpath: upload_7f84e5cbaa6fb7524786cd1036883dce
				var oldpath = files.uploadImg.path; //uploadImg是我们前端自定义的后台接受的名称；
				console.log("oldpath:",oldpath)
				//因为formidable这个时候存在我们刚路径上的，只是一个path,也没有扩展名，如：2.png这样的
				//定义图片存在磁盘的新的路径组成 files.uploadImg.name是文件的名称加上扩展名 uploadImg是我们前端自定义的后台接受的名称；
				var last_path = path.join(`public/articleImgs/${req.headers.authorization}`,`${new Date().getTime()}--${files.uploadImg.name}`)
				console.log("last_path:",last_path)
				//改名 将原始的不带扩展名的文件改成可被系统识别的文件
			    fs.rename(oldpath, last_path, function(err) { //把之前存的图片换成真的图片的完整路径
					if(err) {
			                res.send({errno:1,data:[]});
							console.log("有错误")
							global_callback(null,'success')
							return;
			        }
					//将public替换成ip 可以被外网访问
					var return_path = last_path.replace("public",ipObj.address);
					console.log("return_path:",return_path)
					//默认返回 res.send({errno:0,data:[return_path]}) //返回图片路径，让前端展示
					res.send({
						// msg : '成功',
						imgUrl:return_path
					}) 
					global_callback(null,'success')
				})
			})
		}]
	},function(err, async_global_res){
		if(err){
			
			return;
		}	
			
	})
}

