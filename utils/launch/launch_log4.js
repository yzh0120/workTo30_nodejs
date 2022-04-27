const log4js = require('log4js');//只是为了使用log4js.connectLogger()函数
const logOfConfig = require('../../log/logOfConfig.js'); // log4js配置
const httpLog = logOfConfig.getLogger('http');
module.exports = function(app){
	  //整合express框架
	 app.use(log4js.connectLogger(httpLog, {level:'auto', format:':method :url  :status  :response-time ms'}));
}

