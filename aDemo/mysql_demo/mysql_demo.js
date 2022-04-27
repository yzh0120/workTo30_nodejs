 /*   req.body.  req.headers.authorization 
 const handler = require('../utils/mysqlHandler.js');
		成功信息: undefined 
		错误信息: null
		                                 
 查询 
		handler.exec({
			res : res,
			callback : global_callback,
			sql: `select user_id from user where user_id = ?`,
			params: [id],
			success: result => {

			}
		})
	多查询
	handler.selectArr({
		res : res,
		callback : global_callback,
		sqlArr: ['UPDATE user SET user_gold = user_gold + 100 WHERE user_id = ?','UPDATE user SET user_gold=user_gold -1200 WHERE user_id = ?'],
		paramsArr: [[req.headers.authorization],[req.headers.authorization]],
		success: selectArrResult => {
			result0 = selectArrResult[0]
			console.log("--------------------------------------------",selectArrResult[0])
		}
	})
	事务	
		handler.transaction({
			res : res,
			callback : global_callback,
			 sqlArr: ['UPDATE user SET user_gold = user_gold + 100 WHERE user_id = ?','UPDATE user SET user_gold=user_gold -1200 WHERE user_id = ?'],
			 paramsArr: [[req.headers.authorization],[req.headers.authorization]],
			 success: result => {
				console.log("--------------------------------------------",result[0])
			 }
		})
 
 //暴露接口
 module.exports = homePageA;   
 删除语句
 DELETE FROM runoob_tbl WHERE runoob_id=3
 查询语句
 select user_id ,user_name,user_img from user where user_email = ?
 
 SELECT article.*,user.user_name FROM article LEFT JOIN user ON article.article_user_id = user.user_id where article.article_id<? ORDER BY article.article_id desc LIMIT 10
 []则表示查询不到结果
 
 更新语句
 UPDATE sign_up SET sign_up_code = ? , sign_up_time = ?  WHERE sign_up_email = ?
 
 插入语句
 INSERT INTO sign_up(sign_up_time,sign_up_email) VALUES (?,?)
 undefined 则表示插入失败
 */