import {ElementPath, ELEMENT_JOINER} from './elementPath';
import {HeatmapUtils} from './utils';

/**
 * Trieda na uchovavanie zaznamenanych dat, nepouziva sa, sluzila iba pri vyvoji, navrhu a testovani
 *
 * Created by juraj on 12.03.2016.
 * @deprecated
 * @class
 */
class TreeStructure {

    constructor() {
        this.collectedData = {};
    }

    increment(event) {
        const key = ElementPath.getPathToRoot(event.path);
        let elements = key.split(ELEMENT_JOINER);
        let subtree = this.collectedData;
        
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

    _traversTree(element, domElements) {

        if (typeof element == "object") {

            for (let key in element) {
                if (element.hasOwnProperty(key) === false)
                    continue;

                let splitKey = ElementPath.getElementNameFromCode(key);
                let currentElm = domElements[domElements.length - 1].children[splitKey.elementSiblingPosition];

                if (typeof element[key] == "object") {

                    domElements.push(currentElm);
                    this._traversTree(element[key], domElements);

                } else {

                    let elmPosition = HeatmapUtils.getElementCenterPosition(currentElm);

                    // pridame data na vykraslenie heatmapy
                    this.heatmapData.points.push({
                        x: elmPosition.x, // x coordinate of the datapoint, a number
                        y: elmPosition.y, // y coordinate of the datapoint, a number
                        value: element[key] // the value at datapoint(x,
                    });

                    this.heatmapData.max = Math.max(this.heatmapData.max, element[key]);
                    this.heatmapData.min = Math.min(this.heatmapData.min, element[key]);

                }
            }
            domElements.pop();
        }
    }

    getDataForHeatmap() {

        let DOMElements = [document];
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

export {TreeStructure};