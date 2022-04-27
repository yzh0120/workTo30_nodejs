var formatDate = function (date) {  
    var y = date.getFullYear();  
    var m = date.getMonth() + 1;  
    m = m < 10 ? ('0' + m) : m;  
    var d = date.getDate();  
    d = d < 10 ? ('0' + d) : d;  
    var h = date.getHours();  
    var minute = date.getMinutes();  
    minute = minute < 10 ? ('0' + minute) : minute; 
    var second= date.getSeconds();  
    second = minute < 10 ? ('0' + second) : second;  
	//////////////////////////
	var Millisecond = date.getMilliseconds()
	////////////////////////////
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+ second +'.'+Millisecond;  
}
module.exports = formatDate;   //暴露接口