let arr =[
	/* user */
	'/user/setOtherTag',
	'/user/headPor',
	'/user/mName',
	'/user/checkTime',
	'/user/info',
	'/user/infoMore',
	'/user/follow',
	'/user/getFollow',
	'/user/folAndFans',
	'/user/folAndFansMore',
	/* login */
	// '/login/testLogin',
	// '/login/sendCode',
	'/login/getUserInfo',
	/* article */
	'/article/biddingPlate',
	'/article/doReport',
	'/article/report',
	'/article/adminStopUser',
	'/article/setArticleTag',
	'/article/authorStopUser',
	'/editorImages',
	'/article/editorImg',
	'/article/publish',
	'/article/moPublish',
	'/article/comment',
	'/article/col',
	'/article/getCol',
	'/article/reward',
	'/article/bidding',
	'/article/articleAndCol',
	'/article/articleAndColMore',
	'/article/delArticle',
	'/article/delComment'
]

function app_token(url){
	console.log(url)
	let result_token = false
	for(let item of arr){
		if(item == url){
			result_token = true
			console.log(url,result_token)
			return result_token 
		}
	}
}

module.exports = app_token

/* 不需要登录的接口
 
 user:
 otherUser
 
 login:
 folAndFansForOther
 folAndFansForOtherMore
 testLogin
 sendCode
 userLogin
 
 article : 
 getNowBiddingPlate
 getRewardMore
 getReward
 homePage
 more
 read
 getComment
 getCommentMore
 search
 searchMore
 plateAll
 plateAllMore
 plateOther
 plateOtherMore
 getNowBidding
 articleAndColForOther
 articleAndColForOtherMore
 
 */