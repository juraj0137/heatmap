import jquery from "jquery";
import {HeatmapUtils} from './../../common/utils';
import Heatmap, {STATUS_ACTIVE,STATUS_FINISHED,STATUS_PAUSED, TYPE_BULK, TYPE_FULL_URL, TYPE_START_WITH} from './../../common/model/heatmap';

export const HEATMAP_ADD_START = 'HEATMAP_ADD_START';
export const HEATMAP_ADD_SUCCESS = 'HEATMAP_ADD_SUCCESS';
export const HEATMAP_ADD_FAIL = 'HEATMAP_ADD_FAIL';

export const HEATMAP_UPDATE_START = 'HEATMAP_UPDATE_START';
export const HEATMAP_UPDATE_SUCCESS = 'HEATMAP_UPDATE_SUCCESS';
export const HEATMAP_UPDATE_FAIL = 'HEATMAP_UPDATE_FAIL';

export const HEATMAPS_FETCH_START = 'HEATMAPS_FETCH_START';
export const HEATMAPS_FETCH_FAIL = 'HEATMAPS_FETCH_FAIL';
export const HEATMAPS_FETCH_SUCCESS = 'HEATMAPS_FETCH_SUCCESS';

export const GET_HEATMAP_SUCCESS = 'GET_HEATMAP_SUCCESS';
export const GET_HEATMAP_FAIL = 'GET_HEATMAP_FAIL';

/**
 * Adding new hetamap
 * @param heatmap instance of Heatmap
 * @param success callback
 * @param error callback
 */
export function addHeatmap(heatmap, success, error) {
    return dispatch => {
        dispatch(addHeatmapStart());

        if ((heatmap instanceof Heatmap) === false) {
            dispatch(addHeatmapFail(new Error('Action addHeatmap: param heatmap must be instance of Heatmap')));
            if (typeof error == "function") {
                error();
            }
            return;
        }

        heatmap = heatmap.set('created', new Date());
        jquery.ajax({
            url: "/api/heatmaps/",
            method: "POST",
            dataType: "json",
            data: heatmap.toJS()
        }).done((data)=> {
            dispatch(addHeatmapSuccess(data));
            if (typeof success == "function") {
                success();
            }
        }).fail(()=> {
            dispatch(addHeatmapFail(new Error('Action addHeatmap: ajax error while adding heatmap')));
            if (typeof error == "function") {
                error();
            }
        });
    }
}
function addHeatmapStart() {
    return {
        type: HEATMAP_ADD_START
    };
}
function addHeatmapSuccess(json) {
    let heatmap = new Heatmap(json.heatmap);
    return {
        type: HEATMAP_ADD_SUCCESS,
        heatmap: heatmap
    };
}
function addHeatmapFail(error) {
    return {
        type: HEATMAP_ADD_FAIL,
        error: error
    };
}

/**
 * Load heatmaps
 * @param success callback
 * @param error callback
 * @todo pridat offset a limit konfiguraciu => upravit api
 */
export function fetchHeatmaps(success, error) {
    return dispatch => {
        dispatch(fetchHeatmapsStart());
        jquery.ajax({
            url: "/api/heatmaps/",
            method: "GET",
            dataType: "json"
        }).done((data)=> {
            dispatch(fetchHeatmapsSuccess(data));
            if (typeof success == "function") {
                success();
            }
        }).fail(()=> {
            dispatch(fetchHeatmapsFail(new Error('Action fetchHeatmaps: error while fetching')));
            if (typeof error == "function") {
                error();
            }
        });
    };
}
function fetchHeatmapsStart() {
    return {
        type: HEATMAPS_FETCH_START
    };
}
function fetchHeatmapsSuccess(json) {

    let heatmaps = json.heatmaps.map((item)=>{
        return new Heatmap(item);
    });

    return {
        type: HEATMAPS_FETCH_SUCCESS,
        heatmaps: heatmaps,
        receivedAt: Date.now()
    };
}
function fetchHeatmapsFail(error) {
    return {
        type: HEATMAPS_FETCH_FAIL,
        error
    };
}

/**
 * Update hetamap
 * @param heatmap instance of Heatmap
 * @param success callback
 * @param error callback
 */
export function updateHeatmap(heatmap, success, error) {
    return dispatch => {
        dispatch(updateHeatmapStart());

        if ((heatmap instanceof Heatmap) === false) {
            dispatch(updateHeatmapFail(new Error('Action updateHeatmap: param heatmap must be instance of Heatmap')));
            if (typeof error == "function") {
                error();
            }
            return;
        }
        
        console.log(heatmap.toJS());

        jquery.ajax({
            url: "/api/heatmaps/",
            method: "PUT",
            dataType: "json",
            data: heatmap.toJS()
        }).done((data)=> {
            dispatch(updateHeatmapSuccess(data));
            if (typeof success == "function") {
                success();
            }
        }).fail(()=> {
            dispatch(updateHeatmapFail(new Error('Action updateHeatmap: ajax error while updating heatmap')));
            if (typeof error == "function") {
                error();
            }
        });
    }
}
function updateHeatmapStart() {
    return {
        type: HEATMAP_UPDATE_START
    };
}
function updateHeatmapSuccess(json) {
    return {
        type: HEATMAP_UPDATE_SUCCESS,
        heatmap: new Heatmap(json.heatmap)
    };
}
function updateHeatmapFail(error) {
    return {
        type: HEATMAP_UPDATE_FAIL,
        error: error
    };
}

/**
 * Get heatmap by id
 * @param heatmapId
 * @param success callback
 * @param error callback
 */
export function getHeatmap(heatmapId, success, error) {
    return dispatch => {

        jquery.ajax({
            url: "/api/heatmaps/" + heatmapId,
            method: "GET",
            dataType: "json"
        }).done((data)=> {
            dispatch(getHeatmapSuccess(data));
            if (typeof success == "function") {
                success();
            }
        }).fail(()=> {
            dispatch(getHeatmapFail(new Error('Action getHeatmap: ajax error while getting heatmap (' + heatmapId + ')')));
            if (typeof error == "function") {
                error();
            }
        });
    };
}
function getHeatmapSuccess(json) {

    return {
        type: GET_HEATMAP_SUCCESS,
        heatmap: new Heatmap(json.heatmap)
    };
}
function getHeatmapFail(error) {
    return {
        type: GET_HEATMAP_FAIL,
        error
    };
}