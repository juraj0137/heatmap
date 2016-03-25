import {configHeatmap} from './config';
import {IdleDetect} from './idle-detect';

import {HeatmapUtils} from './../common/utils';
import VisitData from './../common/model/visitData';
import {FlatArrayStructure} from './dataColect/FlatArrayStructure';
import {TreeStructure} from './dataColect/TreeStructure';
import {TreeStructureDetailed} from './dataColect/TreeStructureDetailed';

const LOCAL_STORAGE_KEY = 'heatmap_visit_data';

class Heatmap {
    constructor(enable = true, massRatio = 100) {
        if (enable === true && massRatio >= 0 && massRatio <= 100) {
            if (Math.random() <= massRatio / 100) {
                this.init();
                this.bindEvents();
            }
        }
    }

    init() {
        this.dataTreeStructureDetailed = new TreeStructureDetailed();
        this.sendVisitData();
    }

    bindEvents() {

        const self = this;
        let currentEvent = null;


        document.addEventListener('mousemove', function (event) {
            currentEvent = event;
        });

        let idle = false;
        new IdleDetect({
            time: 1000,
            onIdleStart: ()=> {
                idle = true;
            },
            onIdleStop: ()=> {
                idle = false;
            }
        });

        setInterval(function hm_incrementInterval() {
            if (!idle && currentEvent != null) {
                self.dataTreeStructureDetailed.increment(currentEvent);
            }
        }, 100);


        window.addEventListener('beforeunload', ()=> {
            let visitData = new VisitData({
                url: window.location.host + '' + window.location.pathname,
                mouse_clicks: JSON.stringify({}),
                mouse_movements: JSON.stringify(self.dataTreeStructureDetailed.collectedData),
                visit_time: new Date()
            });

            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(visitData.toJS()));

        });

    }

    sendVisitData() {
        try {

            let localStorageData = localStorage.getItem(LOCAL_STORAGE_KEY);
            localStorageData = JSON.parse(localStorageData);

            if (localStorageData != null) {

                let mouseClicks,
                    mouseMovements;

                mouseClicks = JSON.parse(localStorageData.mouse_clicks);
                mouseMovements = JSON.parse(localStorageData.mouse_movements);

                if (!HeatmapUtils.isEmptyObject(mouseClicks) || !HeatmapUtils.isEmptyObject(mouseMovements)) {

                    $.ajax({
                        url: "http://localhost:8080/api/collect",
                        method: "POST",
                        data: localStorageData,
                        dataType: "json"
                    }).always(()=> {
                        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(null));
                    });
                }
            }

        } catch (e) {
            console.error(e);
        }
    }
}

new Heatmap(configHeatmap.enable, configHeatmap.population);

export default Heatmap;