/* 
pm2 的 重载 会启动所有js 
if (process.env.NODE_APP_INSTANCE === '0') {} 所在的 js
1 launch_reset
2 launch_schedule
3 redis封装

 */

const handler = require('../../utils/mysqlHandler/mysqlHandler.js');
var logOfConfig = require('../../log/logOfConfig.js');
var articleImgsLog = logOfConfig.getLogger('articleImgsLog');
module.exports = function(){
	/* 项目启动时候的初始化 */
	//1 将禁止用户发布文章字段设置为1
	//2 将新文章设置为0
	//待处理
	//if (process.env.NODE_APP_INSTANCE === '0') {//在pm2下才有效
		handler.transaction({
		 sqlArr: ['UPDATE user SET user_allow_pub = 1 WHERE user_allow_pub = 0','UPDATE article SET article_new = 0 WHERE article_new = 1'],
		 paramsArr: [[],[]],
		 success: result => {	  
			 console.log("重置成功")
			 articleImgsLog.info('nodejs启动了')
		 }
		})
	//}
}