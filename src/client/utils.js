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

    /**
     * Returns attention area of element
     * Rozdeli element na siet, 10x10 a vrati hodnotu podla toho, v ktorej casti elementu sa kurzor nachadza
     * @param event
     * @returns {{x: number, y: number}}
     */
    static getElementAttentionArea(event) {

        //console.log(elem);

        let pageX = event.pageX;
        let pageY = event.pageY;

        // (1)
        var box = event.target.getBoundingClientRect();
        var body = document.body;
        var docElem = document.documentElement;

        // (2)
        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

        // (3)
        var clientTop = docElem.clientTop || body.clientTop || 0;
        var clientLeft = docElem.clientLeft || body.clientLeft || 0;

        // (4)
        var elmX = pageX - (box.left + scrollLeft - clientLeft);
        var elmY = pageY - (box.top + scrollTop - clientTop);

        var x = Math.floor((elmX * 10 ) / box.width);
        var y = Math.floor((elmY * 10 ) / box.height);

        return {x: x, y: y};
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

    static getPositionBetweenSiblings(element) {
        var index = -1;
        if (element.parentElement != null) {

            let children = element.parentElement.children;
            return Object.keys(children).filter((key)=>{
                if(isNaN( parseInt(key) ))
                    return false;

                return children[key].tagName == element.tagName;
            }).map((key)=>{
                return children[key];
            }).indexOf(element);
        }
        return index;
    }

    static uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static isEmptyObject(obj) {

        // null a undefined su "empty"
        if (obj == null) return true;

        // rozhodnutie na zaklade dlzky
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    }


}

export {HeatmapUtils};