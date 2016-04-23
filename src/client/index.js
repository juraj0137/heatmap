import Base64 from 'base-64';
import gzip from 'gzip-js';
import JSONC from 'jsoncomp';
import {configHeatmap} from './config';
import {IdleDetect} from './idle-detect';

import {HeatmapUtils} from './../common/utils';
import VisitData from './../common/model/visitData';
import {TreeStructureDetailedClient} from './dataColect/TreeStructureDetailedClient';

const LOCAL_STORAGE_KEY = 'heatmap_visit_data';

window.Base64 = Base64;
window.gzip = gzip;

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
        this.dataTreeStructureDetailed = new TreeStructureDetailedClient();
        this.sendVisitData();
    }

    bindEvents() {

        const self = this;
        let currentEvent = null;


        document.addEventListener('mousemove', function (event) {
            currentEvent = event;
        });

        ['mousedown', 'touchstart'].forEach(eventName => {
            document.addEventListener(eventName, function (event) {
                console.log(eventName);
                self.dataTreeStructureDetailed.increment(event, true);
            });
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
        }, 60);


        window.addEventListener('beforeunload', ()=> {
            let visitData = new VisitData({
                url: window.location.host + '' + window.location.pathname,
                heatmap_data: JSON.stringify(self.dataTreeStructureDetailed.collectedData),
                visit_time: new Date()
            });

            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(visitData.toJS()));

        });

    }

    sendVisitData() {
        try {

            let localStorageDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
            let localStorageData = JSON.parse(localStorageDataString);

            if (localStorageData != null) {

                let heatmapData = JSON.parse(localStorageData.heatmap_data);

                let stat = localStorage.getItem('statistic');
                if (stat == null) {
                    stat = [];
                }else{
                    stat = JSON.parse(stat);
                }
                stat.push({
                    raw: Buffer.byteLength(localStorageDataString, 'utf8'),
                    compr: Buffer.byteLength(JSONC.pack(localStorageData), 'utf8'),
                });
                localStorage.setItem('statistic', JSON.stringify(stat));

                if (!HeatmapUtils.isEmptyObject(heatmapData)) {

                    $.ajax({
                        url: configHeatmap.apiUrl,
                        method: "POST",
                        data: {data: JSONC.pack(localStorageData)}
                    }).done(()=> {
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