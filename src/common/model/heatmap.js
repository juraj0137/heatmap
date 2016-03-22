import {Record} from 'immutable';

export const UNDEFINED_ID = -1;
export const STATUS_FINISHED = 'STATUS_FINISHED';
export const STATUS_ACTIVE = 'STATUS_ACTIVE';
export const STATUS_PAUSED = 'STATUS_PAUSED';

export const TYPE_UNDEFINED = 'TYPE_UNDEFINED';
export const TYPE_START_WITH = 'TYPE_START_WITH';
export const TYPE_REGEX = 'TYPE_REGEX';
export const TYPE_FULL_URL = 'TYPE_FULL_URL';
export const TYPE_BULK = 'TYPE_BULK';

const Heatmap = Record({
    id: UNDEFINED_ID,
    status: STATUS_ACTIVE,
    matchType: TYPE_UNDEFINED,
    matchStrings: [],
    snapshotUrl: '',
    title: '',
    pageViews: 0,
    created: new Date(0)
});

export function type(type) {
    switch (type) {
        case TYPE_FULL_URL:
            return 'Presná URL';
        case TYPE_BULK:
            return 'Balík URL';
        case TYPE_REGEX:
            return 'REGEX';
        case TYPE_START_WITH:
            return 'Začiatok URL';
        case TYPE_UNDEFINED:
            return '';
    }
    throw new Error('Heatmap model - nedefinovany typ "' + type + '"');
}

export function status(status) {
    switch (status) {
        case STATUS_ACTIVE:
            return 'Aktívna';
        case STATUS_FINISHED:
            return 'Ukončená';
        case STATUS_PAUSED:
            return 'Pozastavená';
    }
    throw new Error('Heatmap model - nedefinovany status "' + status + '"');
}

export default Heatmap;
