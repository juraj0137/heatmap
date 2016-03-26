import * as actions from './actions';

const initialState = {
    heatmapWidth: 320,
    heatmapHeight: 500,
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

        default:
            return state;
    }
}
