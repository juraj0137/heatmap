import {TreeStructureDetailedClient} from  './TreeStructureDetailedClient.js';
import {HeatmapUtils} from './../utils.js';

const ELEMENT_POSITION_SEPARATOR = '?';

/**
 * Trieda reprezentuje strukturu zaznamenanych dat u navstevnika,
 * avsak je obohatena o metody na spracovanie dat v admine a na serveri
 * 
 * Created by juraj on 12.03.2016.
 * @class
 */
class TreeStructureDetailed extends TreeStructureDetailedClient {

    /**
     * @constructor
     * @param data - data z db
     */
    constructor(data) {
        super();
        this.collectedData = data != undefined ? data : {};
    }

    /**
     * Spaja dve TreeSctructureDetailed struktury do jednej
     *
     * @param structure
     */
    mergeData(structure) {
        this._traversMerge(this.collectedData, structure);
    }
    
    /**
     * Vrati spracovane data potrebne na vykreslovanie heatmapy
     *
     * @param domDocument DOM document voci ktoremu sa prepocitavaju data
     * @return {{movements: Array, minMovements: number, maxMovements: number, clicks: Array, minClicks: number, maxClicks: number}}
     */
    getDataForRender(domDocument) {

        let DOMElements = [domDocument != undefined ? domDocument : document.documentElement];
        if (domDocument != undefined) {
            DOMElements.push(domDocument.getElementsByTagName('html')[0]);
        }

        if (typeof this.collectedData == "object") {
            this._traversTree(this.collectedData, DOMElements);
        }

        return this._mapReduceData();
    }

    /**
     * Spaja data o pohybe mysou
     *
     * @param data
     * @param newData
     * @private
     */
    _mergeMovements(data, newData) {
        if (data.movements === undefined) {
            data.movements = newData.movements;
        } else {
            for (let i in newData.movements) {
                if (newData.movements.hasOwnProperty(i)) {
                    if (data.movements[i] !== undefined)
                        data.movements[i] = 0;

                    data.movements[i] += newData.movements[i];
                }
            }
        }
    }

    /**
     * Spaja data o klikani mysou
     *
     * @param data
     * @param newData
     * @private
     */
    _mergeClicks(data, newData) {
        if (data.clicks === undefined) {
            data.clicks = newData.clicks;
        } else {
            for (let i in newData.clicks) {
                if (newData.clicks.hasOwnProperty(i)) {
                    if (data.clicks[i] !== undefined)
                        data.clicks[i] = 0;

                    data.clicks[i] += newData.clicks[i];
                }
            }
        }
    }

    /**
     * Metoda spaja dve TreeSctructureDetailed struktury do jednej
     *
     * @param data
     * @param newData
     * @private
     */
    _traversMerge(data, newData) {

        for (let key in newData) {
            if (newData.hasOwnProperty(key) === false)
                continue;

            // ak neexistuje cely podstrom tak ho pripojime cely
            if (data[key] === undefined) {
                data[key] = newData[key];
                continue;
            }

            // ak su definovane body pohybu
            if (newData[key].movements !== undefined) {
                this._mergeMovements(data[key], newData[key]);
            }

            // ak su definovane body klikania
            if (newData[key].clicks !== undefined) {
                this._mergeClicks(data[key], newData[key]);
            }

            if (newData[key].children !== undefined) {
                for (let i in newData[key].children) {
                    if (newData[key].children.hasOwnProperty(i)) {
                        let newElm = newData[key].children[i];
                        if (data[key].children[i] == undefined) {
                            data[key].children[i] = newElm;
                        } else {
                            this._traversMerge(data[key].children[i].children, newElm.children)
                        }
                    }
                }
            }

        }
    }

