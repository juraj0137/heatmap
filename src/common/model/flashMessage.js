import {Record} from 'immutable';

export const TYPE_INFO = 'info';
export const TYPE_WARNING = 'warning';
export const TYPE_ERROR = 'danger';
export const TYPE_SUCCESS = 'success';
export const DEFAULT_DISMISS = 1000*60*60; //1 hodina

const FlashMessage = Record({
    id: -1,
    type: TYPE_INFO,
    title: '',
    text: '',
    html: '',
    dismissAfter: DEFAULT_DISMISS
});

export default FlashMessage;
