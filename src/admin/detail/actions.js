import jquery from "jquery";

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

export const SET_CONFIG = 'SET_CONFIG';

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
export function setOpacity(opacity) {
    opacity = Math.max(0, Math.min(opacity, 1));
    return {
        type: HEATMAP_OPACITY,
        opacity: opacity
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

export function getHeatmapData(heatmapId, success, error) {
    return dispatch => {

        dispatch(getHeatmapDataStart());

        jquery.ajax({
            url: "/api/heatmapData/" + heatmapId,
            method: "GET",
            dataType: "json"
        }).done((data)=> {
            dispatch(getHeatmapDataSuccess({data: data}));
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
function getHeatmapDataStart() {
    return {
        type: GET_HEATMAP_DATA_START
    };
}
function getHeatmapDataSuccess(json) {
    let mouseMovements = new TreeStructureDetailed();
    let mouseClicks = new TreeStructureDetailed();

    try {
        mouseMovements = new TreeStructureDetailed(JSON.parse(json.data.mouse_movements));
    } catch (e) {
        console.log(e);
    }

    try {
        mouseClicks = new TreeStructureDetailed(JSON.parse(json.data.mouse_clicks));
    } catch (e) {
        console.log(e);
    }

    return {
        type: GET_HEATMAP_DATA_SUCCESS,
        mouseMovements: mouseMovements,
        mouseClicks: mouseClicks,
        receivedAt: Date.now()
    };
}
function getHeatmapDataFail(error) {
    return {
        type: GET_HEATMAP_DATA_FAIL,
        error
    };
}

export function setConfig(config){
    return {
        type: SET_CONFIG,
        config: config
    }
}