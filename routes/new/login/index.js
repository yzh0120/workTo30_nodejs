var express = require('express');
var router = express.Router();

// var loginA = require('./login.js')
// router.post("/userLogin", (req,res)=>{
// 	loginA(req,res)
// })

// var getUser = require('./getUser.js')
// router.post("/getUser", (req,res)=>{
// 	getUser(req,res)
// })
///////////////////////////////
var loginA = require('./login.js')
router.post("/login", (req, res) => {
	loginA(req, res)
})

var getUser = require('./getUser.js')
router.get("/getUserInfo", (req, res) => {
	getUser(req, res)
})

var getmodulelist = require('./getmodulelist.js')
router.get("/getmodulelist", (req, res) => {
	getmodulelist(req, res)
})

//暴露接口
module.exports = router;
