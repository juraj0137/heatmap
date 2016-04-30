import {HeatmapUtils} from './../utils';

const ELEMENT_POSITION_SEPARATOR = '?';

/**
 * Trieda reprezentuje strukturu zaznamenanych dat u navstevnika
 *
 * Created by juraj on 12.03.2016.
 * @class
 */
class TreeStructureDetailedClient {

    /**
     * @constructor
     */
    constructor() {
        this.collectedData = {};
    }

    /**
     * Inkrementuje pocet, kolko krat sa na danom elemente nachadzal kurzor, resp. kolko krat sa kliklo
     *
     * @param event Event (MouseMoveEvent|MouseClickEvent)
     * @param isClick boolean
     */
    increment(event, isClick = false) {

        let attention = HeatmapUtils.getElementAttentionArea(event),
            elements = event.path != undefined ? event.path : HeatmapUtils.getEventPath(event),
            subtree = this.collectedData,
            type = isClick ? 'clicks' : 'movements';

        elements = elements.reverse().slice(3);

        for (let i = 0; i < elements.length; i++) {

            let current = elements[i],
                position = HeatmapUtils.getPositionBetweenSiblings(current),
                key = current.tagName + '' + ELEMENT_POSITION_SEPARATOR + '' + position,
                attentionKey = attention.x + '' + attention.y;

            if (subtree[key] == undefined) {

                subtree[key] = {children: {}};
                if (i == (elements.length - 1))
                    subtree[key][type] = {};

            }

            if (i == (elements.length - 1)) {
                // posledna iteracia, posledny element

                if (subtree[key][type] == undefined)
                    subtree[key][type] = {};

                subtree[key][type][attentionKey] = subtree[key][type][attentionKey] == undefined ? 1 : subtree[key][type][attentionKey] + 1;

            } else {
                subtree = subtree[key].children;
            }
        }
    }
}

export {TreeStructureDetailedClient};