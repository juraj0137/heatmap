import {configHeatmap} from './config';
import {IdleDetect} from './idle-detect';

import {FlatArrayStructure} from './dataColect/FlatArrayStructure';
import {TreeStructure} from './dataColect/TreeStructure';
import {TreeStructureDetailed} from './dataColect/TreeStructureDetailed';

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

        this.dataFlatStructure = new FlatArrayStructure();
        this.dataTreeStructure = new TreeStructure();
        this.dataTreeStructureDetailed = new TreeStructureDetailed();

        this.heatmap = null;

        //ukladanie dat do localstroage
        //setInterval(()=> {
        //    this.saveDataToLocalstorage();
        //}, 1000);
    }

    showHeatmap(heatmapData) {

        if (this.heatmap == null) {
            if (typeof h337 == "object") {
                this.heatmap = h337.create({
                    container: document.getElementsByTagName('body')[0]
                });
            }

        }
        //document.getElementsByClassName('heatmap-canvas')[0].style.zIndex = 10000;

        if (typeof this.heatmap == "object") {

            this.heatmap.setData({
                max: heatmapData.max,
                min: heatmapData.min,
                data: heatmapData.points
            })
        }
    }

    showHeatmapFromFlatArray() {
        let heatmapData;

        //heatmapData = this.dataFlatStructure.getDataForHeatmap();
        //console.log('data from flat structure: ' + JSON.stringify(heatmapData).length);

        //heatmapData = this.dataTreeStructure.getDataForHeatmap();
        //console.log('data from tree structure: ' + JSON.stringify(heatmapData).length);

        heatmapData = this.dataTreeStructureDetailed.getDataForHeatmap();
        console.log('data from tree detailed structure: ' + JSON.stringify(heatmapData).length);

        this.showHeatmap(heatmapData);
    }

    bindEvents() {

        const self = this;
        window.addEventListener('load', function hm_windowLoad() {

            let currentElement = null,
                currentEvent = null;

            document.addEventListener('mousemove', function (event) {

                // pokracujeme iba ak sme sa pohli na iny element
                if (currentElement != event.target) {
                    currentElement = event.target;
                    self.onMouseMove(event);
                }

                // druhy sposob zaznamenavania, kazdych x milisekund
                currentEvent = event;

            });

            let idle = false;
            new IdleDetect({
                time: 1000,
                onIdleStart: ()=> { idle = true; },
                onIdleStop:  ()=> { idle = false;}
            });

            setInterval(function hm_incrementInterval() {
                if (!idle && currentEvent != null) {
                    self.dataTreeStructureDetailed.increment(currentEvent);
                }
            }, 200);

        });

        //setInterval(function(){
        //    self.showHeatmapFromFlatArray();
        //},500);

        document.addEventListener('DOMContentLoaded', ()=> {
            if (typeof h337 == "object") {
                this.heatmap = h337.create({
                    container: document.getElementsByTagName('body')[0]
                });
            }
        });

        document.addEventListener('keydown', (e) => {
            let evtobj = window.event ? event : e;
            if (evtobj.keyCode == 81 && evtobj.ctrlKey) //q
                self.showHeatmapFromFlatArray();
            
            if (evtobj.keyCode == 66 && evtobj.ctrlKey) { //b
                $.ajax({
                    method: "POST",
                    url: "http://localhost:63342/bakalarka-heatmap/aktuality.html",
                    data: {data: JSON.stringify(self.dataTreeStructureDetailed)}
                });
                let b = new Blob([self.dataTreeStructureDetailed.collectedData]);
                console.log(b.size);
                b = new Blob([JSON.stringify(self.dataTreeStructureDetailed.collectedData)]);
                console.log(b.size);
            }

            if (evtobj.keyCode == 69 && evtobj.ctrlKey) //e
                document.getElementsByClassName('heatmap-canvas')[0].style.zIndex = -1;

        });

        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            //resizeTimer = setTimeout(()=> {
            //    this.showHeatmapFromFlatArray();
            //}, 300);
        });

    }

    onMouseMove(event) {
        this.dataFlatStructure.increment(event);
        this.dataTreeStructure.increment(event);
    }

}

new Heatmap(configHeatmap.enable, configHeatmap.population);

export default Heatmap;