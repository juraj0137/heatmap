import express from 'express';

var router = express.Router();
router.route('/')
    .get((req, res) => {

        var url = req.query.snapshotUrl;

        const Browser = require('zombie');
        const usa = 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36';
        const browser = new Browser({userAgent: usa});
        browser.visit(url, () => {
            setTimeout(function () {

                let $ = require('cheerio').load(browser.html());
                $('script').remove();

                res.status(200).send($.html());

                browser.window.close();
            }, 1000);
        });

    });

module.exports = router;
