/* 
引入一个新的日志
 
 1 配置appenders和  categories
 2 var logOfConfig = require('../../log/logOfConfig.js'); //引入log4js配置
   var articleImgsLog = logOfConfig.getLogger('articleImgsLog');// 选择logger对象
 3 articleImgsLog.info('删除文章txt失败@:',req.body.article_content,'错误原因@:',err)
 */

/*
文件名：log_utils.js
对log4js的简单封装
实践：不同的模块使用不同的日志文件，配置在configure进行。
使用时，调用getLogger获取不同的appender，写入不同的日志文件。
将日志写入文件，然后使用tail -f xx.txt可实时查看，即使进行备份，也不影响
知识点：
每天备份：pattern为.yyyy-MM-dd.txt
每小时：pattern为.yyyy-MM-dd-mm.txt

*/
const log4js = require('log4js');

log4js.configure(
{
  appenders:
  {
	  //主要是用来定义以怎样的方式输出，输出到哪里
    console:
    {
        type: 'console', //在终端打印
    },
    date:
    {
        type: 'dateFile',
        filename: 'log/logFile/date/date.log',
        pattern: ".yyyy-MM-dd",//用于确定何时滚动日志的模式。也是备份
        // alwaysIncludePattern: true,
        // maxLogSize: 10, // 无效
        // backups: 5, // 无效
        // compress: true,//压缩过去的日志
        daysToKeep: 2,//（默认为0） - 如果此值大于零，则在日志滚动期间将删除早于该天数的文件。
		keepFileExt:true,//在滚动日志文件时保留文件扩展名
		//file.log变为file.2017-05-30.log而不是file.log.2017-05-30
    },
	http : {
		type: 'dateFile',
		filename: 'log/logFile/http/http.log',
		pattern: ".yyyy-MM-dd",//用于确定何时滚动日志的模式。也是备份
		daysToKeep: 2,//（默认为0） - 如果此值大于零，则在日志滚动期间将删除早于该天数的文件。
		keepFileExt:true,//在滚动日志文件时保留文件扩展名
	},
	headPor : {
		type: 'file',
		filename: 'log/logFile/headPor/headPorLog.log',
		maxLogSize : 20971520,//文件最大存储空间（byte），
		//当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
		backups : 3,//default value = 5.当文件内容超过文件存储空间时，备份文件的数量
	},
	articleImgs : {
		type: 'file',
		filename: 'log/logFile/articleImgs/articleImgs.log',
		maxLogSize : 20971520,//文件最大存储空间（byte），
		//当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
		backups : 3,//default value = 5.当文件内容超过文件存储空间时，备份文件的数量
	},
	err : {
		type: 'file',
		filename: 'log/logFile/err/err.log',
		maxLogSize : 20971520,//文件最大存储空间（byte），
		//当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
		backups : 3,//default value = 5.当文件内容超过文件存储空间时，备份文件的数量
	}

    // more...
  },
  categories:
  {		
				//选择logger对象 用来定义日志输出的规则然后调用之前定义好的 appenders 进行输出
      default:
      {		
          appenders: ['console'], //选择logger对象的配置
          level: 'debug',//选择logger对象的输出log等级
      },
      date:
      {     
          appenders: ['console', 'date'],
          level: 'debug', 
      },
	  http:
	  {     
	      appenders: ['console', 'http'],
	      level: 'debug', 
	  },
	  headPorLog:
	  {     
	      appenders: ['console', 'headPor'],
	      level: 'debug', 
	  },
	  articleImgsLog:
	  {     
	      appenders: ['console', 'articleImgs'],
	      level: 'debug', 
	  },
	  errLog:
	  {     
	      appenders: ['console', 'err'],
	      level: 'debug', 
	  },
      // datelog2:
      // {
      //     appenders: ['datelog2'],
      //     level: 'debug',
      // },
      // more...
  },
  
  // for pm2...
  pm2: true,
  disableClustering: true, // not sure...
}
);


function getLogger(type){//name取categories项
    return log4js.getLogger(type||'default');
}

module.exports = {
    getLogger,
}
