import BaseElasticQuery from './BaseElasticQuery.js';
import Heatmap from './../../../common/model/heatmap';

class VisitDataQuery extends BaseElasticQuery {

    constructor() {
        super();
    }

    url(url) {
        this.query.query.bool = this.query.query.bool || {};
        this.query.query.bool.filter = this.query.query.filter || [];
        this.query.query.bool.filter.push({term: {url: url}})

        return this;
    }

}

export default VisitDataQuery;