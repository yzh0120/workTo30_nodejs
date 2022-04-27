const crypto = require('crypto');//加密 内置模块
module.exports = function(secretkey,random,curTime,phoneNum){
	let hash = crypto.createHash('md5');
	hash.update('secretkey='+secretkey+
	            '&random='+random+
	            '&time='+curTime+
				'&mobile='+phoneNum);
		
	return hash.digest('hex').toUpperCase();
}