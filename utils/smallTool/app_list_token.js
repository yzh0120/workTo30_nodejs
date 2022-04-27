
let arr =[
	/* user */
	'/user/info',
	'/user/infoMore',
	'/user/folAndFans',
	'/user/folAndFansMore',
	/* login */

	/* article */
	'/article/articleAndCol',
	'/article/articleAndColMore',
]

function app_list_token(url){
	console.log(url)
	let result_list_token = false
	for(let item of arr){
		if(item == url){
			result_list_token = true
			// console.log(url,result_list_token)
			return result_list_token 
		}
	}
}

module.exports = app_list_token