import BaseElasticService from './BaseElasticService.js';
import Heatmap from './../model/heatmap';

class HeatmapService extends BaseElasticService {


    constructor() {
        super();
        this.indexName = 'heatmap_config';
        this.docType = 'heatmap';
    }

    /**
     * Save new heatmap
     *
     * @param document {Heatmap}
     */
    save(document) {
        if (!(document instanceof Heatmap)) {
            throw new Error('Invalid object to save, object must be instance of Heatmap');
        }

        return new Promise((resolve, reject)=> {

            let obj = document.toJS();
            delete obj['id'];

            this.db.index({
                index: this.indexName,
                type: this.docType,
                body: obj
            }).then(function (result) {
                if (result.created == false) {
                    reject(result);
                }

                document = document.set('id', result._id);
                resolve(document);
            });
        });
    }

    get(id) {
        if (id === undefined) {
            throw new Error('Invalid paramater passes, parameter id must not be undefined');
        }

        return new Promise((resolve, reject) => {
            this.getMulti([id])
                .then((heatmaps) => {
                    resolve(heatmaps.pop());
                })
                .catch((error)=> {
                    reject(error);
                })
        });
    }

    getMulti(ids) {
        if (!Array.isArray(ids)) {
            throw new Error('Invalid paramater passes, parameter ids must be an array');
        }

        return new Promise((resolve)=> {

            this.db.mget({
                index: this.indexName,
                type: this.docType,
                body: {
                    ids: ids
                }
            }).then(function (result) {
                let heatmaps = result.docs.filter((document)=> {
                    return document.found == true
                }).map((document)=> {
                    return new Heatmap(document._source).set('id', document._id);
                });

                resolve(heatmaps);
            });
        });
    }

    update(document) {
        if (!(document instanceof Heatmap)) {
            throw new Error('Invalid object to update, object must be instance of Heatmap');
        }

        return new Promise((resolve)=> {

            let obj = document.toJS(),
                id = obj['id'];
            delete obj['id'];

            this.db.index({
                index: this.indexName,
                type: this.docType,
                id: id,
                body: obj
            }).then(function (result) {
                document = document.set('id', result._id);
                resolve(document);
            });
        });
    }

    deleteDocument(id) {
        if (id === undefined) {
            throw new Error('Invalid paramater passes, parameter id must not be undefined');
        }

        return new Promise((resolve, reject)=> {

            this.db.delete({
                index: this.indexName,
                type: this.docType,
                id: id
            }).then(function (response) {
                resolve(response);
            }).catch((error)=>{
                reject(error);
            });
        });
    }

    find(query) {
        return new Promise((resolve, reject)=> {

            this.db.search({
                index: this.indexName,
                body: query.getQuery()
            }).then(
                (response) => {
                    resolve(response);
                },
                (error)=> {
                    reject(error);
                }
            );
        });
    }

}

export default HeatmapService;