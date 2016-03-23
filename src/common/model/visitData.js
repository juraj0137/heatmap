import {Record} from 'immutable';

const VisitData = Record({
    url: '',
    mouse_movements: {},
    mouse_clicks: {},
    visit_time: new Date(0)
});

export default VisitData;
