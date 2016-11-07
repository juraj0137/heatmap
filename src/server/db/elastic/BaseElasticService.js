import elastic from 'elasticsearch';
import BaseService from './../BaseService.js';

class BaseElasticService extends BaseService{
    
    constructor(){
        super();
        this.db = elastic.Client({
            host: '127.0.0.1:9200',
            log: 'trace'
        });
    }

}

export default BaseElasticService;