class HeatmapUtils {

    /**
     * Returns center position of element
     * @param elem
     * @returns {{x: number, y: number}}
     */
    static getElementCenterPosition(elem) {

        // (1)
        var box = elem.getBoundingClientRect();
        var body = document.body;
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

    static getElementAttentionAreaPosition(element, x, y) {

        let box = element.getBoundingClientRect();
        let centerOfElement = this.getElementCenterPosition(element);

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
            for (let i = 0; i < element.parentElement.children.length; i++) {
                if (element.parentElement.children[i] === element) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }

    /**
     * Flip array, key will be value and value will be key of array
     * @param trans
     * @returns {{}}
     */
    static arrayFlip(trans) {
        var key, tmp_ar = {};

        for (key in trans) {
            if (trans.hasOwnProperty(key)) {
                tmp_ar[trans[key]] = key;
            }
        }

        return tmp_ar;
    }

    /**
     * Returns the approximate memory usage, in bytes, of the specified object. The
     * parameter is:
     *
     * object - the object whose size should be determined
     */
    static sizeof(object) {
        var objectList = [];
        var stack = [object];
        var bytes = 0;

        while (stack.length) {
            var value = stack.pop();

            if (typeof value === 'boolean') {
                bytes += 4;
            }
            else if (typeof value === 'string') {
                bytes += value.length * 2;
            }
            else if (typeof value === 'number') {
                bytes += 8;
            }
            else if
            (
                typeof value === 'object'
                && objectList.indexOf(value) === -1
            ) {
                objectList.push(value);

                for (var i in value) {
                    stack.push(value[i]);
                }
            }
        }
        return bytes;
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