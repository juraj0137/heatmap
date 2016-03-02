export class HeatmapUtils {

    /**
     * Returns center position of element
     * @param elem
     * @returns {{x: number, y: number}}
     */
    static getElementPosition(elem) {

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

}
