/**
 * Created by juraj on 12.03.2016.
 */

import {ElementPath, ELEMENT_JOINER, ELEMENT_POSITION_SEPARATOR} from './../../common/elementPath';
import {HeatmapUtils} from './../../common/utils';

class TreeStructureDetailed {

    constructor(data) {
        this.collectedData = data != undefined ? data : {};
    }

    mergeData(newData) {

        console.log('--- mergujem ---');
        //debugger;
        this._traversMerge(this.collectedData, newData);
    }

    _mergePoints(data, newData){
        if (data.points === undefined) {
            data.points = newData.points;
        } else {
            for (let i in newData.points) {
                if (newData.points.hasOwnProperty(i)) {
                    if (data.points[i] !== undefined)
                        data.points[i] = 0;

                    data.points[i] += newData.points[i];
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
            if (newData[key].points !== undefined) {
                this._mergePoints(data[key], newData[key]);
            }

            if(newData[key].elements !== undefined){
                for(let i in newData[key].elements){
                    if(newData[key].elements.hasOwnProperty(i)){
                        let newElm = newData[key].elements[i];
                        if(data[key].elements[i] == undefined){
                            data[key].elements[i] = newElm;
                        }else{
                            this._traversMerge(data[key].elements[i].elements, newElm.elements)
                        }
                    }
                }
            }

        }
    }

    increment(event) {

        let attentionInElement = HeatmapUtils.getElementAttentionArea(event);
        let elements = event.path != undefined ? event.path : HeatmapUtils.getEventPath(event);
        elements = elements.reverse().slice(3);


        let subtree = this.collectedData;

        for (let i = 0; i < elements.length; i++) {

            let elm = elements[i];

            let position = HeatmapUtils.getPositionBetweenSiblings(elm);
            let key = elm.tagName + '' + ELEMENT_POSITION_SEPARATOR + '' + position;

            let attentionKey = attentionInElement.x + '' + attentionInElement.y;

            if (subtree[key] == undefined) {
                subtree[key] = {elements: {}};
                if (i == (elements.length - 1)) {
                    subtree[key].points = {};
                }
            }

            if (i == (elements.length - 1)) {

                if (subtree[key].points == undefined) {
                    subtree[key].points = {};
                }

                if (subtree[key].points[attentionKey] == undefined) {
                    subtree[key].points[attentionKey] = 1;
                } else {
                    subtree[key].points[attentionKey]++;
                }

            } else {
                subtree = subtree[key].elements;
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

                if (currentElm == undefined)
                    continue;

                if (typeof element[key].elements == "object") {

                    domElements.push(currentElm);
                    this._traversTree(element[key].elements, domElements);

                }

                if (element[key].points !== undefined) {

                    // pridame vsetky body siete v elemente
                    // element je rozdeleny na siet 10x10
                    for (let attentioKey in element[key].points) {

                        if (element[key].points.hasOwnProperty(attentioKey) === false) {
                            continue;
                        }

                        let k = attentioKey.toString();
                        let elmPosition = HeatmapUtils.getElementAttentionAreaPosition(currentElm, k[0], k[1], domElements[0]);

                        // pridame data na vykraslenie heatmapy
                        this.heatmapData.points.push({
                            x: elmPosition.x, // x coordinate of the datapoint, a number
                            y: elmPosition.y, // y coordinate of the datapoint, a number
                            value: element[key].points[attentioKey] // the value at datapoint(x,
                        });

                        this.heatmapData.max = Math.max(this.heatmapData.max, element[key].points[attentioKey]);
                        this.heatmapData.min = Math.min(this.heatmapData.min, element[key].points[attentioKey]);
                    }
                }
            }
            domElements.pop();
        }
    }


    getDataForHeatmap(doc) {

        let DOMElements = [doc != undefined ? doc : document.documentElement];
        if(doc != undefined){
            DOMElements.push(doc.getElementsByTagName('html')[0]);
        }

        this.heatmapData = {
            points: [],
            min: 100000,
            max: 0
        };

        if (typeof this.collectedData == "object") {
            this._traversTree(this.collectedData, DOMElements);
        }

        return this.heatmapData;

    }

}

export {TreeStructureDetailed};