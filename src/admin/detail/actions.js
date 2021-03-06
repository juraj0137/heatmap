import jquery from "jquery";
import {config} from '../config'
import {TreeStructureDetailed} from "../../client/dataStructure/TreeStructureDetailed.js";

export const HEATMAP_WIDTH = 'HEATMAP_WIDTH';
export const HEATMAP_HEIGHT = 'HEATMAP_HEIGHT';
export const HEATMAP_OPACITY = 'HEATMAP_OPACITY';
export const HEATMAP_RADIUS = 'HEATMAP_RADIUS';
export const HEATMAP_BLUR = 'HEATMAP_BLUR';
export const VIEW_TYPE_MOVEMENTS = 'VIEW_TYPE_MOVEMENTS';
export const VIEW_TYPE_CLICKS = 'VIEW_TYPE_CLICKS';
export const GET_HEATMAP_DATA_START = 'GET_HEATMAP_DATA_START';
export const GET_HEATMAP_DATA_SUCCESS = 'GET_HEATMAP_DATA_SUCCESS';
export const GET_HEATMAP_DATA_FAIL = 'GET_HEATMAP_DATA_FAIL';
export const HEATMAP_DATA_RESET = 'HEATMAP_DATA_RESET';
export const SET_CONFIG = 'SET_CONFIG';
export const CROP_ENABLE = 'CROP_ENABLE';
export const CROP_SET_PARAMS = 'CROP_SET_PARAMS';

export function setWidth(width) {
    return {
        type: HEATMAP_WIDTH,
        width: width
    };
}
export function setHeight(height) {
    return {
        type: HEATMAP_HEIGHT,
        height: height
    };
}
export function setViewTypeMovements() {
    return {
        type: VIEW_TYPE_MOVEMENTS
    };
}
export function setViewTypeClicks() {
    return {
        type: VIEW_TYPE_CLICKS
    };
}
export function setOpacity(min, max) {
    min = Math.max(0.01, Math.min(min, 9.99));
    max = Math.max(0.01, Math.min(max, 9.99));
    return {
        type: HEATMAP_OPACITY,
        opacityMin: min,
        opacityMax: max
    };
}
export function setRadius(radius) {
    radius = Math.max(0, Math.min(radius, 300));
    return {
        type: HEATMAP_RADIUS,
        radius: radius
    };
}
export function setBlur(blur) {
    blur = Math.max(0, Math.min(blur, 1));
    return {
        type: HEATMAP_BLUR,
        blur: blur
    };
}

function getHeatmapData(heatmapId, success, error) {
    return dispatch => {

        dispatch(getHeatmapDataStart());

        jquery.ajax({
            url: `${config.basePath}/api/visit/${heatmapId}`,
            method: "GET",
            crossDomain: true,
            dataType: "json"
        }).done((data) => {
            dispatch(getHeatmapDataSuccess(data));
            if (typeof success == "function") {
                success();
            }
        }).fail(()=> {
            dispatch(getHeatmapDataFail(new Error('Error while getting heatmap data (' + heatmapId + ')')));
            if (typeof error == "function") {
                error();
            }
        });
    };
}
export function getHeatmapDataIfNeeded(heatmapId, success, error) {
    return (dispatch, getState) => {
        if (getState().heatmapDetail.fetchingHeatmapData == false) {
            dispatch(getHeatmapData(heatmapId, success, error))
        }
    }
}
function getHeatmapDataStart() {
    return {
        type: GET_HEATMAP_DATA_START
    };
}
function getHeatmapDataSuccess(json) {
    let heatmapData = new TreeStructureDetailed(json.heatmapData != undefined ? json.heatmapData : {});

    return {
        type: GET_HEATMAP_DATA_SUCCESS,
        heatmapData: heatmapData
    };
}
function getHeatmapDataFail(error) {
    return {
        type: GET_HEATMAP_DATA_FAIL,
        error
    };
}
export function resetHeatmapData() {
    return {
        type: HEATMAP_DATA_RESET
    };
}

export function setConfig(config) {
    return {
        type: SET_CONFIG,
        config: config
    }
}

/**
 * Function turn on/off cropping heatmap
 * @param bool true|false
 */
export function cropEnable(bool) {
    return {
        type: CROP_ENABLE,
        enable: bool == true
    }
}

/**
 * Function is used to setting cropping parameters.
 * @param x
 * @param y
 * @param width
 * @param height
 */
export function cropSetParams(x, y, width, height) {
    return {
        type: CROP_SET_PARAMS,
        x: x,
        y: y,
        width: width,
        height: height
    }
}