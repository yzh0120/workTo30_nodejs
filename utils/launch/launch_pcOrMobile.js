// function getClientIp(req) {
//         return req.headers['x-forwarded-for'] ||
//         req.connection.remoteAddress ||
//         req.socket.remoteAddress ||
//         req.connection.socket.remoteAddress;
//     };

const getClientIp = function(req) {
    let ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if(ip.split(',').length>0){
        ip = ip.split(',')[0];
    }
    return ip;
};

module.exports = function(app){
	app.get('/',
	// app.use(
		function(req, res,next){		
			var deviceAgent = req.headers["user-agent"].toLowerCase();
			var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
			if(agentID){
				console.log("手机访问",getClientIp(req));
				// res.sendFile( __dirname + "../public/mobile/index.html" );
				res.sendFile( process.cwd() + "/public/mobile/index.html" );
			}else{
				console.log("电脑访问",getClientIp(req));
				// res.sendFile( __dirname + "../public/pc/index.html" );
				res.sendFile( process.cwd() + "/public/pc/index.html" );
			}
			// next()
		}
	)
}