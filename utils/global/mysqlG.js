module.exports = {
	
	/* 用户表  ${mysqlG.userBase}
	list
	getcomment getcommentMore
	read
	info infoMore
	commentB
	*/
	userBase : "user.user_super_admin,user.user_id,user.user_beauty,user.user_authen,user.user_name,user.user_img,user.user_gold,user.user_lv",
	/* folAndFans folAndFansMore
	getReward
	和userBase比较主要是增加了用户id
	*/
	//folAndFans : "user.user_super_admin,user.user_beauty,user.user_id,user.user_authen,user.user_name,user.user_img,user.user_gold,user.user_lv",
	/*    ${mysqlG.userInfo}
	getUserInfo
	otherUser
	retime
	用户全部信息
	*/
	userInfo : "user.user_super_admin,user.user_beauty,user_unread,user_col_count,user_article_count,user.user_authen,user.user_name,user.user_img,user.user_id,user.user_gold,user.user_lv,user.user_follow,user.user_fans,user.user_reTime_log"        
}