var express = require('express');
var router = express.Router();


router.post("/tablePager", (req, res) => {
  require('./pager.js')(req, res)
})

router.post("/twoHundred", (req, res) => {
  require('./twoHundred.js')(req, res)
})

router.post("/notTwoHundred", (req, res) => {
  require('./notTwoHundred.js')(req, res)
})

router.post("/loading", (req, res) => {
  require('./loading.js')(req, res)
})

//暴露接口
module.exports = router;
