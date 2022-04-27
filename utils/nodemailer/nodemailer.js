// 引入模块
const nodemailer = require('nodemailer')

// 创建一个smtp服务器
// const config = {
//  	host : 'smtp.163.com',
//  	port: 465,/* 'smtp.163.com'的端口 */
//  	auth: {
//          user: 'y_zh88888888@163.com', //注册的163邮箱账号
//  		pass: 'yzh123456'//邮箱授权码
//  	}
//  }
/* 
 
 */
const config = {
 	service:'qq',
	port: 465,
	sercure: true, // 是否使用TLS，true，端口为465，否则其他或者568
 	auth: {
 	      user: '644193385@qq.com',
 	      pass: 'dvurlnbqoecqbeba'
 	  }
 }

// const config = {
//  	service:'gmail',
// 	port: 465,
// 	sercure: true, // 是否使用TLS，true，端口为465，否则其他或者568
//  	auth: {
//  	      user: 'ClayMaganaP7S@gmail.com',
//  	      pass: 'yyy01201212'
//  	  }
//  }
 
// 创建一个SMTP客户端对象
const transporter = nodemailer.createTransport(config);

//发送邮件
module.exports = function (mail){
    transporter.sendMail(mail, function(error, info){
        if(error) {
            return console.log(error);
        }
        console.log('mail sent:', info.response);
    });
};

