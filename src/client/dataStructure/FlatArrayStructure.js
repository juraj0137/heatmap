import {ElementPath} from './elementPath';
import {HeatmapUtils} from './../utils';

/**
 * Trieda na uchovavanie zaznamenanych dat, nepouziva sa, sluzila iba pri vyvoji, navrhu a testovani
 *
 * Created by juraj on 12.03.2016.
 * @deprecated
 * @class
 */
class FlatArrayStructure {

    constructor() {
        this.collectedData = {};
    }

    increment(event) {
        const key = ElementPath.getPathToRoot(event.path);
        if (typeof this.collectedData[key] == "undefined") {
            this.collectedData[key] = 0;
        }
        this.collectedData[key]++;
    }

    getDataForHeatmap() {
        
        let splitPath;
        let heatmapData = {
            points: [],
            min: 100000,
            max: 0
        };

        for (let pathKey in this.collectedData) {
            if (this.collectedData.hasOwnProperty(pathKey) === false)
                continue;

            splitPath = ElementPath.getElementsFromPath(pathKey);

            if (typeof splitPath != "object")
                continue;

            // najdeme koncovy element
            let currentElement = this._findCurrentElement(splitPath);

            // zistime poziciu koncoveho elementu
            if (typeof currentElement != "undefined") {
                let elmPosition = HeatmapUtils.getElementCenterPosition(currentElement);

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
        
        return heatmapData;

    }

    _findCurrentElement(splitPath) {
        let currentElement = document;
        for (let elmKey in splitPath) {
            if (splitPath.hasOwnProperty(elmKey) === false)
                continue;

            if (currentElement instanceof Node) {
                let elmObj = splitPath[elmKey];
                if (elmObj.elementTagName == 'html') {
                    currentElement = currentElement.getElementsByTagName('html')[0];
                } else {
                    currentElement = currentElement.children[elmObj.elementSiblingPosition];
                }
            }
        }
        return currentElement;
    }

}

export {FlatArrayStructure};