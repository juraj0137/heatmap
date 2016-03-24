import express from 'express';
import VisitData from './../../common/model/visitData.js';
import VisitDataService from './../db/elastic/VisitDataService.js';

var router = express.Router();
router.route('/')
    .post((req, res) => {

        var visitData = new VisitData(req.body);
        visitData = visitData.set('visit_time', new Date());

        console.log(req.body);
        
        (new VisitDataService)
            .save(visitData)
            .then((visitData)=> {
                res.status(200).send();
                console.log(visitData);
            })
            .catch((error)=> {
                res.status(400).send();
                console.log(error);
            });

    });

module.exports = router;
