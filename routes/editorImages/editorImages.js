var express = require('express');
var router = express.Router();
// npm install formidable --save
var formidable = require('formidable');  //上传图片处理的插件
var fs = require("fs");  //文件模块
//var context = require('../public/context'); //环境的一些配置
const path = require('path');

var ipObj = require('../../utils/global/ipObj');

//wangeditor上传图片的地址接口
router.post("/",function(req,res,next){
	 var form = new formidable.IncomingForm();
	 //设置文件上传存放地址（需要先把这个文件夹，在项目中建好）
    // form.uploadDir = path.join(__dirname,"../public/images/wang")
	form.uploadDir = path.join("public/articleImgs")
	// "./public/images/wang";
	
	//执行里面的回调函数的时候，表单已经全部接收完毕了。
    form.parse(req, function(err, fields, files) {
		// console.log(files)
		var oldpath = files.uploadImg.path; //uploadImg就是我们刚在前台模板里面配置的后台接受的名称；
		console.log("oldpath:",oldpath)
		//因为formidable这个时候存在我们刚路径上的，只是一个path,也没有扩展名，如：2.png这样的
		var imgName = req.headers.authorization+'u'+new Date().getTime() + files.uploadImg.name; 
		console.log("imgName:",imgName)
		//   定义新的路径由组成
		var newpath = path.join('public/articleImgs',imgName)
		// "./public/images/wang/" + imgName;
		console.log("newpath:",newpath)
		
		//改名
        fs.rename(oldpath, newpath, function(err) { //把之前存的图片换成真的图片的完整路径
			if(err) {
                    res.send({errno:1,data:[]});
					console.log("有错误")
					return console.error(err);
            }
			//context.ip是我自己设置的后台的ip名，根据环境，可以是localhost,也可以是电脑ip
			// "./public"
			// var mypath = newpath.replace("public","http://localhost:80"); 
			// var mypath = newpath.replace("public",ipObj.localhostAndPort); 
			var mypath = newpath.replace("public",ipObj.address);
			console.log("mypath:",mypath)
			//默认返回 res.send({errno:0,data:[mypath]}) //返回图片路径，让前端展示
			res.send({
				// msg : '成功',
				imgUrl:mypath
			}) 
		})
	})
})

module.exports = router;   //暴露接口

/* 
 var express = require('express');
 var router = express.Router();
 // npm install formidable --save
 var formidable = require('formidable');  //上传图片处理的插件
 var fs = require("fs");  //文件模块
 //var context = require('../public/context'); //环境的一些配置
 const path = require('path');
 
 var ipObj = require('../../utils/global/ipObj');
 
 //wangeditor上传图片的地址接口
 router.post("/",function(req,res,next){
 	 var form = new formidable.IncomingForm();
 	 //设置文件上传存放地址（需要先把这个文件夹，在项目中建好）
     // form.uploadDir = path.join(__dirname,"../public/images/wang")
 	form.uploadDir = path.join("public/articleImgs")
 	// "./public/images/wang";
 	
 	//执行里面的回调函数的时候，表单已经全部接收完毕了。
     form.parse(req, function(err, fields, files) {
 		// console.log(files)
 		var oldpath = files.uploadImg.path; //uploadImg就是我们刚在前台模板里面配置的后台接受的名称；
 		console.log("oldpath:",oldpath)
 		//因为formidable这个时候存在我们刚路径上的，只是一个path,也没有扩展名，如：2.png这样的
 		var imgName = req.headers.authorization+'u'+new Date().getTime() + files.uploadImg.name; 
 		console.log("imgName:",imgName)
 		//   定义新的路径由组成
 		var newpath = path.join('public/articleImgs',imgName)
 		// "./public/images/wang/" + imgName;
 		console.log("newpath:",newpath)
 		
 		//改名
         fs.rename(oldpath, newpath, function(err) { //把之前存的图片换成真的图片的完整路径
 			if(err) {
                     res.send({errno:1,data:[]});
 					console.log("有错误")
 					return console.error(err);
             }
 			//context.ip是我自己设置的后台的ip名，根据环境，可以是localhost,也可以是电脑ip
 			// "./public"
 			// var mypath = newpath.replace("public","http://localhost:80"); 
 			// var mypath = newpath.replace("public",ipObj.localhostAndPort); 
 			var mypath = newpath.replace("public",ipObj.address);
 			console.log("mypath:",mypath)
 			//默认返回 res.send({errno:0,data:[mypath]}) //返回图片路径，让前端展示
 			res.send({
 				// msg : '成功',
 				imgUrl:mypath
 			}) 
 		})
 	})
 })
 */