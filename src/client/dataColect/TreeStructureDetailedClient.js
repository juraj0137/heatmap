/**
 * Created by juraj on 12.03.2016.
 */

import {ELEMENT_POSITION_SEPARATOR} from './../../common/elementPath';
import {HeatmapUtils} from './../../common/utils';

class TreeStructureDetailedClient {

    constructor() {
        this.collectedData = {};
    }

    increment(event, isClick = false) {

        let attentionInElement = HeatmapUtils.getElementAttentionArea(event);
        let elements = event.path != undefined ? event.path : HeatmapUtils.getEventPath(event);
        elements = elements.reverse().slice(3);


        let subtree = this.collectedData;
        let type = isClick ? 'clicks' : 'movements';

        for (let i = 0; i < elements.length; i++) {

            let elm = elements[i];

            let position = HeatmapUtils.getPositionBetweenSiblings(elm);
            let key = elm.tagName + '' + ELEMENT_POSITION_SEPARATOR + '' + position;

            let attentionKey = attentionInElement.x + '' + attentionInElement.y;

            if (subtree[key] == undefined) {
                subtree[key] = {children: {}};
                if (i == (elements.length - 1)) {
                    subtree[key][type] = {};
                }
            }

            if (i == (elements.length - 1)) {


                if (subtree[key][type] == undefined) {
                    subtree[key][type] = {};
                }

                if (subtree[key][type][attentionKey] == undefined) {
                    subtree[key][type][attentionKey] = 1;
                } else {
                    subtree[key][type][attentionKey]++;
                }

            } else {
                subtree = subtree[key].children;
            }
        }
    }
}

export {TreeStructureDetailedClient};