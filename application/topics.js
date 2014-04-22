var express = require('express');
var router = express.Router();

router.route('/:id?')
    .get(function(req, res) {

    })
    .put(function(req, res) {

    })
    .post(function(req, res) {

    })
    .delete(function(req, res) {

    })

router.post("/:id/top",function(req,res){})

router.post("/:id/fine",function(req,res){})

router.post("/:id/unseal",function(req,res){})

router.post("/:id/seal",function(req,res){})

module.exports = router;