    /**
     *
     * @param element
     * @param domElements {HTMLElement[]}
     * @private
     */
    _traversTree(element, domElements) {

        if (typeof element != "object") {
            domElements.pop();
            return;
        }

        for (let key in element) {
            if (element.hasOwnProperty(key) === false)
                continue;

            let splitKey = key.split(ELEMENT_POSITION_SEPARATOR),
                children = domElements.slice(0).pop().children,
                currentElm = Object.keys(children).filter((key)=> {
                    return children[key].tagName == splitKey[0]
                }).map((key)=> {
                    return children[key];
                })[splitKey[1]];

            if (currentElm == undefined) {
                continue;
            }

            // ak je element skryty, preskocime vyratavanie bodov na vykreslovanie
            if (getComputedStyle(currentElm).getPropertyValue("display") == 'none') {
                continue;
            }

            if (typeof element[key].children == "object") {
                domElements.push(currentElm);
                this._traversTree(element[key].children, domElements);
            }


            if (element[key].movements !== undefined) {

                // pridame vsetky body siete v elemente
                // element je rozdeleny na siet 10x10
                for (let attentionKey in element[key].movements) {

                    if (element[key].movements.hasOwnProperty(attentionKey) === false) {
                        continue;
                    }


                    let k = attentionKey.toString();
                    let elmPosition = HeatmapUtils.getElementAttentionAreaPosition(currentElm, k[0], k[1], domElements[0]);

                    // pridame data na vykraslenie heatmapy
                    if (!isNaN(elmPosition.x) && !isNaN(elmPosition.y)) {
                        this.heatmapData.movements.push({
                            x: elmPosition.x, // x coordinate of the datapoint, a number
                            y: elmPosition.y, // y coordinate of the datapoint, a number
                            value: element[key].movements[attentionKey] // the value at datapoint(x,
                        });
                    }
                }
            }

            if (element[key].clicks !== undefined) {

                // pridame vsetky body siete v elemente
                // element je rozdeleny na siet 10x10
                for (let attentionKey in element[key].clicks) {

                    if (element[key].clicks.hasOwnProperty(attentionKey) === false) {
                        continue;
                    }


                    let k = attentionKey.toString();
                    let elmPosition = HeatmapUtils.getElementAttentionAreaPosition(currentElm, k[0], k[1], domElements[0]);

                    // pridame data na vykraslenie heatmapy
                    if (!isNaN(elmPosition.x) && !isNaN(elmPosition.y)) {

                        this.heatmapData.clicks.push({
                            x: elmPosition.x, // x coordinate of the datapoint, a number
                            y: elmPosition.y, // y coordinate of the datapoint, a number
                            value: element[key].clicks[attentionKey] // the value at datapoint(x,
                        });
                    }
                }
            }

            domElements.pop();
        }
    }

    /**
     * Redukuje jemnost vykreslovanych dat
     *
     * @returns {{movements: Array, minMovements: number, maxMovements: number, clicks: Array, minClicks: number, maxClicks: number}}
     * @private
     */
    _mapReduceData() {
        let movements = this._reduceArray(this.heatmapData.movements);
        let clicks = this._reduceArray(this.heatmapData.clicks);

        return {
            movements: movements.data,
            minMovements: movements.min,
            maxMovements: movements.max,
            clicks: clicks.data,
            minClicks: clicks.min,
            maxClicks: clicks.max
        }
    }

    /**
     * Redukuje jemnost vykreslovanych dat
     *
     * @param array
     * @return {{data: Array, min: number, max: number}}
     * @private
     */
    _reduceArray(array) {
        let xGranularity = 16,
            yGranularity = 10,
            result = {
                data: [],
                min: 99999999,
                max: 0
            };

        /* array je array skladajuci sa z
         * Object{
         *    value:7
         *    x:1683
         *    y:423
         * }
         */
        let reducedMovements = array.reduce((acc, val) => {

            let x = (Math.round((val.x) / xGranularity) * xGranularity) + (xGranularity / 2),
                y = (Math.round((val.y) / yGranularity) * yGranularity) + (yGranularity / 2);

            if (acc[x + "|" + y] == undefined)
                acc[x + "|" + y] = 0;

            acc[x + "|" + y] += val.value;
            acc.min = Math.min(acc.min, acc[x + "|" + y]);
            acc.max = Math.max(acc.max, acc[x + "|" + y]);

            return acc;
        }, {min: 9999999, max: 0});

        result.max = reducedMovements.max;
        result.min = reducedMovements.min;
        delete reducedMovements.max;
        delete reducedMovements.min;

        result.data = Object.keys(reducedMovements).map(key => {
            let splitKey = key.split('|');
            return {
                value: reducedMovements[key],
                x: splitKey[0],
                y: splitKey[1]
            }
        });

        return result;
    }

}

export {TreeStructureDetailed};