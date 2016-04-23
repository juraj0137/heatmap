import express from 'express';
import * as HeatmapConst from './../../common/model/heatmap.js';
import VisitData from './../../common/model/visitData.js';
import VisitDataQuery from './../db/elastic/VisitDataQuery.js';
import VisitDataService from './../db/elastic/VisitDataService.js';
import HeatmapService from './../db/elastic/HeatmapService.js';
import {TreeStructureDetailed} from './../../client/dataColect/TreeStructureDetailed.js';
import Base64 from 'base-64';
import gzip from 'gzip-js';
import JSONC from 'jsoncomp';

var router = express.Router();
router.route('/')
    .post((req, res) => {

        GLOBAL.Base64 = Base64;
        GLOBAL.gzip = gzip;

        var data = JSONC.unpack(req.body.data);
        var visitData = new VisitData(data);
        visitData.visit_time = new Date();
        
        if (visitData.heatmap_data.length > 0) {
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
            res.status(400).send();
        }

        new HeatmapService()
            .get(heatmapId)
            .then((heatmap)=> {
                getVisitData(heatmap, res);
            })
            .catch((error)=> {
                console.log(error);
                res.status(400).send();
            });

    });

function getVisitData(heatmap, res) {

    let query = new VisitDataQuery();
    query.noLimit();

    if (heatmap.matchType == HeatmapConst.TYPE_FULL_URL) {
        query.url(heatmap.matchStrings[0]);
    } else if (heatmap.matchType == HeatmapConst.TYPE_START_WITH) {
        query.urlWildcard(heatmap.matchStrings[0] + '*');
    }

    (new VisitDataService)
        .find(query)
        .then((response)=> {

            let merged = mergeVisitData(response);

            res.json({heatmapData: merged.heatmapData});

        })
        .catch((error)=> {
            console.log(error);
            res.status(400).send('b');
        })

}

function mergeVisitData(response) {
    let data = response.hits.hits.map((item)=> {
        return {
            heatmapData: item._source.heatmap_data
        }
    });

    let heatmapData = new TreeStructureDetailed();
    for (let i = 0; i < data.length; i++) {

        try {
            heatmapData.mergeData(JSON.parse(data[i].heatmapData));
        } catch (e) {
            console.log(e);
        }
    }
    return {
        heatmapData: heatmapData.collectedData
    }
}

module.exports = router;
