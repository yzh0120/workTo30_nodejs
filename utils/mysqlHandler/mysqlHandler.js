
const mysql = require('mysql');
var async = require('async');
var globalVar = require('../global/globalVar.js');
 
module.exports = {
    config: {
        host: 'localhost',
        port: 3306,
        database: 'zvue',
        user: 'root',
        password: `${globalVar.mysqlPassWord}`,
        useConnectionPooling: true // 使用连接池
    },
    pool: null,
    /**
     * 创建连接池
     */
    create: function () {
        const me = this;
        // 没有pool的才创建
        if (!me.pool) {
            me.pool = mysql.createPool(me.config);
        }
    },
	escape: mysql.escape,  // mysql防注入
	/**
	 * 执行sql
	 * @param {Object} config 操作对象
	 */
	exec: function (config) {
	    const me = this;
	    me.create();//创建线程池
	    me.pool.getConnection((err, conn) => {//连接数据库
	        if (err) {//连接数据库失败
	            console.log('mysql pool getConnections err:' + err);
				return;
	        } 
			conn.query(config.sql, config.params, (err, result) => {//查询								
				if (err) {//执行mysql语句失败
					console.log('mysql查询error: ',err)
					//config.res.send('err')//向前端发送err
					if(config.callback){//如果有异步流程的callback则执行
						config.callback('err')
					}
					if(config.res){//mysql执行语句错误 向前端发送err
						config.res.send('err')
					}
					return;
				}
				config.success(result);//执行成功函数
				conn.release();// 释放连接到连接池
			});
	    });
	},
	/* select */
	selectArr: function (config) {
	    const me = this;
	    me.create();//创建线程池
	    me.pool.getConnection((err, conn) => {//连接数据库
	        if (err) {//连接数据库错误
	            console.log('mysql pool getConnections err:' + err);
	            return;
	        }
			function mysqlAbc(callback){//先定义需要异步的函数
				var mysqlItemArr = []
				for(let m=0;m<config.sqlArr.length;m++){
					mysqlItemArr.push(
						function(callback){
							conn.query(config.sqlArr[m], config.paramsArr[m], (err, result) => {				
								if (err) {
									console.log('mysql事务第'+m+'步异步错误')
									callback(err);
									return ;
								}
								callback(null,result)	
							});
						}
					)
				}
				return mysqlItemArr;
			}
			/* 异步 */
			async.parallel(//
				mysqlAbc()
			,function(mysqlAsyncErr, mysqlAsyncRes){
				if(mysqlAsyncErr){
					console.log('mysql多查询err: ', mysqlAsyncErr);	
					//config.res.send('err')//向前端发送err
					if(config.res){//mysql执行语句错误 向前端发送err
						config.res.send('err')
					}
					if(config.callback){//如果有异步流程的callback则执行
						config.callback('err')
					}
					return;
				}
				config.success(mysqlAsyncRes);	
				conn.release();// 释放连接到连接池
			})
	        
	    });
	},
	/* **********************************************************************
	mysql事务 
	 */
	transaction : function (config) {
	    const me = this;
	    me.create();//创建线程池
	    me.pool.getConnection((err, conn) => {//连接数据库
	        if (err) {//如果连接数据库错误
	            console.log('mysql连接池错误' + err);
				return;
	        }
			conn.beginTransaction( err => {//开启事务操作
				if(err) {//如果开启事务失败
					console.log('开启事务失败')
					return;
				  }
			function mysqlAbc(callback){//先定义需要异步的函数
				var mysqlItemArr = []
				for(let m=0;m<config.sqlArr.length;m++){
					mysqlItemArr.push(
						function(callback){
							conn.query(config.sqlArr[m], config.paramsArr[m], (err, result) => {				
								if (err) {//执行mysql语句失败
									console.log('mysql事务第'+m+'步异步错误')
									callback(err);
									return;
								}
								callback(null,result)
							});
						}
					)
				}
				return mysqlItemArr;
			}
			async.series(//
				mysqlAbc()
			,function(mysqlAsyncErr, mysqlAsyncRes){
				if(mysqlAsyncErr){
					console.log('mysql事务异步error: ', mysqlAsyncErr);
					conn.rollback(function(){
						//config.res.send('err')//向前端发送err
						if(config.res){//mysql执行语句错误 向前端发送err
							config.res.send('err')
						}
						if(config.callback){//如果有异步流程的callback则执行
							config.callback('err')
						}
					});	
					return;
				}
				conn.commit(function(){
					config.success(mysqlAsyncRes);
				});
				conn.release();// 释放连接到连接池
			})
			})
				
	        
	    });
	}	
};

// [['xiaohong',8],['xiaolan',12]]

/* 
 handler.exec({
     sql: 'select * from table where id = ?',
     params: [id],
     success: result => {
         console.log(result)
     }
 })
 
 
 
 */
