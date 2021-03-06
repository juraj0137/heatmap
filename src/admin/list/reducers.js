import * as actions from './actions';

const initialState = {
    added: false,
    error: null,
    heatmaps: [], //@todo zmenit na imutable strukturu
    isAdding: false,
    isFetching: false,
    isUpdating: false,
    lastReload: null
};

export default function heatmaps(state = initialState, action) {
    switch (action.type) {
        case actions.HEATMAP_ADD_START:
        {
            return Object.assign({}, state, {
                isAdding: true,
                added: false,
                error: ''
            });
        }

        case actions.HEATMAP_ADD_SUCCESS:
        {
            return Object.assign({}, state, {
                isAdding: false,
                added: true,
                heatmaps: [action.heatmap, ...state.heatmaps]
            });
        }

        case actions.HEATMAP_ADD_FAIL:
        {
            return Object.assign({}, state, {
                isAdding: false,
                added: false,
                error: action.error
            });
        }

        case actions.HEATMAP_UPDATE_START:
        {
            return Object.assign({}, state, {
                isUpdating: true,
                error: ''
            });
        }

        case actions.HEATMAP_UPDATE_SUCCESS:
        {
            let newHeatmaps = state.heatmaps.map((heatmap)=> {
                if (heatmap.id == action.heatmap.id) {
                    return action.heatmap;
                }
                return heatmap;
            });
            return Object.assign({}, state, {
                isUpdating: false,
                heatmaps: newHeatmaps
            });
        }

        case actions.HEATMAP_UPDATE_FAIL:
        {
            return Object.assign({}, state, {
                isUpdating: false,
                error: action.error
            });
        }

        case actions.HEATMAPS_FETCH_START:
        {
            return Object.assign({}, state, {
                isFetching: true,
                error: null
            });
        }

        case actions.HEATMAPS_FETCH_FAIL:
        {
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error
            });
        }

        case actions.HEATMAPS_FETCH_SUCCESS:
        {
            return Object.assign({}, state, {
                isFetching: false,
                heatmaps: action.heatmaps,
                lastReload: action.receivedAt,
                error: null
            })
        }

        case actions.GET_HEATMAP_SUCCESS:
        {
            return Object.assign({}, state, {
                isFetching: false,
                heatmaps: [action.heatmap, ...state.heatmaps],
                error: null
            })
        }
        case actions.GET_HEATMAP_FAIL:
        {
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error
            });
        }

        default:
            return state;
    }
}
