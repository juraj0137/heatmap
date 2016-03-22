import BaseQuery from './../BaseQuery.js';

class BaseElasticQuery extends BaseQuery {

    constructor() {
        super();
        this.query = {
            query: {},
            size: 10
        };
    }

    noLimit() {
        return this.limit(10000);
    }

    limit(limit) {
        this.query.size = limit;
        return this;
    }

    findAll(){
        this.query.query.match_all = {};
        return this;
    }

    documentType(type){
        this.query.filtered = this.query.filtered || {};
        this.query.filtered.filter = this.query.filtered.filter || {};
        this.query.filtered.filter.bool = this.query.filtered.filter.bool || {};
        this.query.filtered.filter.bool.must = this.query.filtered.filter.bool.must || [];
        this.query.filtered.filter.bool.must.push({
            term: {
                _type: type
            }
        });
        return this;
    }

    getQuery() {
        return this.query;
    }
}

export default BaseElasticQuery;