// 随机六位字符串类型
function createSixNum(){
        var Num="";
		
   //      for(var i=0;i<6;i++){
			// if(i == 0 ){
			// 	Num = Num + 0
			// }else{
			// 	Num+=Math.floor(Math.random()*10);
			// }
   //      }
		
		for(var i=0;i<6;i++){		
		    Num+=Math.floor(Math.random()*10);
		}
        return Num;
}
module.exports = createSixNum;   

// 随机六位数字类型
// function getRandom(lower = 100000, upper = 999999) {
//         return Math.floor(Math.random() * (upper - lower)) + lower;
//     }

// module.exports = getRandom;   