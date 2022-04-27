const handler = require('./utils/mysqlHandler/mysqlHandler.js');
var logOfConfig = require('./log/logOfConfig.js');// log4js配置
var articleImgsLog = logOfConfig.getLogger('articleImgsLog');// 选择logger对象

const schedule = require('node-schedule');
var redis = require('./utils/myRedis/myRedis');
/* 
if (process.env.NODE_APP_INSTANCE === '0') {} 所在的 js
1 redis封装
 */
/* 项目启动时候的初始化 */
	//1 将禁止用户发布文章字段设置为1
	//2 将新文章设置为0
	//待处理
handler.transaction({
		 sqlArr: ['UPDATE user SET user_allow_pub = 1 WHERE user_allow_pub = 0','UPDATE article SET article_new = 0 WHERE article_new = 1'],
		 paramsArr: [[],[]],
		 success: result => {	  
			 console.log("mysql数据库--重置成功")
			 articleImgsLog.info('init启动了')
		 }
		})
/* 
 *    *    *    *    *    *
 ┬    ┬    ┬    ┬    ┬    ┬
 │    │    │    │    │    |
 │    │    │    │    │    └ 一周的星期 (0 - 7) (0 or 7 is Sun)
 │    │    │    │    └───── 月份 (1 - 12)
 │    │    │    └────────── 月份中的日子 (1 - 31)
 │    │    └─────────────── 小时 (0 - 23)
 │    └──────────────────── 分钟 (0 - 59)
 └───────────────────────── 秒 (0 - 59, OPTIONAL)
 */
// 定时器      
//启动两个脚本的时候 因为脚本引入的文件会被复制到内存中两次    
// 导致两个脚本redis(公共变量 或者说通信中转站)都有相同的事件监听 
//所以发布一个订阅  两个脚本redis会都执行 (和nodejs多进程一样 vue的组件复用一样)   

//scheduleJob之所以都会被执行 是因为每个脚本 都有scheduleJob代码
schedule.scheduleJob('30 * * * * *',()=>{
	// dateLog.info('scheduleCronstyle:' + '123');
	redis.pub('chat', '来自init.js',  function(err,result){
	if (err) {return console.log(err);}
	console.log('来自init.js------------------------------------------------')
	})
}); 