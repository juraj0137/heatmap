//import {Record} from 'immutable';

class VisitData {
    constructor(param) {
        this._url = param.url != undefined ? param.url : '';
        this._heatmap_data = param.heatmap_data != undefined ? param.heatmap_data : {};
        this._visit_time = param.visit_time != undefined ? param.visit_time : new Date();
    }

    get url() {
        return this._url;
    }

    get heatmap_data() {
        return this._heatmap_data;
    }

    get visit_time() {
        return this._visit_time;
    }

    set visit_time(time) {
        this._visit_time = time;
    }

    toJS() {
        return {
            url: this._url,
            heatmap_data: this._heatmap_data,
            visit_time: this._visit_time
        };
    }
}

export default VisitData;