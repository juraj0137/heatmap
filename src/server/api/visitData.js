import express from 'express';
import * as HeatmapConst from './../../common/model/heatmap.js';
import VisitData from './../../common/model/visitData.js';
import VisitDataQuery from './../db/elastic/VisitDataQuery.js';
import VisitDataService from './../db/elastic/VisitDataService.js';
import HeatmapService from './../db/elastic/HeatmapService.js';
import {TreeStructureDetailed} from './../../client/dataColect/TreeStructureDetailed.js';

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

    });

router.route('/:heatmapId')
    .get((req, res) => {

        let heatmapId = req.params.heatmapId;

        if (heatmapId == undefined) {
            res.status(400).send('a');
        }

        new HeatmapService()
            .get(heatmapId)
            .then((heatmap)=> {
                getVisitData(heatmap, res);
            })
            .catch((error)=> {
                console.log(error);
                res.status(400).send('c');
            });

    });

function getVisitData(heatmap, res) {

    let query = new VisitDataQuery();
    query.noLimit();

    if (heatmap.matchType == HeatmapConst.TYPE_FULL_URL) {
        query.url(heatmap.snapshotUrl);
    } else if (heatmap.matchType == HeatmapConst.TYPE_START_WITH) {
        query.urlWildcard(heatmap.snapshotUrl + '*');
    }

    (new VisitDataService)
        .find(query)
        .then((response)=> {

            let merged = mergeVisitData(response);

            res.json({
                mouseMovements: merged.movements,
                mouseClicks: merged.clicks
            });

        })
        .catch((error)=> {
            console.log(error);
            res.status(400).send('b');
        })

}

function mergeVisitData(response) {
    let data = response.hits.hits.map((item)=> {
        return {
            mouse_clicks: item._source.mouse_clicks,
            mouse_movements: item._source.mouse_movements
        }
    });

    let mouseMovements = new TreeStructureDetailed();
    let mouseClicks = new TreeStructureDetailed();
    for (let i = 0; i < data.length; i++) {

        try {
            mouseMovements.mergeData(JSON.parse(data[i].mouse_movements));
        } catch (e) {
            console.log(e);
        }

        try {
            mouseClicks.mergeData(JSON.parse(data[i].mouse_clicks));
        } catch (e) {
            console.log(e);
        }
    }
    return {
        movements: mouseMovements.collectedData,
        clicks: mouseClicks.collectedData
    }
}

module.exports = router;
