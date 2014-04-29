var express = require('express');
var router = express.Router();

router.use("/",require("./accessControl"));
router.use("/columns",require("./columnCtrl"));
router.use("/topics",require("./topicCtrl"));
router.use("/messages",require("./messageCtrl"));
router.use("/users",require("./userCtrl"));
router.use("/replys",require("./replyCtrl"));

router.use(function(err,req,res,next){
    res.send("error");
})

module.exports = router;