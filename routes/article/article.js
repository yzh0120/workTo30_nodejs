var express = require('express');
var router = express.Router();
var fs = require("fs");
/* 全局变量 */
var globalVar = require('../../utils/global/globalVar.js');
// var formatDate = require('../../utils/smallTool/date.js')
const handler = require('../../utils/mysqlHandler/mysqlHandler.js');
const path = require('path');
var async = require('async');
var redis = require('../../utils/myRedis/myRedis');
/* mysqlG */
var mysqlG = require('../../utils/global/mysqlG');
/* ip */
var ipObj = require('../../utils/global/ipObj');
// 删除文章图片日志
var logOfConfig = require('../../log/logOfConfig.js');
var articleImgsLog = logOfConfig.getLogger('articleImgsLog');
var errLog = logOfConfig.getLogger('errLog');
//////////////////////////////////////////////////////////下方引入函数模块
var returnAdminRouter = function(io) { 
//pc 右边获取广告
var getPcAd = require('./ad/getPcAd.js');
router.post("/getPcAd",function(req,res,next){
	getPcAd(req,res,async)
})
// banner 轮播图
var banner = require('./ad/banner.js');
router.post("/banner",function(req,res,next){
	banner(req,res,async)
})
//////////////////////////////////////////////////////////////////////////
/* 文章图片上传 */
var editor_img = require('./publish/editor_img.js');
router.post("/editorImg",function(req,res,next){
	editor_img(req,res,fs,path,async,ipObj)
})
// 提交文章
// var publishA = require('./publish/publishA.js');
// var publishAB = require('./publish/publishAB.js');
// var publishB = require('./publish/publishB.js');
var publishA = require('./publish/publish.js');
router.post("/publish",function(req,res,next){
	publishA(req,res,fs,path,handler,async,redis,globalVar)
})
//修改文章
// var moPublishA = require('./publish/moPublishA.js');
var moPublishA = require('./publish/mo_publish.js');
// var moPublish = require('./publish/moPublish.js');
router.post("/moPublish",function(req,res,next){
	// moPublish(req,res,handler,async,fs)
	moPublishA(req,res,handler,async,fs)
})
// 首页看文章
var homePageA = require('./list/homePage/homePageA.js')
router.post("/homePage",function(req,res,next){
	// 没返回文章id说明是第一次加载
	homePageA(req,res,fs,path,handler,async,mysqlG,globalVar)
	/* socket */
	// redis.get(req.headers.authorization, function(err,result){
	// 	if (err) {return console.log(err);}
	// 	if (io.sockets.connected[result]) {
	// 		io.sockets.connected[result].emit('every','socket在article接口返回');
	// 	}
	// })
	/* socket */
	
})
// 首页看更多文章
// var homePageB = require('./list/homePage/homePageB.js')
// router.post("/more",function(req,res,next){
// 	// 没返回文章id说明是第一次加载
// 	homePageB(req,res,fs,path,handler,async,mysqlG,globalVar)
// })

// 设置文章精品
// var setArticleTag = require('./read/setArticleTag.js')
var setArticleTag = require('./read/set_article_tag.js')
router.post("/setArticleTag",function(req,res,next){
	setArticleTag(req,res,handler,async)
})

// 举报
// var report = require('./read/report.js')
var report = require('./read/report_.js')
router.post("/report",function(req,res,next){
	report(req,res,handler,async)
})

// 阅读具体文章
// var readA = require('./read/readA.js')
var readA = require('./read/read_article.js')
router.post("/read",function(req,res,next){
	readA(req,res,fs,path,handler,mysqlG,errLog,async)
})

// 打赏文章的具体用户
// var getReward = require('./read/getReward.js')
var getReward = require('./read/get_reward.js')
router.post("/getReward",function(req,res,next){
	getReward(req,res,handler,async,mysqlG,globalVar)
})

// 打赏文章的具体用户 更多
// var getRewardMore = require('./read/get_reward_more.js')
// router.post("/getRewardMore",function(req,res,next){
// 	getRewardMore(req,res,handler,async,mysqlG,globalVar)
// })

// 发布评论
// var commentA = require('./comment/commentA.js')
// var commentB = require('./comment/commentB.js')
var commentA = require('./comment/comment.js')
var check_many_comment = require('./comment/check_many_comment.js')
router.post("/comment",function(req,res,next){
	commentA(req,res,handler,redis,io,mysqlG,check_many_comment,globalVar,async)
})
// 获取评论
// var getCommentA = require('./comment/getCommentA.js')
var getCommentA = require('./comment/get_comment.js')
router.post("/getComment",function(req,res,next){
	getCommentA(req,res,handler,async,mysqlG,globalVar)
})
// 获取更多评论
// var getCommentMore = require('./comment/getCommentMore.js')
// var getCommentMore = require('./comment/get_comment_more.js')
// router.post("/getCommentMore",function(req,res,next){
// 	getCommentMore(req,res,handler,async,mysqlG,globalVar)
// })

// 收藏事件
// var colA = require('./col/colA.js')
var colA = require('./col/col.js')
router.post("/col",function(req,res,next){
	colA(req,res,handler,async)
})

// 文章中获取收藏
// var getCol = require('./col/getCol.js')
var getCol = require('./col/get_col.js')
router.post("/getCol",function(req,res,next){
	getCol(req,res,handler,async)
})

// 作者禁言用户
// var authorStopUser = require('./power/authorStopUser.js')
var authorStopUser = require('./power/author_stop_user.js')
router.post("/authorStopUser",function(req,res,next){
	authorStopUser(req,res,handler,async)
})

// 管理举报 
// var doReport = require('./power/doReport.js')
var doReport = require('./power/do_report.js')
var report_comment_id = require('./power/report_comment_id.js')
var report_article_id = require('./power/report_article_id.js')
router.post("/doReport",function(req,res,next){
	doReport(req,res,handler,async,mysqlG,report_comment_id,report_article_id)
})

// 管理员封禁用户
// var adminStopUser = require('./power/adminStopUser.js')
var adminStopUser = require('./power/admin_stop_user.js')
router.post("/adminStopUser",function(req,res,next){
	adminStopUser(req,res,handler,async)
})

// // 获取我的文章 
// var myArticleA = require('./list/myArticle/myArticleA.js')
// router.post("/myArticle",function(req,res,next){
// 	myArticleA(req,res,fs,path,handler,async)
// })

// // 获取更多我的文章 
// var myArticleMore = require('./list/myArticle/myArticleMore.js')
// router.post("/myArticleMore",function(req,res,next){
// 	myArticleMore(req,res,fs,path,handler,async)
// })

// // 获取我的收藏
// var myCol = require('./list/myCol/myCol.js')
// router.post("/myCol",function(req,res,next){
// 	myCol(req,res,fs,path,handler,async)
// })

// // 获取更多我的收藏
// var myColMore = require('./list/myCol/myColMore.js')
// router.post("/myColMore",function(req,res,next){
// 	myColMore(req,res,fs,path,handler,async)
// })

// 搜索
// var searchA = require('./list/search/searchA.js')
var searchA = require('./list/search/search.js')
router.post("/search",function(req,res,next){
	searchA(req,res,fs,path,handler,async,mysqlG,globalVar)
})

// 搜索更多
// var searchMore = require('./list/search/searchMore.js')
// var searchMore = require('./list/search/search_more.js')
// router.post("/searchMore",function(req,res,next){
// 	searchMore(req,res,fs,path,handler,async,mysqlG,globalVar)
// })

//某个板块下的所有文章
// var plateAll = require('./list/listPlate/plateAll.js')
var plateAll = require('./list/listPlate/plate_all.js')
router.post("/plateAll",function(req,res,next){
	plateAll(req,res,fs,path,handler,async,mysqlG,globalVar)
})

//某个板块下的所有文章 more
// var plateAllMore = require('./list/listPlate/plateAllMore.js')
// var plateAllMore = require('./list/listPlate/plate_all_more.js')
// router.post("/plateAllMore",function(req,res,next){
// 	plateAllMore(req,res,fs,path,handler,async,mysqlG,globalVar)
// })

//某个板块下的某类文章
// var plateOther = require('./list/listPlate/plateOther.js')
// var plateOther = require('./list/listPlate/plate_other.js')
// router.post("/plateOther",function(req,res,next){
// 	plateOther(req,res,fs,path,handler,async,mysqlG,globalVar)
// })

//某个板块下的某类文章 more
// var plateOtherMore = require('./list/listPlate/plate_other_more.js')
// router.post("/plateOtherMore",function(req,res,next){
// 	plateOtherMore(req,res,fs,path,handler,async,mysqlG,globalVar)
// })

//打赏文章
// var reward = require('./pay/reward.js')
var reward = require('./pay/reward_.js')
router.post("/reward",function(req,res,next){
	reward(req,res,handler,redis,io,async)
})
//竞标
// var bidding = require('./pay/bidding.js')
var bidding = require('./pay/bidding_.js')
router.post("/bidding",function(req,res,next){
	bidding(req,res,handler,getNowBidding,async)
})
/*  **************************板块竞标*/
//获取现在时刻的首页推荐栏
// var getNowBiddingPlate = require('./bidding/getNowBiddingPlate.js')
var getNowBiddingPlate = require('./bidding/get_now_bidding_plate.js')
router.post("/getNowBiddingPlate",function(req,res,next){
	getNowBiddingPlate(req,res,handler,async)
})

//板块竞标
// var biddingPlate = require('./pay/biddingPlate.js')
var biddingPlate = require('./pay/bidding_plate.js')
router.post("/biddingPlate",function(req,res,next){
	biddingPlate(req,res,handler,getNowBiddingPlate,async)
})


/* ****************************** */
// //其他人的文章
// var otherArt = require('./other/otherArt/otherArt.js')
// router.post("/otherArt",function(req,res,next){
// 	otherArt(req,res,fs,path,handler,async)
// })
// //其他人的文章 更多
// var otherArtMore = require('./other/otherArt/otherArtMore.js')
// router.post("/otherArtMore",function(req,res,next){
// 	otherArtMore(req,res,fs,path,handler,async)
// })
// //其他人的收藏
// var otherCol = require('./other/otherCol/otherCol.js')
// router.post("/otherCol",function(req,res,next){
// 	otherCol(req,res,fs,path,handler,async)
// })
// //其他人的收藏 更多
// var otherColMore = require('./other/otherCol/otherColMore.js')
// router.post("/otherColMore",function(req,res,next){
// 	otherColMore(req,res,fs,path,handler,async)
// })

//获取现在时刻的首页推荐栏
// var getNowBidding = require('./bidding/getNowBidding.js')
 var getNowBidding = require('./bidding/get_now_bidding.js')
router.post("/getNowBidding",function(req,res,next){
	getNowBidding(req,res,handler,async)
})

//收藏和我的文章总接口
// var articleAndCol = require('./list/articleAndCol/articleAndCol.js')
var articleAndCol = require('./list/articleAndCol/article_col.js')
router.post("/articleAndCol",function(req,res,next){
	articleAndCol(req,res,fs,path,handler,async,mysqlG,globalVar)
})
//收藏和我的文章总接口 更多
// var articleAndColMore = require('./list/articleAndCol/articleAndColMore.js')
// var articleAndColMore = require('./list/articleAndCol/article_col_more.js')
// router.post("/articleAndColMore",function(req,res,next){
// 	articleAndColMore(req,res,fs,path,handler,async,mysqlG,globalVar)
// })

//收藏和其他人的文章总接口
router.post("/articleAndColForOther",function(req,res,next){
	articleAndCol(req,res,fs,path,handler,async,mysqlG,globalVar)
})
//收藏和其他人的文章总接口 更多
// router.post("/articleAndColForOtherMore",function(req,res,next){
// 	articleAndColMore(req,res,fs,path,handler,async,mysqlG,globalVar)
// })

//删除文章
// var delArticle = require('./del/delArticle.js')
var delArticle = require('./del/del_article.js')
router.post("/delArticle",function(req,res,next){
	delArticle(req,res,fs,path,handler,async,articleImgsLog,ipObj)
})

//删除评论
// var delComment = require('./del/delComment.js')
var delComment = require('./del/del_comment.js')
router.post("/delComment",function(req,res,next){
	delComment(req,res,handler,async)
})


return router;
}
//暴露接口
module.exports = returnAdminRouter;   