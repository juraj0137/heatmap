import express from 'express';
import VisitData from './../../common/model/visitData.js';
import VisitDataQuery from './../db/elastic/VisitDataQuery.js';
import VisitDataService from './../db/elastic/VisitDataService.js';

var router = express.Router();
router.route('/')
    .post((req, res) => {

        var visitData = new VisitData(req.body);
        visitData = visitData.set('visit_time', new Date());

        if (visitData.mouse_clicks.length > 0 || visitData.mouse_movements.length > 0) {
            (new VisitDataService)
                .save(visitData)
                .then(()=> {
                    res.status(200).send();
                })
                .catch((error)=> {
                    res.status(400).send();
                    console.log(error);
                });
        }

        res.status(200).send();

    })
    .get((req, res) => {

        let url = req.query.url != undefined ? req.query.url : '';

        if (url.length == 0) {
            res.status(400).send();
        }


        let query = (new VisitDataQuery()).url(url).noLimit();
        (new VisitDataService)
            .find(query)
            .then((data)=> {
                res.json(data.hits.hits.map((item)=>{
                    return {
                        mouse_clicks: item._source.mouse_clicks,
                        mouse_movements: item._source.mouse_movements
                    }
                }))
            })

    });

module.exports = router;
