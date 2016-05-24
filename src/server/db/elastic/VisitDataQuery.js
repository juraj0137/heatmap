import BaseElasticQuery from './BaseElasticQuery.js';

class VisitDataQuery extends BaseElasticQuery {

    constructor() {
        super();
    }

    url(url) {
        this.query.query.bool = this.query.query.bool || {};
        this.query.query.bool.filter = this.query.query.filter || [];
        this.query.query.bool.filter.push({term: {url: url}});

        return this;
    }

    urlWildcard(url) {
        this.query.query.bool = this.query.query.bool || {};
        this.query.query.bool.filter = this.query.query.filter || [];
        this.query.query.bool.filter.push({wildcard: {url: url}});

        return this;
    }

}

export default VisitDataQuery;