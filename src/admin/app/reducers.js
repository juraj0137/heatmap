import { combineReducers } from 'redux';
import * as appAction from './actions';
import heatmaps from './../list/reducers';

function lastAction(state = null, action) {
    return action;
}

const initialState = {
    flashMessages: []
};

function flashMessages(state = initialState, action) {
    switch (action.type) {

        case appAction.FLASH_MESSAGE_ADD:
        {
            return Object.assign({}, state, {
                flashMessages: [...state.flashMessages, action.flashMessage]
            });
        }
        case appAction.FLASH_MESSAGE_REMOVE:
        {
            return Object.assign({}, state, {
                flashMessages: state.flashMessages.filter((item)=>{
                    return !(item.id == action.flashMessage.id)
                })
            });
        }
        default:
            return state;
    }
}


const heatmapApp = combineReducers({
    heatmaps,
    flashMessages,
    lastAction
});

export {heatmapApp};