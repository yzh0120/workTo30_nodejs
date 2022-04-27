module.exports = function (req, res) {
	let arr = [
		['system', '123456'],
		['test', '123456']
	]
	let status = arr.some((item) => {
		if (req.body.username == item[0] && req.body.password == item[1]) {
			return true
		}
	})
	if (status) {
		if (req.body.username == "system") {
			res.send({
				code: 200,
				
				data:{
					// username: req.body.username,
					// roleArr: ['system'],
					token: req.body.username,
					expireDateTimeSpan: 7955078400000,
				}
			})
		}else if(req.body.username == "test"){
			res.send({
				code: 200,
				
				data:{
					// username: req.body.username,
					// roleArr: ['test'],
					token: req.body.username,
					expireDateTimeSpan: 7955078400000,
					
				}
			})
		}

	} else {
		res.send({
			code: 401,
			info: "未授权"
		})

	}
}
