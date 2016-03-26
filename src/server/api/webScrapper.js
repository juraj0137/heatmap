import express from 'express';
import request from "request";

var router = express.Router();
router.route('/')
    .get((req, res) => {

        var url = req.query.url;
        request(url, function (error, response, html) {

            res.status(200).send(html);

        })

    });

module.exports = router;
