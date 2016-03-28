import * as actions from './actions';

const initialState = {
    heatmapWidth: 320,
    heatmapHeight: 500,
    heatmapRadius: 40,
    heatmapOpacity: 0.6,
    heatmapBlur: 0.85,
    viewType: actions.VIEW_TYPE_MOVEMENTS,
    mouseMovementsData: {},
    mouseClicksData: {}
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
                heatmapOpacity: action.opacity
            });

        default:
            return state;
    }
}
