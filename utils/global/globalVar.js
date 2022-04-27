// let ipBoss = "http://154.83.15.180/"
module.exports = {
	article_new : '60',//新文章持续多少秒的 新文章标识
	check_many_comment : 2, //文章有多少此评论 显示评论多标识
	
	socketIo_StartPort : 4000  ,//socket.io起始端口
	choosePort : 0, // 1就是多线程模式
	
	limit : 10,//数据库读取多少数据
	
	default_time : '2020-05-06T00:53:59.423Z',//数据库读取多少数据
	
	no_allow_pub : 1,//发布一篇文章之后间隔多长时间
	
	
	 // ip : "https://abc123.cf/"  ,//全局ip
	 // mysqlPassWord : "111111" ,//mysql密码
	ip : "http://localhost/"  ,//全局ip
	mysqlPassWord : "111111" ,//mysql密码
	
	redisPassWord : '123456',   //redis密码
}