import {ElementPath, ELEMENT_JOINER} from './../common/elementPath';
import {HeatmapUtils} from './../common/utils';
import {configWS, configHeatmap} from './config';

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

        this.collectedData = {};
        this.collectedDataTree = {};

        this.heatmap = null;
        document.addEventListener('DOMContentLoaded', ()=> {
            if (typeof h337 == "object") {
                this.heatmap = h337.create({
                    container: document.getElementsByTagName('body')[0]
                });
            }
        });

        const self = this;
        document.addEventListener('keydown', (e) => {
            let evtobj = window.event ? event : e
            if (evtobj.keyCode == 81 && evtobj.ctrlKey)
                self.showHeatmap();
        });

        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(()=> {
                this.showHeatmapFromFlatArray();
            }, 300);
        });

        //ukladanie dat do localstroage
        setInterval(()=> {
            this.saveDataToLocalstorage();
        }, 1000);
    }

    showHeatmap() {
        console.log('show heatmap');
        this.showHeatmapFromFlatArray();
    }

    showHeatmapFromFlatArray() {
        let splittedPath;
        let heatmapData = {
            points: [],
            min: 100000,
            max: 0
        };

        let key = location.hostname + '' + location.pathname;
        if (localStorage.getItem(key) != null) {
            this.collectedData = JSON.parse(localStorage.getItem(key));
        }

        for (let pathKey in this.collectedData) {

            if (this.collectedData.hasOwnProperty(pathKey) == false)
                continue;

            splittedPath = ElementPath.getElementsFromPath(pathKey);

            if (typeof splittedPath == "object") {

                // najdeme koncovy element
                let currentElement = document;
                for (let elmKey in splittedPath) {
                    if (splittedPath.hasOwnProperty(elmKey) == false)
                        continue;

                    if (currentElement instanceof Node) {
                        let elmObj = splittedPath[elmKey];
                        if (elmObj.elementTagName == 'html') {
                            currentElement = currentElement.getElementsByTagName('html')[0];
                        } else {
                            currentElement = currentElement.children[elmObj.elementSiblingPosition];
                        }
                    }
                }

                // zistime poziciu koncoveho elementu
                if (typeof currentElement != "undefined") {
                    let elmPosition = HeatmapUtils.getElementPosition(currentElement);

                    // pridame data na vykraslenie heatmapy
                    heatmapData.points.push({
                        x: elmPosition.x, // x coordinate of the datapoint, a number
                        y: elmPosition.y, // y coordinate of the datapoint, a number
                        value: this.collectedData[pathKey] // the value at datapoint(x,
                    });

                    //aktualizujeme min a max hodnotu bodov
                    heatmapData.max = Math.max(heatmapData.max, this.collectedData[pathKey]);
                    heatmapData.min = Math.min(heatmapData.min, this.collectedData[pathKey]);
                }
            }
        }

        if (this.heatmap == null) {
            if (typeof h337 == "object") {
                this.heatmap = h337.create({
                    container: document.getElementsByTagName('body')[0]
                });
            }

            document.getElementsByClassName('heatmap-canvas')[0].style.zIndex = 10000;
        }

        if (typeof this.heatmap == "object") {
            this.heatmap.setData({
                max: heatmapData.max,
                min: heatmapData.min,
                data: heatmapData.points
            })
        }

    }

    bindEvents() {

        const self = this;
        window.addEventListener('load', function () {

            let currentElement = null;
            document.addEventListener('mousemove', function (event) {

                // pokracujeme iba ak sme sa pohli na iny element
                if (currentElement != event.target) {

                    currentElement = event.target;
                    self.onMouseMove(event);

                }

            });

        });
    }

    onMouseMove(event) {
        const path = ElementPath.getPathToRoot(event.path);
        this.incrementByKey(path);
        this.incrementInTree(path);
        //var message = new Message(Message.SENDER_CLIENT, Message.ACTION_COLLECT, path);
        //this._websocket.send(message);

    }

    incrementByKey(key) {
        if (typeof this.collectedData[key] == "undefined") {
            this.collectedData[key] = 0;
        }
        this.collectedData[key]++;
    }

    incrementInTree(key) {
        //debugger;
        let elements = key.split(ELEMENT_JOINER);
        let subtree = this.collectedDataTree;
        let currentSubtree = subtree;

        for (let i = 0; i < elements.length; i++) {
            let elm = elements[i];
            if (typeof subtree[elm] == "undefined") {
                if (i == (elements.length - 1)) {
                    subtree[elm] = 0;
                } else {
                    subtree[elm] = {};
                }
            }
            if (i == (elements.length - 1)) {
                if (typeof subtree[elm] == "number") {
                    subtree[elm]++;
                }
            } else {
                if (typeof subtree[elm] == "number") {
                    subtree[elm] = {};
                }
                subtree = subtree[elm];
            }
        }


    }

    saveDataToLocalstorage() {
        if (typeof localStorage == "object") {
            let lsKey = location.hostname + '' + location.pathname;

            let lsData = localStorage.getItem(lsKey);
            if (lsData != null) {
                lsData = JSON.parse(lsData);
            }

            if(Object.keys(lsData).length > 0){
                // aktualizuj udaje
                for (let key in this.collectedData) {
                    if (this.collectedData.hasOwnProperty(key)) {

                        if (typeof lsData[key] == "undefined") {
                            lsData[key] = this.collectedData[key];
                        } else {
                            lsData[key] += this.collectedData[key];
                        }
                        this.collectedData[key] = 0;
                    }
                }
                let kvak = lsData;
                kvak = JSON.stringify(kvak);
                localStorage.setItem(lsKey, kvak);

            } else {
                // vytvor kluc a uloz udaje
                localStorage.setItem(lsKey, JSON.stringify(this.collectedData));
                this.collectedData = {};
            }
        }
    }
}

var heatmap = new Heatmap(configHeatmap.enable, configHeatmap.population);

export default Heatmap;