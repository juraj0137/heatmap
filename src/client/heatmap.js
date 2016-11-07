//noinspection JSUnresolvedVariable
import Base64 from 'base-64';
import gzip from 'gzip-js';
import JSONC from 'jsoncomp';
import $ from 'jquery';

window.Base64 = Base64;
window.gzip = gzip;

import {configHeatmap} from './config/config.js';
// import {configHeatmap} from './config/config.dev.js';
import {IdleDetect} from './IdleDetect.js';
import VisitData from './../server/db/model/visitData';
import {TreeStructureDetailedClient} from './dataStructure/TreeStructureDetailedClient.js';

const LOCAL_STORAGE_KEY = 'heatmap_visit_data';

class Heatmap {

    constructor(enable = true, massRatio = 100) {
        if (enable === true && massRatio >= 0 && massRatio <= 100) {
            if (Math.random() <= massRatio / 100) {
                this._init();
                this._bindEvents();
            }
        }
    }

    /**
     * Inicializacia objektu Heatmap
     *
     * @private
     */
    _init() {
        this._sendVisitData();

        this._onUrlChange(() => {
            this._sendVisitData();
        });

        this.dataStructure = new TreeStructureDetailedClient();
        this.currentMouseEvent = null;

        this._moveTracking();
    }

    /**
     *
     * @param fnc
     * @private
     */
    _onUrlChange(fnc) {
        var oldLocation = location.href;
        setInterval(function () {
            if (location.href != oldLocation) {
                fnc();
                oldLocation = location.href
            }
        }, 500);
    }

    /**
     * Bindovanie udalosti
     *
     * @private
     */
    _bindEvents() {

        const self = this;

        document.addEventListener('mousemove', function (event) {
            self.currentMouseEvent = event;
        });

        ['mousedown', 'touchstart'].forEach(eventName => {
            document.addEventListener(eventName, this._onClick.bind(self));
        });

        window.addEventListener('beforeunload', this._saveToLocalstorage.bind(self));

    }

    /**
     * Spusti trackovanie pohybu
     * @private
     */
    _moveTracking() {
        let self = this,
            idle = false;

        new IdleDetect({
            time: configHeatmap.idleTime,
            onIdleStart: ()=> {
                idle = true;
            },
            onIdleStop: ()=> {
                idle = false;
            }
        });

        setInterval(() => {
            if (!idle && self.currentMouseEvent != null) {
                self.dataStructure.increment(self.currentMouseEvent);
            }
        }, configHeatmap.collectInterval);
    }

    /**
     * @param event {MouseEvent}
     * @private
     */
    _onClick(event) {
        this.dataStructure.increment(event, true);
    }

    /**
     * Ulozime data do localstorage
     *
     * @private
     */
    _saveToLocalstorage() {
        let visitData = new VisitData({
            url: window.location.host + '' + window.location.pathname,
            heatmap_data: JSON.stringify(this.dataStructure.collectedData),
            visit_time: new Date()
        });

        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(visitData.toJS()));
    }

    /**
     * Funkcia odosle zaznamenane data na server
     *
     * @private
     */
    _sendVisitData() {
        try {
            let localStorageDataString = localStorage.getItem(LOCAL_STORAGE_KEY),
                localStorageData = JSON.parse(localStorageDataString),
                heatmapData = null;

            if (localStorageData != null) {
                heatmapData = JSON.parse(localStorageData.heatmap_data);

                if (!Heatmap.isEmptyObject(heatmapData)) {

                    var fetchUrl = require("fetch").fetchUrl;

                    $.ajax({
                        url: configHeatmap.collectUrl,
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

    /**
     * @param obj
     * @return {boolean}
     * @static
     */
    static isEmptyObject(obj) {

        // null a undefined su "empty"
        if (obj == null) return true;

        // rozhodnutie na zaklade dlzky
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) return false;
        }

        return true;
    }
}

export default Heatmap;