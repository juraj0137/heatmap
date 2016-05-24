const ELEMENT_POSITION_SEPARATOR = '?';
const ELEMENT_DIVIDE_COLUMNS = 10;
const ELEMENT_DIVIDE_ROWS = 10;

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

        let attention = TreeStructureDetailedClient.getElementAttentionArea(event),
            elements = event.path != undefined ? event.path : TreeStructureDetailedClient.getEventPath(event),
            subtree = this.collectedData,
            type = isClick ? 'clicks' : 'movements';

        elements = elements.reverse().slice(3);

        for (let i = 0; i < elements.length; i++) {

            let current = elements[i],
                position = this._getPositionBetweenSiblings(current),
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

    /**
     * Vrati poziciu medzi surodeneckymi elementami
     *
     * @param element {HTMLElement}
     * @return {number}
     * @private
     */
    _getPositionBetweenSiblings(element) {
        var index = -1;
        if (element.parentElement != null) {

            let children = element.parentElement.children;
            return Object.keys(children).filter((key)=> {
                if (isNaN(parseInt(key)))
                    return false;

                return children[key].tagName == element.tagName;
            }).map((key)=> {
                return children[key];
            }).indexOf(element);
        }
        return index;
    }

    /**
     * @param event {MouseEvent}
     * @return {Array}
     * @static
     */
    static getEventPath(event) {
        var path = [];
        var node = event.target;
        while (node != undefined) {
            path.push(node);
            node = node.parentNode;
        }
        if (path.length > 0) {
            path.push(window);
        }
        return path;
    }

    /**
     * Returns attention area of element
     * Rozdeli element na siet, ELEMENT_DIVIDE_COLUMNS x ELEMENT_DIVIDE_ROWS a vrati hodnotu podla toho, v ktorej casti elementu sa kurzor nachadza
     * @param event
     * @returns {{x: number, y: number}}
     * @static
     */
    static getElementAttentionArea(event) {

        let pageX = event.pageX;
        let pageY = event.pageY;

        var box = event.target.getBoundingClientRect();
        var body = document.body;
        var docElem = document.documentElement;

        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

        var clientTop = docElem.clientTop || body.clientTop || 0;
        var clientLeft = docElem.clientLeft || body.clientLeft || 0;

        var elmX = pageX - (box.left + scrollLeft - clientLeft);
        var elmY = pageY - (box.top + scrollTop - clientTop);

        var x = Math.floor((elmX * ELEMENT_DIVIDE_COLUMNS ) / box.width);
        var y = Math.floor((elmY * ELEMENT_DIVIDE_ROWS ) / box.height);

        return {x: x, y: y};
    }
}

export {
    TreeStructureDetailedClient,
    ELEMENT_DIVIDE_COLUMNS,
    ELEMENT_DIVIDE_ROWS
};