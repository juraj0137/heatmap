import VisitData from './../model/visitData';
import BaseElasticService from './BaseElasticService.js';

class VisitDataService extends BaseElasticService {

    constructor() {
        super();
        this.indexName = 'visit_data';
        this.docType = 'visit';
    }


    save(document) {
        if (!(document instanceof VisitData)) {
            throw new Error('Invalid object to save, object must be instance of VisitData');
        }

        return new Promise((resolve, reject)=> {

            this.db.index({
                index: this.indexName,
                type: this.docType,
                body: document.toJS()
            }).then(function (result) {
                if (result.created == false) {
                    reject(result);
                }

                resolve(document);
            });
        });
    }

    find(query) {
        return new Promise((resolve, reject)=> {

            this.db.search({
                index: this.indexName,
                body: query.getQuery()
            }).then((response) => {
                resolve(response);
            }).catch((error)=> {
                reject(error);
            });
        });
    }
}

export default VisitDataService;