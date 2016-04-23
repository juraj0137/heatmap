/**
 * Created by juraj on 12.03.2016.
 */

import {TreeStructureDetailedClient} from  './TreeStructureDetailedClient.js';
import {ElementPath, ELEMENT_JOINER, ELEMENT_POSITION_SEPARATOR} from './../../common/elementPath';
import {HeatmapUtils} from './../../common/utils';

class TreeStructureDetailed extends TreeStructureDetailedClient {

    constructor(data) {

        super();
        this.collectedData = data != undefined ? data : {};
    }

    mergeData(newData) {
        this._traversMerge(this.collectedData, newData);
    }

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

    _traversTree(element, domElements) {

        if (typeof element == "object") {

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
                    for (let attentioKey in element[key].movements) {

                        if (element[key].movements.hasOwnProperty(attentioKey) === false) {
                            continue;
                        }


                        let k = attentioKey.toString();
                        let elmPosition = HeatmapUtils.getElementAttentionAreaPosition(currentElm, k[0], k[1], domElements[0]);

                        // pridame data na vykraslenie heatmapy
                        if (!isNaN(elmPosition.x) && !isNaN(elmPosition.y)) {
                            this.heatmapData.movements.push({
                                x: elmPosition.x, // x coordinate of the datapoint, a number
                                y: elmPosition.y, // y coordinate of the datapoint, a number
                                value: element[key].movements[attentioKey] // the value at datapoint(x,
                            });
                        }
                    }
                }

                if (element[key].clicks !== undefined) {

                    // pridame vsetky body siete v elemente
                    // element je rozdeleny na siet 10x10
                    for (let attentioKey in element[key].clicks) {

                        if (element[key].clicks.hasOwnProperty(attentioKey) === false) {
                            continue;
                        }


                        let k = attentioKey.toString();
                        let elmPosition = HeatmapUtils.getElementAttentionAreaPosition(currentElm, k[0], k[1], domElements[0]);

                        // pridame data na vykraslenie heatmapy
                        if (!isNaN(elmPosition.x) && !isNaN(elmPosition.y)) {

                            this.heatmapData.clicks.push({
                                x: elmPosition.x, // x coordinate of the datapoint, a number
                                y: elmPosition.y, // y coordinate of the datapoint, a number
                                value: element[key].clicks[attentioKey] // the value at datapoint(x,
                            });
                        }
                    }
                }
            }
            domElements.pop();
        }
    }

    mapReduceData() {
        let data = this.reduceArray(this.heatmapData.movements);
        this.heatmapData.movements = data.data;
        this.heatmapData.maxMovements = data.max;
        this.heatmapData.minMovements = data.min;

        data = this.reduceArray(this.heatmapData.clicks);
        this.heatmapData.clicks = data.data;
        this.heatmapData.maxClicks = data.max;
        this.heatmapData.minClicks = data.min;
    }

    reduceArray(array) {
        let xGranularity = 10;
        let yGranularity = 4;

        let result = {
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
            let x = (Math.round((val.x) / xGranularity) * xGranularity) + (xGranularity / 2);
            let y = (Math.round((val.y) / yGranularity) * yGranularity) + (yGranularity / 2);

            if (acc[x + "|" + y] == undefined)
                acc[x + "|" + y] = 0;

            acc[x + "|" + y] += val.value;
            acc['min'] = Math.min(acc['min'], acc[x + "|" + y]);
            acc['max'] = Math.max(acc['max'], acc[x + "|" + y]);

            return acc;
        }, {min: 9999999, max: 0});

        result.max = reducedMovements.max;
        result.min = reducedMovements.min;
        delete reducedMovements.max;
        delete reducedMovements.min;

        result.data = Object.keys(reducedMovements).map(key => {
            let splittedKey = key.split('|');
            return {
                value: reducedMovements[key],
                x: splittedKey[0],
                y: splittedKey[1]
            }
        });
        return result;
    }

    getDataForHeatmap(doc) {

        let DOMElements = [doc != undefined ? doc : document.documentElement];
        if (doc != undefined) {
            DOMElements.push(doc.getElementsByTagName('html')[0]);
        }

        this.heatmapData = {
            movements: [],
            minMovements: 100000,
            maxMovements: 0,
            clicks: [],
            minClicks: 100000,
            maxClicks: 0
        };

        if (typeof this.collectedData == "object") {
            this._traversTree(this.collectedData, DOMElements);
        }

        this.mapReduceData();

        return this.heatmapData;

    }

}

export {TreeStructureDetailed};