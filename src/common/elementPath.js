import {HeatmapUtils} from './utils';

export const ELEMENT_JOINER = '|';
export const ELEMENT_POSITION_SEPARATOR = '?';
export const ELEMENT_UNDEFINED_POSITION = -1;
export const ELEMENT_MAPPING = {
    "a": 1,
    "abbr": 2,
    "acronym": 3,
    "address": 4,
    "applet": 5,
    "area": 6,
    "article": 7,
    "aside": 8,
    "audio": 9,
    "b": 10,
    "base": 11,
    "basefont": 12,
    "bdi": 13,
    "bdo": 14,
    "big": 15,
    "blockquote": 16,
    "body": 17,
    "br": 18,
    "button": 19,
    "canvas": 20,
    "caption": 21,
    "center": 22,
    "cite": 23,
    "code": 24,
    "col": 25,
    "colgroup": 26,
    "datalist": 27,
    "dd": 28,
    "del": 29,
    "details": 30,
    "dfn": 31,
    "dialog": 32,
    "dir": 33,
    "div": 34,
    "dl": 35,
    "dt": 36,
    "em": 37,
    "embed": 38,
    "fieldset": 39,
    "figcaption": 40,
    "figure": 41,
    "font": 42,
    "footer": 43,
    "form": 44,
    "frame": 45,
    "frameset": 46,
    "h1": 47,
    "h2": 48,
    "h3": 49,
    "h4": 50,
    "h5": 51,
    "h6": 52,
    "head": 53,
    "header": 54,
    "hr": 55,
    "html": 56,
    "i": 57,
    "iframe": 58,
    "img": 59,
    "input": 60,
    "ins": 61,
    "kbd": 62,
    "keygen": 63,
    "label": 64,
    "legend": 65,
    "li": 66,
    "link": 67,
    "main": 68,
    "map": 69,
    "mark": 70,
    "menu": 71,
    "menuitem": 72,
    "meta": 73,
    "meter": 74,
    "nav": 75,
    "noframes": 76,
    "noscript": 77,
    "object": 78,
    "ol": 79,
    "optgroup": 80,
    "option": 81,
    "output": 82,
    "p": 83,
    "param": 84,
    "pre": 85,
    "progress": 86,
    "q": 87,
    "rp": 88,
    "rt": 89,
    "ruby": 90,
    "s": 91,
    "samp": 92,
    "script": 93,
    "section": 94,
    "select": 95,
    "small": 96,
    "source": 97,
    "span": 98,
    "strike": 99,
    "strong": 100,
    "style": 101,
    "sub": 102,
    "summary": 103,
    "sup": 104,
    "table": 105,
    "tbody": 106,
    "td": 107,
    "textarea": 108,
    "tfoot": 109,
    "th": 110,
    "thead": 111,
    "time": 112,
    "title": 113,
    "tr": 114,
    "track": 115,
    "tt": 116,
    "u": 117,
    "ul": 118,
    "var": 119,
    "video": 120,
    "wbr": 121
};

export class ElementPath {

    static getPathToRoot(elementArray) {

        var tmpArray = [];
        for (let i = 0; i < elementArray.length; i++) {
            if (elementArray.hasOwnProperty(i)) {
                if ((elementArray[i] instanceof Window || elementArray[i] instanceof Document) == false) {

                    var elmID = ElementPath.createElementId(elementArray[i]);

                    if (typeof elmID != 'undefined') {
                        tmpArray.push(elmID);
                    }
                }
            }
        }
        tmpArray = tmpArray.reverse();

        return tmpArray.join(ELEMENT_JOINER);
    }

    static createElementId(element) {

        var elmID = '';
        if (typeof element.localName != 'undefined') {
            elmID = element.localName;

            // premapujeme stringove nazvy na cisla
            if (typeof ELEMENT_MAPPING[element.localName] != "undefined") {
                elmID = "" + ELEMENT_MAPPING[element.localName];
            }

            //ziskame poziciu medzi surodeneckymi elementami
            if (element.parentElement != null) {
                var index = -1;
                for (let i = 0; i < element.parentElement.children.length; i++) {
                    if (element.parentElement.children[i] === element) {
                        index = i;
                        break;
                    }
                }
                elmID += ELEMENT_POSITION_SEPARATOR + index;
            }
        }
        return elmID;
    }

    static getElementsFromPath(path){
        if (typeof path == "undefined" || path.length == 0) {
            return [];
        }

        return path.split(ELEMENT_JOINER).map((elm) => {
            return ElementPath.getElementNameFromCode(elm);
        });
    }

    static getElementNameFromCode(code) {

        if (typeof code == "undefined" || code.length == 0) {
            return '';
        }

        let codeFragments = code.split(ELEMENT_POSITION_SEPARATOR),
            tagCode = typeof codeFragments[0] == "string" ? codeFragments[0] : 0,
            elmPosition = typeof codeFragments[1] == "string" ? codeFragments[1] : ELEMENT_UNDEFINED_POSITION,
            returnData = {
                elementTagName: '',
                elementSiblingPosition: elmPosition
            };

        let flippedMapping = HeatmapUtils.arrayFlip(ELEMENT_MAPPING);
        if (typeof flippedMapping[tagCode] == "string") {
            returnData.elementTagName = flippedMapping[tagCode];
        }

        return returnData;

    }

}