import express from 'express';
import Heatmap from './../../common/model/heatmap.js';
import HeatmapService from './../db/elastic/HeatmapService.js';
import HeatmapQuery from './../db/elastic/HeatmapQuery.js';

var router = express.Router();
router.route('/')
    .post((req, res) => {

        var heatmap = new Heatmap(req.body);
        heatmap = heatmap.set('pageViews', 0);
        heatmap = heatmap.set('created', new Date());

        (new HeatmapService)
            .save(heatmap)
            .then((heatmap)=> {
                res.json({
                    heatmap: heatmap
                });
            })
            .catch((error)=> {
                res.status(400).send(error);
            });

    })
    .get((req, res)=> {

        let query = (new HeatmapQuery()).noLimit().findAll();

        (new HeatmapService)
            .find(query)
            .then((response)=> {

                let heatmaps = response.hits.hits.map((item)=> {
                    return (new Heatmap(item._source)).set("id", item._id)
                });

                res.json({
                    heatmaps: heatmaps
                });
            })
            .catch((error)=> {
                res.status(400).send(error);
            });
    })
    .put((req) => {

        var heatmap = new Heatmap(req.body);

        (new HeatmapService())
            .update(heatmap)
            .then((heatmap)=> {
                console.log(heatmap);
            })

    });

/** @namespace req.params.heatmapId */
router.route('/:heatmapId')
    .get((req, res) => {

        const heatmapId = req.params.heatmapId;

        (new HeatmapService())
            .get(heatmapId)
            .then((heatmap)=> {
                res.json({
                    heatmap: heatmap
                });
            })
            .catch((error)=> {
                res.status(400).send(error);
            });

    })
    .delete((req, res) => {

        const heatmapId = req.params.heatmapId;

        (new HeatmapService())
            .delete(heatmapId)
            .then(()=> {
                res.json({
                    success: true
                });
            })
            .catch((error)=> {
                res.status(400).send(error);
            });
    });

module.exports = router;
