module.exports = function (req, res) {
	let arr = [
		['system', '123456'],
		['test', '123456']
	]
	let status = arr.some((item) => {
		if (req.body.userName == item[0] && req.body.password == item[1]) {
			return true
		}
	})
	if (status) {
		if (req.body.userName == "system") {
			res.send({
				code: 200,

				data: {
					// userName: req.body.userName,
					// roleArr: ['system'],
					token: req.body.userName,
					expireTime: 7955078400000,
				}
			})
		} else if (req.body.userName == "test") {
			res.send({
				code: 200,

				data: {
					// userName: req.body.userName,
					// roleArr: ['test'],
					token: req.body.userName,
					expireTime: 7955078400000,

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
