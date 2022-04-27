var express = require('express');
var router = express.Router();

var async = require('async');

// 引入jwt token工具
const JwtUtil = require('../../utils/pem/jwt');

// 引入邮件模块
// var nodemail = require('../../utils/nodemailer/nodemailer.js');

// 引入mysql数据库连接池
const handler = require('../../utils/mysqlHandler/mysqlHandler.js');

/* mysqlG */
var mysqlG = require('../../utils/global/mysqlG');

// 引入日期转化字符串函数
// var formatDate = require('../../utils/smallTool/date.js');

// 引入随机数
var createSixNum = require('../../utils/smallTool/createSixNum.js');

// 手机验证码的md5加密
var signMD5_phone = require('../../utils/smallTool/signMD5_phone.js');

// 发送手机验证码的接口
// var sendCodeA = require('./sendCode/sendCodeA.js');
var sendCodeA = require('./sendCode/send_code.js');
router.post("/sendCode", (req,res)=>{
	sendCodeA(req,res,createSixNum,handler,async,signMD5_phone)
})
// 正式登录接口
// var loginA = require('./login/loginA.js');//判断是新用户还是老用户 
// var signInB = require('./login/signInB.js');//老用户只需要比较验证码清空验证码
// var signUpB = require('./login/signUpB.js');// 新用户 除了比较验证码  
// var signUpC = require('./login/signUpC.js');//新用户 还需要清空验证码 还需要在user表中写入数据
var loginA = require('./login/login_.js')
router.post("/userLogin", (req,res)=>{
	loginA(req,res,JwtUtil,handler,async,mysqlG)
})



// !!!!!!!!!测试的登录或者注册
var judge_in_db = require('./land/judge_in_db.js');
var	new_user = require('./land/new_user.js');
router.post("/testLogin", (req,res)=>{
	judge_in_db(req,res,handler,JwtUtil,new_user,mysqlG)
})
// 用户信息
// var getUserInfo = require('./userInfo/getUserInfo.js');
var getUserInfo = require('./userInfo/get_user_info.js');
router.post("/getUserInfo", (req,res)=>{
	getUserInfo(req,res,handler,mysqlG,async)
})

//暴露接口
module.exports = router;   