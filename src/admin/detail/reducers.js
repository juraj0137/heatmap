import * as actions from './actions';

const initialState = {
    heatmapWidth: 320,
    heatmapHeight: 500,
    heatmapRadius: 50,
    heatmapOpacityMax: 0.80,
    heatmapOpacityMin: 0.01,
    heatmapBlur: 0.99,
    viewType: actions.VIEW_TYPE_MOVEMENTS,
    heatmapData: null,
    heatmapConfig: null,
    fetchingHeatmapData: false
};

export default function heatmapDetail(state = initialState, action) {
    switch (action.type) {

        case actions.HEATMAP_HEIGHT:
            return Object.assign({}, state, {
                heatmapHeight: action.height
            });

        case actions.HEATMAP_WIDTH:
            return Object.assign({}, state, {
                heatmapWidth: action.width
            });

        case actions.VIEW_TYPE_MOVEMENTS:
        case actions.VIEW_TYPE_CLICKS:
            return Object.assign({}, state, {
                viewType: action.type
            });

        case actions.HEATMAP_RADIUS:
            return Object.assign({}, state, {
                heatmapRadius: action.radius
            });

        case actions.HEATMAP_BLUR:
            return Object.assign({}, state, {
                heatmapBlur: action.blur
            });

        case actions.HEATMAP_OPACITY:
            return Object.assign({}, state, {
                heatmapOpacityMin: action.opacityMin,
                heatmapOpacityMax: action.opacityMax
            });

        case actions.SET_CONFIG:
            return Object.assign({}, state, {
                heatmapConfig: action.config
            });

        case actions.GET_HEATMAP_DATA_SUCCESS:
            return Object.assign({}, state, {
                heatmapData: action.heatmapData,
                fetchingHeatmapData: false
            });
        case actions.GET_HEATMAP_DATA_START:
            return Object.assign({}, state, {
                fetchingHeatmapData: true
            });
        case actions.GET_HEATMAP_DATA_FAIL:
            return Object.assign({}, state, {
                fetchingHeatmapData: false
            });

        case actions.HEATMAP_DATA_RESET:
            return Object.assign({}, state, {
                heatmapData: null
            });

        default:
            return state;
    }
}
