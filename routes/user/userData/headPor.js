function headPor(req,res,handler,formidable,fs,path,headPorLog,ipObj){
	
	
	var form = new formidable.IncomingForm();
	//设置文件上传存放地址（需要先把这个文件夹，在项目中建好）
	// form.uploadDir = path.join(__dirname,"../public/images/wang")
	form.uploadDir = path.join("public","headPor")
	
	//执行里面的回调函数的时候，表单已经全部接收完毕了。
	form.parse(req, function(err, fields, files) {
		// console.log(files,'files')
		// files.uploadImg 是前端的上传图片文件的时候，后台接受的文件名 uploadFileName : 'uploadImg' 
		// oldpath: upload_7f84e5cbaa6fb7524786cd1036883dce
		var oldpath = files.file.path; //uploadImg就是我们刚在前台模板里面配置的后台接受的名称；
		console.log("oldpath:",oldpath)
		//因为formidable这个时候存在我们刚路径上的，只是一个path，还没有具体的名字，如：2.png这样的
		var imgName = req.headers.authorization+'u'+new Date().getTime() + files.file.name; 
		console.log("imgName:",imgName)
		//   根据图片的文件名和扩展名定义新的路径由组成		
		var newpath = path.join("public","headPor",imgName);
		console.log("newpath:",newpath)		
		//改名
	    fs.rename(oldpath, newpath, function(err) { //把之前存的图片换成真的图片的完整路径
			if(err) {
	    //             res.send({errno:1,data:[]});
					// console.log("有错误")
					res.send(500)
					return console.error(err);
	        }
			// var mypath = newpath.replace("public",ipObj.localhostAndPort); 
			var mypath = newpath.replace("public",ipObj.address); 
			console.log("mypath:",mypath)
			handler.transaction({
			 sqlArr: ['UPDATE user SET user_img = ? WHERE user_id = ?'],
			 paramsArr: [[mypath, req.headers.authorization]],
			 success: result => {
				// res.send(mypath) 
				console.log(fields.oldHeadPort,'oldHeadPort')
				// if(fields.oldHeadPort == 'http://localhost:80/default.jpg'){
				// if(fields.oldHeadPort == `${ipObj.localhostAndPort}/default.jpg`){
				if(fields.oldHeadPort == `${ipObj.address}/default.jpg`){
					console.log('默认头像')
				}else{
					// fields.oldHeadPort = fields.oldHeadPort.replace(ipObj.localhostAndPort,"public")   
					fields.oldHeadPort = fields.oldHeadPort.replace(ipObj.address,"public") 
					fs.unlink(path.join(fields.oldHeadPort), function (err) {
					   if (err) {
						   // res.send(500)
					    //   return console.log('头像异步错误',err);
						headPorLog.info('删除原头像失败@:',fields.oldHeadPort,'错误原因@:',err)
					   }
						res.send(mypath)
					})
				}
				
			 },
			 error : result => {
				res.send(500)
				// console.log("错误信息:",result)
			 }
			})
			// handler.exec({
			// 	sql: ,
			// 	params: [mypath, req.headers.authorization],
			// 	success: result => {
			// 			res.send('success')
			// 	},
			// 	error : result => {
			// 		res.send(500)
			// 		console.log("错误信息:",result)
			// 	}
			// })
		})
	})
}
module.exports = headPor;  