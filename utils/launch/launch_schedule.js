var redis = require('../../utils/myRedis/myRedis');
 
 const schedule = require('node-schedule');
 const loggerForCif = require('../../log/logOfConfig'); // log4js配置
 const articleImgsLog = loggerForCif.getLogger('date'); // 选择logger对象

module.exports = function(){
	//if (process.env.NODE_APP_INSTANCE === '0') {//在pm2下才有效
				 schedule.scheduleJob('30 * * * * *',()=>{
					 // articleImgsLog.info('scheduleCronstyle:' + '123');
					 redis.pub('chat', '新的',  function(err,result){
					 	if (err) {return console.log(err);}
					 	console.log('发布成功')
					 })
				 }); 
	//}
}