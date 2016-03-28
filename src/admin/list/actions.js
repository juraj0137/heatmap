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
 */
export function addHeatmap(heatmap, success, error) {
    return dispatch => {
        dispatch(addHeatmapStart());

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
            dispatch(addHeatmapFail(new Error('Error while adding heatmap')));
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
 */
export function fetchHeatmaps(success, error) {
    return dispatch => {

        dispatch(fetchHeatmapsStart());

        const heatmaps = [
            new Heatmap({
                id: HeatmapUtils.uuid(),
                status: STATUS_ACTIVE,
                title: 'Homepage',
                matchType: TYPE_FULL_URL,
                matchStrings: ['http://aktuality.sk/'],
                pageViews: 5165100,
                created: new Date("03-15-2016 11:35:40")
            }),
            new Heatmap({
                id: HeatmapUtils.uuid(),
                status: STATUS_ACTIVE,
                title: 'Článok',
                matchType: TYPE_START_WITH,
                matchStrings: ['http://aktuality.sk/clanok/*'],
                pageViews: 561060,
                created: new Date("03-15-2016 23:35:40")
            }),
            new Heatmap({
                id: HeatmapUtils.uuid(),
                status: STATUS_FINISHED,
                title: 'Diskusia',
                matchType: TYPE_START_WITH,
                matchStrings: ['http://aktuality.sk/diskusia/*'],
                pageViews: 560450,
                created: new Date("03-15-2016 18:35:40")
            }),
            new Heatmap({
                id: HeatmapUtils.uuid(),
                status: STATUS_PAUSED,
                title: 'Kategória',
                matchType: TYPE_BULK,
                matchStrings: ['http://aktuality.sk/prominenti/*', 'http://aktuality.sk/spravy/*', 'http://aktuality.sk/koktejl/*'],
                pageViews: 556160,
                created: new Date("03-15-2016 09:35:40")
            })
        ];

        setTimeout(()=> {

            if (Math.random() < 0.8) {
                dispatch(fetchHeatmapsSuccess({data: {heatmaps}}));
                if (typeof success == "function") {
                    success();
                }
            } else {
                dispatch(fetchHeatmapsFail(new Error('Error while fetching')));
                if (typeof error == "function") {
                    error();
                }
            }
        }, 1000);

        //return fetch(`http://www.reddit.com/r/${subreddit}.json`)
        //    .then(req => req.json())
        //    .then(json => dispatch(receivePosts(subreddit, json)))
    };
}
function fetchHeatmapsStart() {
    return {
        type: HEATMAPS_FETCH_START
    };
}
function fetchHeatmapsSuccess(json) {
    return {
        type: HEATMAPS_FETCH_SUCCESS,
        heatmaps: json.data.heatmaps,
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
 */
export function updateHeatmap(heatmap, success, error) {
    return dispatch => {
        dispatch(updateHeatmapStart());

        // fake ajax
        setTimeout(()=> {

            if (Math.random() < 0.8) {
                dispatch(updateHeatmapSuccess({data: {heatmap}}));
                if (typeof success == "function") {
                    success();
                }
            } else {
                dispatch(updateHeatmapFail(new Error('Error while updating heatmap')));
                if (typeof error == "function") {
                    error();
                }
            }
        }, 1000);

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
        heatmap: json.data.heatmap
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
 * @param success
 * @param error
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
            dispatch(getHeatmapFail(new Error('Error while getting heatmap (' + heatmapId + ')')));
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