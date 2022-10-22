module.exports = function (req, res) {
	let arr = ['system', 'test']
	for (let item of arr) {
		if (req.headers.authorization.includes(item)) {
			res.send({
				code: 200,
				data: {
					userName: item,
					id: item,
				}
			})
		}
	}
}
