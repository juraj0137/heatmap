class HeatmapUtils {

    /**
     * Returns center position of element
     * @param elem
     * @param paDoc optional
     * @returns {{x: number, y: number}}
     */
    static getElementCenterPosition(elem, paDoc) {

        var doc = paDoc !== undefined ? paDoc : document;

        // (1)
        var box = elem.getBoundingClientRect();
        var body = doc.body;
        var docElem = document.documentElement;

        // (2)
        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

        // (3)
        var clientTop = docElem.clientTop || body.clientTop || 0;
        var clientLeft = docElem.clientLeft || body.clientLeft || 0;

        // (4)
        var top = (box.top + scrollTop - clientTop) + (box.height / 2);
        var left = ((box.left + scrollLeft - clientLeft) + (box.width / 2));

        return {x: Math.round(left), y: Math.round(top)};
    }

    static getElementAttentionAreaPosition(element, x, y, document) {

        let box = element.getBoundingClientRect();
        let centerOfElement = this.getElementCenterPosition(element, document);

        let top = centerOfElement.y - (box.height / 2);
        let left = centerOfElement.x - (box.width / 2);

        return {
            x: Math.round(left + ((box.width / 10) * x ) + (box.width / 20)),
            y: Math.round(top + ((box.height / 10) * y ) + (box.height / 20))
        };

    }
}

export {HeatmapUtils};