var express = require('express');
var router = express.Router();

var fs = require("fs");
/* 全局变量 */
var globalVar = require('../../utils/global/globalVar.js');
// var formatDate = require('../../utils/smallTool/date.js')
const handler = require('../../utils/mysqlHandler/mysqlHandler.js');
const path = require('path');
var async = require('async');
var formidable = require('formidable');  //上传图片处理的插件
/* mysqlG */
var mysqlG = require('../../utils/global/mysqlG');

var ipObj = require('../../utils/global/ipObj');
////////////////////////////////////////////////////////////
// 头像日志
var logOfConfig = require('../../log/logOfConfig.js');
var headPorLog = logOfConfig.getLogger('headPorLog');



// 修改头像
// var headPor = require('./userData/headPor.js')
var headPor = require('./userData/head_.js')
router.post("/headPor",function(req,res,next){
	// 没返回文章id说明是第一次加载
	headPor(req,res,handler,formidable,fs,path,headPorLog,ipObj,async)
})

// var mName = require('./userData/mName.js')
var mName = require('./userData/mo_name.js')
router.post("/mName",function(req,res,next){
	// 没返回文章id说明是第一次加载
	mName(req,res,handler,async)
})

// var reTime = require('./reTime/reTime.js')
var reTime = require('./reTime/check_date.js')
router.post("/checkTime",function(req,res,next){
	// 没返回文章id说明是第一次加载
	reTime(req,res,handler,mysqlG,async)
})
//用户的消息
// var info = require('./info/info.js')
var info = require('./info/info_.js') 
var info_is_reply_comment = require('./info/info_is_reply_comment.js')
var info_is_reply_article = require('./info/info_is_reply_article.js')
var info_is_reward = require('./info/info_is_reward.js')
router.post("/info",function(req,res,next){
	info(req,res,handler,async,mysqlG,globalVar,info_is_reply_comment,info_is_reply_article,info_is_reward)
})
//用户的更多消息
// var infoMore = require('./info/infoMore.js')
// var infoMore = require('./info/info_more.js')
// router.post("/infoMore",function(req,res,next){
// 	infoMore(req,res,handler,async,mysqlG,globalVar,info_is_reply_comment,info_is_reply_article,info_is_reward)
// })
//其他用户信息
// var otherUser = require('./otherUser/otherUser.js')
var otherUser = require('./otherUser/other_user_info.js')
router.post("/otherUser",function(req,res,next){
	otherUser(req,res,handler,mysqlG,async)
})

//修改用户标签
// var setOtherTag = require('./otherUser/setOtherTag.js')
var setOtherTag = require('./otherUser/set_other_tag.js')
router.post("/setOtherTag",function(req,res,next){
	setOtherTag(req,res,handler,async)
})

//主动关注用户
// var follow = require('./otherUser/follow.js')
var follow = require('./otherUser/follow_.js')
router.post("/follow",function(req,res,next){
	follow(req,res,handler,async)
})
//得到关注用户
// var getFollow = require('./otherUser/getFollow.js')
var getFollow = require('./otherUser/get_follow.js')
router.post("/getFollow",function(req,res,next){
	getFollow(req,res,handler,async)
})

//关注和粉丝
// var folAndFans = require('./folAndFans/folAndFans.js')
var folAndFans = require('./folAndFans/fol_fans.js')
router.post("/folAndFans",function(req,res,next){
	folAndFans(req,res,handler,async,mysqlG,globalVar)
})
//关注和粉丝 更多
// var folAndFansMore = require('./folAndFans/folAndFansMore.js')
// var folAndFansMore = require('./folAndFans/fol_fans_more.js')
// router.post("/folAndFansMore",function(req,res,next){
// 	folAndFansMore(req,res,handler,async,mysqlG,globalVar)
// })

//其他人关注和粉丝

router.post("/folAndFansForOther",function(req,res,next){
	folAndFans(req,res,handler,async,mysqlG,globalVar)
})
//其他人关注和粉丝 更多

// router.post("/folAndFansForOtherMore",function(req,res,next){
// 	folAndFansMore(req,res,handler,async,mysqlG,globalVar)
// })
//暴露接口
module.exports = router;   