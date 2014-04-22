var express = require('express');
var router = express.Router();

router.get("/",function(req,res){

})

router.use("/columns",require("./columns"));
router.use("/topics",require("./topics"));
router.use("/message",require("./messages"));
router.use("/users",require("./users"));
router.use("/infos",require("./infos"));

module.exports = router;

