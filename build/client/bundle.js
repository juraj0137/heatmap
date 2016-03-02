/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _elementPath = __webpack_require__(1);
	
	var _utils = __webpack_require__(2);
	
	var _config = __webpack_require__(3);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Heatmap = function () {
	    function Heatmap() {
	        var enable = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	        var massRatio = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
	
	        _classCallCheck(this, Heatmap);
	
	        if (enable === true && massRatio >= 0 && massRatio <= 100) {
	            if (Math.random() <= massRatio / 100) {
	                this.init();
	                this.bindEvents();
	            }
	        }
	    }
	
	    _createClass(Heatmap, [{
	        key: 'init',
	        value: function init() {
	            var _this = this;
	
	            this.collectedData = {};
	            this.collectedDataTree = {};
	
	            this.heatmap = null;
	            document.addEventListener('DOMContentLoaded', function () {
	                if ((typeof h337 === 'undefined' ? 'undefined' : _typeof(h337)) == "object") {
	                    _this.heatmap = h337.create({
	                        container: document.getElementsByTagName('body')[0]
	                    });
	                }
	            });
	
	            var self = this;
	            document.addEventListener('keydown', function (e) {
	                var evtobj = window.event ? event : e;
	                if (evtobj.keyCode == 81 && evtobj.ctrlKey) self.showHeatmap();
	            });
	
	            var resizeTimer = null;
	            window.addEventListener('resize', function () {
	                clearTimeout(resizeTimer);
	                resizeTimer = setTimeout(function () {
	                    _this.showHeatmapFromFlatArray();
	                }, 300);
	            });
	
	            //ukladanie dat do localstroage
	            setInterval(function () {
	                _this.saveDataToLocalstorage();
	            }, 1000);
	        }
	    }, {
	        key: 'showHeatmap',
	        value: function showHeatmap() {
	            console.log('show heatmap');
	            this.showHeatmapFromFlatArray();
	        }
	    }, {
	        key: 'showHeatmapFromFlatArray',
	        value: function showHeatmapFromFlatArray() {
	            var splittedPath = undefined;
	            var heatmapData = {
	                points: [],
	                min: 100000,
	                max: 0
	            };
	
	            var key = location.hostname + '' + location.pathname;
	            if (localStorage.getItem(key) != null) {
	                this.collectedData = JSON.parse(localStorage.getItem(key));
	            }
	
	            for (var pathKey in this.collectedData) {
	
	                if (this.collectedData.hasOwnProperty(pathKey) == false) continue;
	
	                splittedPath = _elementPath.ElementPath.getElementsFromPath(pathKey);
	
	                if ((typeof splittedPath === 'undefined' ? 'undefined' : _typeof(splittedPath)) == "object") {
	
	                    // najdeme koncovy element
	                    var currentElement = document;
	                    for (var elmKey in splittedPath) {
	                        if (splittedPath.hasOwnProperty(elmKey) == false) continue;
	
	                        if (currentElement instanceof Node) {
	                            var elmObj = splittedPath[elmKey];
	                            if (elmObj.elementTagName == 'html') {
	                                currentElement = currentElement.getElementsByTagName('html')[0];
	                            } else {
	                                currentElement = currentElement.children[elmObj.elementSiblingPosition];
	                            }
	                        }
	                    }
	
	                    // zistime poziciu koncoveho elementu
	                    if (typeof currentElement != "undefined") {
	                        var elmPosition = _utils.HeatmapUtils.getElementPosition(currentElement);
	
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
	            }
	
	            if (this.heatmap == null) {
	                if ((typeof h337 === 'undefined' ? 'undefined' : _typeof(h337)) == "object") {
	                    this.heatmap = h337.create({
	                        container: document.getElementsByTagName('body')[0]
	                    });
	                }
	
	                document.getElementsByClassName('heatmap-canvas')[0].style.zIndex = 10000;
	            }
	
	            if (_typeof(this.heatmap) == "object") {
	                this.heatmap.setData({
	                    max: heatmapData.max,
	                    min: heatmapData.min,
	                    data: heatmapData.points
	                });
	            }
	        }
	    }, {
	        key: 'bindEvents',
	        value: function bindEvents() {
	
	            var self = this;
	            window.addEventListener('load', function () {
	
	                var currentElement = null;
	                document.addEventListener('mousemove', function (event) {
	
	                    // pokracujeme iba ak sme sa pohli na iny element
	                    if (currentElement != event.target) {
	
	                        currentElement = event.target;
	                        self.onMouseMove(event);
	                    }
	                });
	            });
	        }
	    }, {
	        key: 'onMouseMove',
	        value: function onMouseMove(event) {
	            var path = _elementPath.ElementPath.getPathToRoot(event.path);
	            this.incrementByKey(path);
	            this.incrementInTree(path);
	            //var message = new Message(Message.SENDER_CLIENT, Message.ACTION_COLLECT, path);
	            //this._websocket.send(message);
	        }
	    }, {
	        key: 'incrementByKey',
	        value: function incrementByKey(key) {
	            if (typeof this.collectedData[key] == "undefined") {
	                this.collectedData[key] = 0;
	            }
	            this.collectedData[key]++;
	        }
	    }, {
	        key: 'incrementInTree',
	        value: function incrementInTree(key) {
	            //debugger;
	            var elements = key.split(_elementPath.ELEMENT_JOINER);
	            var subtree = this.collectedDataTree;
	            var currentSubtree = subtree;
	
	            for (var i = 0; i < elements.length; i++) {
	                var elm = elements[i];
	                if (typeof subtree[elm] == "undefined") {
	                    if (i == elements.length - 1) {
	                        subtree[elm] = 0;
	                    } else {
	                        subtree[elm] = {};
	                    }
	                }
	                if (i == elements.length - 1) {
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
	    }, {
	        key: 'saveDataToLocalstorage',
	        value: function saveDataToLocalstorage() {
	            if ((typeof localStorage === 'undefined' ? 'undefined' : _typeof(localStorage)) == "object") {
	                var lsKey = location.hostname + '' + location.pathname;
	
	                var lsData = localStorage.getItem(lsKey);
	                if (lsData != null) {
	                    lsData = JSON.parse(lsData);
	                }
	
	                if (Object.keys(lsData).length > 0) {
	                    // aktualizuj udaje
	                    for (var key in this.collectedData) {
	                        if (this.collectedData.hasOwnProperty(key)) {
	
	                            if (typeof lsData[key] == "undefined") {
	                                lsData[key] = this.collectedData[key];
	                            } else {
	                                lsData[key] += this.collectedData[key];
	                            }
	                            this.collectedData[key] = 0;
	                        }
	                    }
	                    var kvak = lsData;
	                    kvak = JSON.stringify(kvak);
	                    localStorage.setItem(lsKey, kvak);
	                } else {
	                    // vytvor kluc a uloz udaje
	                    localStorage.setItem(lsKey, JSON.stringify(this.collectedData));
	                    this.collectedData = {};
	                }
	            }
	        }
	    }]);
	
	    return Heatmap;
	}();
	
	var heatmap = new Heatmap(_config.configHeatmap.enable, _config.configHeatmap.population);
	
	exports.default = Heatmap;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ElementPath = exports.ELEMENT_MAPPING = exports.ELEMENT_UNDEFINED_POSITION = exports.ELEMENT_POSITION_SEPARATOR = exports.ELEMENT_JOINER = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(2);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ELEMENT_JOINER = exports.ELEMENT_JOINER = '|';
	var ELEMENT_POSITION_SEPARATOR = exports.ELEMENT_POSITION_SEPARATOR = '?';
	var ELEMENT_UNDEFINED_POSITION = exports.ELEMENT_UNDEFINED_POSITION = -1;
	var ELEMENT_MAPPING = exports.ELEMENT_MAPPING = {
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
	
	var ElementPath = exports.ElementPath = function () {
	    function ElementPath() {
	        _classCallCheck(this, ElementPath);
	    }
	
	    _createClass(ElementPath, null, [{
	        key: 'getPathToRoot',
	        value: function getPathToRoot(elementArray) {
	
	            var tmpArray = [];
	            for (var i = 0; i < elementArray.length; i++) {
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
	    }, {
	        key: 'createElementId',
	        value: function createElementId(element) {
	
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
	                    for (var i = 0; i < element.parentElement.children.length; i++) {
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
	    }, {
	        key: 'getElementsFromPath',
	        value: function getElementsFromPath(path) {
	            if (typeof path == "undefined" || path.length == 0) {
	                return [];
	            }
	
	            return path.split(ELEMENT_JOINER).map(function (elm) {
	                return ElementPath.getElementNameFromCode(elm);
	            });
	        }
	    }, {
	        key: 'getElementNameFromCode',
	        value: function getElementNameFromCode(code) {
	
	            if (typeof code == "undefined" || code.length == 0) {
	                return '';
	            }
	
	            var codeFragments = code.split(ELEMENT_POSITION_SEPARATOR),
	                tagCode = typeof codeFragments[0] == "string" ? codeFragments[0] : 0,
	                elmPosition = typeof codeFragments[1] == "string" ? codeFragments[1] : ELEMENT_UNDEFINED_POSITION,
	                returnData = {
	                elementTagName: '',
	                elementSiblingPosition: elmPosition
	            };
	
	            var flippedMapping = _utils.HeatmapUtils.arrayFlip(ELEMENT_MAPPING);
	            if (typeof flippedMapping[tagCode] == "string") {
	                returnData.elementTagName = flippedMapping[tagCode];
	            }
	
	            return returnData;
	        }
	    }]);
	
	    return ElementPath;
	}();

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var HeatmapUtils = exports.HeatmapUtils = function () {
	    function HeatmapUtils() {
	        _classCallCheck(this, HeatmapUtils);
	    }
	
	    _createClass(HeatmapUtils, null, [{
	        key: 'getElementPosition',
	
	
	        /**
	         * Returns center position of element
	         * @param elem
	         * @returns {{x: number, y: number}}
	         */
	        value: function getElementPosition(elem) {
	
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
	            var top = box.top + scrollTop - clientTop + box.height / 2;
	            var left = box.left + scrollLeft - clientLeft + box.width / 2;
	
	            return { x: Math.round(left), y: Math.round(top) };
	        }
	
	        /**
	         * Flip array, key will be value and value will be key of array
	         * @param trans
	         * @returns {{}}
	         */
	
	    }, {
	        key: 'arrayFlip',
	        value: function arrayFlip(trans) {
	            var key,
	                tmp_ar = {};
	
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
	
	    }, {
	        key: 'sizeof',
	        value: function sizeof(object) {
	            var objectList = [];
	            var stack = [object];
	            var bytes = 0;
	
	            while (stack.length) {
	                var value = stack.pop();
	
	                if (typeof value === 'boolean') {
	                    bytes += 4;
	                } else if (typeof value === 'string') {
	                    bytes += value.length * 2;
	                } else if (typeof value === 'number') {
	                    bytes += 8;
	                } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && objectList.indexOf(value) === -1) {
	                    objectList.push(value);
	
	                    for (var i in value) {
	                        stack.push(value[i]);
	                    }
	                }
	            }
	            return bytes;
	        }
	    }]);
	
	    return HeatmapUtils;
	}();

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var configWS = exports.configWS = {
	    port: '80',
	    address: 'ws://178.62.236.94',
	    collectPath: '/collect'
	};
	
	var configHeatmap = exports.configHeatmap = {
	    enable: true, // enable tracking
	    population: 100 // percent
	};

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTQzZTBiOTVkNmRmMDZiYzIxYTg/YzgyMiIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vZWxlbWVudFBhdGguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2NvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQ2xDTTtBQUNGLGNBREUsT0FDRixHQUE0QzthQUFoQywrREFBUyxvQkFBdUI7YUFBakIsa0VBQVksbUJBQUs7OytCQUQxQyxTQUMwQzs7QUFDeEMsYUFBSSxXQUFXLElBQVgsSUFBbUIsYUFBYSxDQUFiLElBQWtCLGFBQWEsR0FBYixFQUFrQjtBQUN2RCxpQkFBSSxLQUFLLE1BQUwsTUFBaUIsWUFBWSxHQUFaLEVBQWlCO0FBQ2xDLHNCQUFLLElBQUwsR0FEa0M7QUFFbEMsc0JBQUssVUFBTCxHQUZrQztjQUF0QztVQURKO01BREo7O2tCQURFOztnQ0FVSzs7O0FBRUgsa0JBQUssYUFBTCxHQUFxQixFQUFyQixDQUZHO0FBR0gsa0JBQUssaUJBQUwsR0FBeUIsRUFBekIsQ0FIRzs7QUFLSCxrQkFBSyxPQUFMLEdBQWUsSUFBZixDQUxHO0FBTUgsc0JBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQUs7QUFDL0MscUJBQUksUUFBTyxtREFBUCxJQUFlLFFBQWYsRUFBeUI7QUFDekIsMkJBQUssT0FBTCxHQUFlLEtBQUss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K0JBQU0sSUFBTixDQUFXLE1BQU0sQ0FBTixDQUFYLEVBRGlCO3NCQUFyQjtrQkFQQztjQVpUO0FBd0JBLG9CQUFPLEtBQVAsQ0E3QmtCOzs7O1lBcERiOzs7Ozs7Ozs7Ozs7QUNBTixLQUFNLDhCQUFXO0FBQ3BCLFdBQU0sSUFBTjtBQUNBLGNBQVMsb0JBQVQ7QUFDQSxrQkFBYSxVQUFiO0VBSFM7O0FBTU4sS0FBTSx3Q0FBZ0I7QUFDekIsYUFBUSxJQUFSO0FBQ0EsaUJBQVksR0FBWjtBQUZ5QixFQUFoQixDIiwiZmlsZSI6ImNsaWVudC9idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDk0M2UwYjk1ZDZkZjA2YmMyMWE4XG4gKiovIiwiaW1wb3J0IHtFbGVtZW50UGF0aCwgRUxFTUVOVF9KT0lORVJ9IGZyb20gJy4vLi4vY29tbW9uL2VsZW1lbnRQYXRoJztcbmltcG9ydCB7SGVhdG1hcFV0aWxzfSBmcm9tICcuLy4uL2NvbW1vbi91dGlscyc7XG5pbXBvcnQge2NvbmZpZ1dTLCBjb25maWdIZWF0bWFwfSBmcm9tICcuL2NvbmZpZyc7XG5cbmNsYXNzIEhlYXRtYXAge1xuICAgIGNvbnN0cnVjdG9yKGVuYWJsZSA9IHRydWUsIG1hc3NSYXRpbyA9IDEwMCkge1xuICAgICAgICBpZiAoZW5hYmxlID09PSB0cnVlICYmIG1hc3NSYXRpbyA+PSAwICYmIG1hc3NSYXRpbyA8PSAxMDApIHtcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDw9IG1hc3NSYXRpbyAvIDEwMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcblxuICAgICAgICB0aGlzLmNvbGxlY3RlZERhdGEgPSB7fTtcbiAgICAgICAgdGhpcy5jb2xsZWN0ZWREYXRhVHJlZSA9IHt9O1xuXG4gICAgICAgIHRoaXMuaGVhdG1hcCA9IG51bGw7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKT0+IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaDMzNyA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWF0bWFwID0gaDMzNy5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICBjb250YWluZXI6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGV2dG9iaiA9IHdpbmRvdy5ldmVudCA/IGV2ZW50IDogZVxuICAgICAgICAgICAgaWYgKGV2dG9iai5rZXlDb2RlID09IDgxICYmIGV2dG9iai5jdHJsS2V5KVxuICAgICAgICAgICAgICAgIHNlbGYuc2hvd0hlYXRtYXAoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IHJlc2l6ZVRpbWVyID0gbnVsbDtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChyZXNpemVUaW1lcik7XG4gICAgICAgICAgICByZXNpemVUaW1lciA9IHNldFRpbWVvdXQoKCk9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93SGVhdG1hcEZyb21GbGF0QXJyYXkoKTtcbiAgICAgICAgICAgIH0sIDMwMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vdWtsYWRhbmllIGRhdCBkbyBsb2NhbHN0cm9hZ2VcbiAgICAgICAgc2V0SW50ZXJ2YWwoKCk9PiB7XG4gICAgICAgICAgICB0aGlzLnNhdmVEYXRhVG9Mb2NhbHN0b3JhZ2UoKTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgfVxuXG4gICAgc2hvd0hlYXRtYXAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzaG93IGhlYXRtYXAnKTtcbiAgICAgICAgdGhpcy5zaG93SGVhdG1hcEZyb21GbGF0QXJyYXkoKTtcbiAgICB9XG5cbiAgICBzaG93SGVhdG1hcEZyb21GbGF0QXJyYXkoKSB7XG4gICAgICAgIGxldCBzcGxpdHRlZFBhdGg7XG4gICAgICAgIGxldCBoZWF0bWFwRGF0YSA9IHtcbiAgICAgICAgICAgIHBvaW50czogW10sXG4gICAgICAgICAgICBtaW46IDEwMDAwMCxcbiAgICAgICAgICAgIG1heDogMFxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBrZXkgPSBsb2NhdGlvbi5ob3N0bmFtZSArICcnICsgbG9jYXRpb24ucGF0aG5hbWU7XG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuY29sbGVjdGVkRGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBwYXRoS2V5IGluIHRoaXMuY29sbGVjdGVkRGF0YSkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5jb2xsZWN0ZWREYXRhLmhhc093blByb3BlcnR5KHBhdGhLZXkpID09IGZhbHNlKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBzcGxpdHRlZFBhdGggPSBFbGVtZW50UGF0aC5nZXRFbGVtZW50c0Zyb21QYXRoKHBhdGhLZXkpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHNwbGl0dGVkUGF0aCA9PSBcIm9iamVjdFwiKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBuYWpkZW1lIGtvbmNvdnkgZWxlbWVudFxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50RWxlbWVudCA9IGRvY3VtZW50O1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGVsbUtleSBpbiBzcGxpdHRlZFBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNwbGl0dGVkUGF0aC5oYXNPd25Qcm9wZXJ0eShlbG1LZXkpID09IGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRFbGVtZW50IGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVsbU9iaiA9IHNwbGl0dGVkUGF0aFtlbG1LZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsbU9iai5lbGVtZW50VGFnTmFtZSA9PSAnaHRtbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RWxlbWVudCA9IGN1cnJlbnRFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdodG1sJylbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRFbGVtZW50ID0gY3VycmVudEVsZW1lbnQuY2hpbGRyZW5bZWxtT2JqLmVsZW1lbnRTaWJsaW5nUG9zaXRpb25dO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gemlzdGltZSBwb3ppY2l1IGtvbmNvdmVobyBlbGVtZW50dVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY3VycmVudEVsZW1lbnQgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZWxtUG9zaXRpb24gPSBIZWF0bWFwVXRpbHMuZ2V0RWxlbWVudFBvc2l0aW9uKGN1cnJlbnRFbGVtZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBwcmlkYW1lIGRhdGEgbmEgdnlrcmFzbGVuaWUgaGVhdG1hcHlcbiAgICAgICAgICAgICAgICAgICAgaGVhdG1hcERhdGEucG9pbnRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgeDogZWxtUG9zaXRpb24ueCwgLy8geCBjb29yZGluYXRlIG9mIHRoZSBkYXRhcG9pbnQsIGEgbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiBlbG1Qb3NpdGlvbi55LCAvLyB5IGNvb3JkaW5hdGUgb2YgdGhlIGRhdGFwb2ludCwgYSBudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLmNvbGxlY3RlZERhdGFbcGF0aEtleV0gLy8gdGhlIHZhbHVlIGF0IGRhdGFwb2ludCh4LFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvL2FrdHVhbGl6dWplbWUgbWluIGEgbWF4IGhvZG5vdHUgYm9kb3ZcbiAgICAgICAgICAgICAgICAgICAgaGVhdG1hcERhdGEubWF4ID0gTWF0aC5tYXgoaGVhdG1hcERhdGEubWF4LCB0aGlzLmNvbGxlY3RlZERhdGFbcGF0aEtleV0pO1xuICAgICAgICAgICAgICAgICAgICBoZWF0bWFwRGF0YS5taW4gPSBNYXRoLm1pbihoZWF0bWFwRGF0YS5taW4sIHRoaXMuY29sbGVjdGVkRGF0YVtwYXRoS2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaGVhdG1hcCA9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGgzMzcgPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhdG1hcCA9IGgzMzcuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2hlYXRtYXAtY2FudmFzJylbMF0uc3R5bGUuekluZGV4ID0gMTAwMDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaGVhdG1hcCA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICB0aGlzLmhlYXRtYXAuc2V0RGF0YSh7XG4gICAgICAgICAgICAgICAgbWF4OiBoZWF0bWFwRGF0YS5tYXgsXG4gICAgICAgICAgICAgICAgbWluOiBoZWF0bWFwRGF0YS5taW4sXG4gICAgICAgICAgICAgICAgZGF0YTogaGVhdG1hcERhdGEucG9pbnRzXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBiaW5kRXZlbnRzKCkge1xuXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgbGV0IGN1cnJlbnRFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgICAgICAgICAgICAgLy8gcG9rcmFjdWplbWUgaWJhIGFrIHNtZSBzYSBwb2hsaSBuYSBpbnkgZWxlbWVudFxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50RWxlbWVudCAhPSBldmVudC50YXJnZXQpIHtcblxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50RWxlbWVudCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vbk1vdXNlTW92ZShldmVudCk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSBFbGVtZW50UGF0aC5nZXRQYXRoVG9Sb290KGV2ZW50LnBhdGgpO1xuICAgICAgICB0aGlzLmluY3JlbWVudEJ5S2V5KHBhdGgpO1xuICAgICAgICB0aGlzLmluY3JlbWVudEluVHJlZShwYXRoKTtcbiAgICAgICAgLy92YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKE1lc3NhZ2UuU0VOREVSX0NMSUVOVCwgTWVzc2FnZS5BQ1RJT05fQ09MTEVDVCwgcGF0aCk7XG4gICAgICAgIC8vdGhpcy5fd2Vic29ja2V0LnNlbmQobWVzc2FnZSk7XG5cbiAgICB9XG5cbiAgICBpbmNyZW1lbnRCeUtleShrZXkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmNvbGxlY3RlZERhdGFba2V5XSA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLmNvbGxlY3RlZERhdGFba2V5XSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb2xsZWN0ZWREYXRhW2tleV0rKztcbiAgICB9XG5cbiAgICBpbmNyZW1lbnRJblRyZWUoa2V5KSB7XG4gICAgICAgIC8vZGVidWdnZXI7XG4gICAgICAgIGxldCBlbGVtZW50cyA9IGtleS5zcGxpdChFTEVNRU5UX0pPSU5FUik7XG4gICAgICAgIGxldCBzdWJ0cmVlID0gdGhpcy5jb2xsZWN0ZWREYXRhVHJlZTtcbiAgICAgICAgbGV0IGN1cnJlbnRTdWJ0cmVlID0gc3VidHJlZTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZWxtID0gZWxlbWVudHNbaV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIHN1YnRyZWVbZWxtXSA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gKGVsZW1lbnRzLmxlbmd0aCAtIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnRyZWVbZWxtXSA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3VidHJlZVtlbG1dID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGkgPT0gKGVsZW1lbnRzLmxlbmd0aCAtIDEpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzdWJ0cmVlW2VsbV0gPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgICAgICBzdWJ0cmVlW2VsbV0rKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc3VidHJlZVtlbG1dID09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VidHJlZVtlbG1dID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN1YnRyZWUgPSBzdWJ0cmVlW2VsbV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgfVxuXG4gICAgc2F2ZURhdGFUb0xvY2Fsc3RvcmFnZSgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgbGV0IGxzS2V5ID0gbG9jYXRpb24uaG9zdG5hbWUgKyAnJyArIGxvY2F0aW9uLnBhdGhuYW1lO1xuXG4gICAgICAgICAgICBsZXQgbHNEYXRhID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0obHNLZXkpO1xuICAgICAgICAgICAgaWYgKGxzRGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbHNEYXRhID0gSlNPTi5wYXJzZShsc0RhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihPYmplY3Qua2V5cyhsc0RhdGEpLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgIC8vIGFrdHVhbGl6dWogdWRhamVcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5jb2xsZWN0ZWREYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbGxlY3RlZERhdGEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGxzRGF0YVtrZXldID09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsc0RhdGFba2V5XSA9IHRoaXMuY29sbGVjdGVkRGF0YVtrZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsc0RhdGFba2V5XSArPSB0aGlzLmNvbGxlY3RlZERhdGFba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGVjdGVkRGF0YVtrZXldID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQga3ZhayA9IGxzRGF0YTtcbiAgICAgICAgICAgICAgICBrdmFrID0gSlNPTi5zdHJpbmdpZnkoa3Zhayk7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obHNLZXksIGt2YWspO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHZ5dHZvciBrbHVjIGEgdWxveiB1ZGFqZVxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGxzS2V5LCBKU09OLnN0cmluZ2lmeSh0aGlzLmNvbGxlY3RlZERhdGEpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbGxlY3RlZERhdGEgPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxudmFyIGhlYXRtYXAgPSBuZXcgSGVhdG1hcChjb25maWdIZWF0bWFwLmVuYWJsZSwgY29uZmlnSGVhdG1hcC5wb3B1bGF0aW9uKTtcblxuZXhwb3J0IGRlZmF1bHQgSGVhdG1hcDtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jbGllbnQvaW5kZXguanNcbiAqKi8iLCJpbXBvcnQge0hlYXRtYXBVdGlsc30gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBjb25zdCBFTEVNRU5UX0pPSU5FUiA9ICd8JztcbmV4cG9ydCBjb25zdCBFTEVNRU5UX1BPU0lUSU9OX1NFUEFSQVRPUiA9ICc/JztcbmV4cG9ydCBjb25zdCBFTEVNRU5UX1VOREVGSU5FRF9QT1NJVElPTiA9IC0xO1xuZXhwb3J0IGNvbnN0IEVMRU1FTlRfTUFQUElORyA9IHtcbiAgICBcImFcIjogMSxcbiAgICBcImFiYnJcIjogMixcbiAgICBcImFjcm9ueW1cIjogMyxcbiAgICBcImFkZHJlc3NcIjogNCxcbiAgICBcImFwcGxldFwiOiA1LFxuICAgIFwiYXJlYVwiOiA2LFxuICAgIFwiYXJ0aWNsZVwiOiA3LFxuICAgIFwiYXNpZGVcIjogOCxcbiAgICBcImF1ZGlvXCI6IDksXG4gICAgXCJiXCI6IDEwLFxuICAgIFwiYmFzZVwiOiAxMSxcbiAgICBcImJhc2Vmb250XCI6IDEyLFxuICAgIFwiYmRpXCI6IDEzLFxuICAgIFwiYmRvXCI6IDE0LFxuICAgIFwiYmlnXCI6IDE1LFxuICAgIFwiYmxvY2txdW90ZVwiOiAxNixcbiAgICBcImJvZHlcIjogMTcsXG4gICAgXCJiclwiOiAxOCxcbiAgICBcImJ1dHRvblwiOiAxOSxcbiAgICBcImNhbnZhc1wiOiAyMCxcbiAgICBcImNhcHRpb25cIjogMjEsXG4gICAgXCJjZW50ZXJcIjogMjIsXG4gICAgXCJjaXRlXCI6IDIzLFxuICAgIFwiY29kZVwiOiAyNCxcbiAgICBcImNvbFwiOiAyNSxcbiAgICBcImNvbGdyb3VwXCI6IDI2LFxuICAgIFwiZGF0YWxpc3RcIjogMjcsXG4gICAgXCJkZFwiOiAyOCxcbiAgICBcImRlbFwiOiAyOSxcbiAgICBcImRldGFpbHNcIjogMzAsXG4gICAgXCJkZm5cIjogMzEsXG4gICAgXCJkaWFsb2dcIjogMzIsXG4gICAgXCJkaXJcIjogMzMsXG4gICAgXCJkaXZcIjogMzQsXG4gICAgXCJkbFwiOiAzNSxcbiAgICBcImR0XCI6IDM2LFxuICAgIFwiZW1cIjogMzcsXG4gICAgXCJlbWJlZFwiOiAzOCxcbiAgICBcImZpZWxkc2V0XCI6IDM5LFxuICAgIFwiZmlnY2FwdGlvblwiOiA0MCxcbiAgICBcImZpZ3VyZVwiOiA0MSxcbiAgICBcImZvbnRcIjogNDIsXG4gICAgXCJmb290ZXJcIjogNDMsXG4gICAgXCJmb3JtXCI6IDQ0LFxuICAgIFwiZnJhbWVcIjogNDUsXG4gICAgXCJmcmFtZXNldFwiOiA0NixcbiAgICBcImgxXCI6IDQ3LFxuICAgIFwiaDJcIjogNDgsXG4gICAgXCJoM1wiOiA0OSxcbiAgICBcImg0XCI6IDUwLFxuICAgIFwiaDVcIjogNTEsXG4gICAgXCJoNlwiOiA1MixcbiAgICBcImhlYWRcIjogNTMsXG4gICAgXCJoZWFkZXJcIjogNTQsXG4gICAgXCJoclwiOiA1NSxcbiAgICBcImh0bWxcIjogNTYsXG4gICAgXCJpXCI6IDU3LFxuICAgIFwiaWZyYW1lXCI6IDU4LFxuICAgIFwiaW1nXCI6IDU5LFxuICAgIFwiaW5wdXRcIjogNjAsXG4gICAgXCJpbnNcIjogNjEsXG4gICAgXCJrYmRcIjogNjIsXG4gICAgXCJrZXlnZW5cIjogNjMsXG4gICAgXCJsYWJlbFwiOiA2NCxcbiAgICBcImxlZ2VuZFwiOiA2NSxcbiAgICBcImxpXCI6IDY2LFxuICAgIFwibGlua1wiOiA2NyxcbiAgICBcIm1haW5cIjogNjgsXG4gICAgXCJtYXBcIjogNjksXG4gICAgXCJtYXJrXCI6IDcwLFxuICAgIFwibWVudVwiOiA3MSxcbiAgICBcIm1lbnVpdGVtXCI6IDcyLFxuICAgIFwibWV0YVwiOiA3MyxcbiAgICBcIm1ldGVyXCI6IDc0LFxuICAgIFwibmF2XCI6IDc1LFxuICAgIFwibm9mcmFtZXNcIjogNzYsXG4gICAgXCJub3NjcmlwdFwiOiA3NyxcbiAgICBcIm9iamVjdFwiOiA3OCxcbiAgICBcIm9sXCI6IDc5LFxuICAgIFwib3B0Z3JvdXBcIjogODAsXG4gICAgXCJvcHRpb25cIjogODEsXG4gICAgXCJvdXRwdXRcIjogODIsXG4gICAgXCJwXCI6IDgzLFxuICAgIFwicGFyYW1cIjogODQsXG4gICAgXCJwcmVcIjogODUsXG4gICAgXCJwcm9ncmVzc1wiOiA4NixcbiAgICBcInFcIjogODcsXG4gICAgXCJycFwiOiA4OCxcbiAgICBcInJ0XCI6IDg5LFxuICAgIFwicnVieVwiOiA5MCxcbiAgICBcInNcIjogOTEsXG4gICAgXCJzYW1wXCI6IDkyLFxuICAgIFwic2NyaXB0XCI6IDkzLFxuICAgIFwic2VjdGlvblwiOiA5NCxcbiAgICBcInNlbGVjdFwiOiA5NSxcbiAgICBcInNtYWxsXCI6IDk2LFxuICAgIFwic291cmNlXCI6IDk3LFxuICAgIFwic3BhblwiOiA5OCxcbiAgICBcInN0cmlrZVwiOiA5OSxcbiAgICBcInN0cm9uZ1wiOiAxMDAsXG4gICAgXCJzdHlsZVwiOiAxMDEsXG4gICAgXCJzdWJcIjogMTAyLFxuICAgIFwic3VtbWFyeVwiOiAxMDMsXG4gICAgXCJzdXBcIjogMTA0LFxuICAgIFwidGFibGVcIjogMTA1LFxuICAgIFwidGJvZHlcIjogMTA2LFxuICAgIFwidGRcIjogMTA3LFxuICAgIFwidGV4dGFyZWFcIjogMTA4LFxuICAgIFwidGZvb3RcIjogMTA5LFxuICAgIFwidGhcIjogMTEwLFxuICAgIFwidGhlYWRcIjogMTExLFxuICAgIFwidGltZVwiOiAxMTIsXG4gICAgXCJ0aXRsZVwiOiAxMTMsXG4gICAgXCJ0clwiOiAxMTQsXG4gICAgXCJ0cmFja1wiOiAxMTUsXG4gICAgXCJ0dFwiOiAxMTYsXG4gICAgXCJ1XCI6IDExNyxcbiAgICBcInVsXCI6IDExOCxcbiAgICBcInZhclwiOiAxMTksXG4gICAgXCJ2aWRlb1wiOiAxMjAsXG4gICAgXCJ3YnJcIjogMTIxXG59O1xuXG5leHBvcnQgY2xhc3MgRWxlbWVudFBhdGgge1xuXG4gICAgc3RhdGljIGdldFBhdGhUb1Jvb3QoZWxlbWVudEFycmF5KSB7XG5cbiAgICAgICAgdmFyIHRtcEFycmF5ID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudEFycmF5Lmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKChlbGVtZW50QXJyYXlbaV0gaW5zdGFuY2VvZiBXaW5kb3cgfHwgZWxlbWVudEFycmF5W2ldIGluc3RhbmNlb2YgRG9jdW1lbnQpID09IGZhbHNlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsbUlEID0gRWxlbWVudFBhdGguY3JlYXRlRWxlbWVudElkKGVsZW1lbnRBcnJheVtpXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlbG1JRCAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG1wQXJyYXkucHVzaChlbG1JRCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdG1wQXJyYXkgPSB0bXBBcnJheS5yZXZlcnNlKCk7XG5cbiAgICAgICAgcmV0dXJuIHRtcEFycmF5LmpvaW4oRUxFTUVOVF9KT0lORVIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVFbGVtZW50SWQoZWxlbWVudCkge1xuXG4gICAgICAgIHZhciBlbG1JRCA9ICcnO1xuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnQubG9jYWxOYW1lICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBlbG1JRCA9IGVsZW1lbnQubG9jYWxOYW1lO1xuXG4gICAgICAgICAgICAvLyBwcmVtYXB1amVtZSBzdHJpbmdvdmUgbmF6dnkgbmEgY2lzbGFcbiAgICAgICAgICAgIGlmICh0eXBlb2YgRUxFTUVOVF9NQVBQSU5HW2VsZW1lbnQubG9jYWxOYW1lXSAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgZWxtSUQgPSBcIlwiICsgRUxFTUVOVF9NQVBQSU5HW2VsZW1lbnQubG9jYWxOYW1lXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy96aXNrYW1lIHBvemljaXUgbWVkemkgc3Vyb2RlbmVja3ltaSBlbGVtZW50YW1pXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5wYXJlbnRFbGVtZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAtMTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuW2ldID09PSBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbG1JRCArPSBFTEVNRU5UX1BPU0lUSU9OX1NFUEFSQVRPUiArIGluZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbG1JRDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0RWxlbWVudHNGcm9tUGF0aChwYXRoKXtcbiAgICAgICAgaWYgKHR5cGVvZiBwYXRoID09IFwidW5kZWZpbmVkXCIgfHwgcGF0aC5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhdGguc3BsaXQoRUxFTUVOVF9KT0lORVIpLm1hcCgoZWxtKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gRWxlbWVudFBhdGguZ2V0RWxlbWVudE5hbWVGcm9tQ29kZShlbG0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0RWxlbWVudE5hbWVGcm9tQ29kZShjb2RlKSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb2RlID09IFwidW5kZWZpbmVkXCIgfHwgY29kZS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNvZGVGcmFnbWVudHMgPSBjb2RlLnNwbGl0KEVMRU1FTlRfUE9TSVRJT05fU0VQQVJBVE9SKSxcbiAgICAgICAgICAgIHRhZ0NvZGUgPSB0eXBlb2YgY29kZUZyYWdtZW50c1swXSA9PSBcInN0cmluZ1wiID8gY29kZUZyYWdtZW50c1swXSA6IDAsXG4gICAgICAgICAgICBlbG1Qb3NpdGlvbiA9IHR5cGVvZiBjb2RlRnJhZ21lbnRzWzFdID09IFwic3RyaW5nXCIgPyBjb2RlRnJhZ21lbnRzWzFdIDogRUxFTUVOVF9VTkRFRklORURfUE9TSVRJT04sXG4gICAgICAgICAgICByZXR1cm5EYXRhID0ge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRUYWdOYW1lOiAnJyxcbiAgICAgICAgICAgICAgICBlbGVtZW50U2libGluZ1Bvc2l0aW9uOiBlbG1Qb3NpdGlvblxuICAgICAgICAgICAgfTtcblxuICAgICAgICBsZXQgZmxpcHBlZE1hcHBpbmcgPSBIZWF0bWFwVXRpbHMuYXJyYXlGbGlwKEVMRU1FTlRfTUFQUElORyk7XG4gICAgICAgIGlmICh0eXBlb2YgZmxpcHBlZE1hcHBpbmdbdGFnQ29kZV0gPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgcmV0dXJuRGF0YS5lbGVtZW50VGFnTmFtZSA9IGZsaXBwZWRNYXBwaW5nW3RhZ0NvZGVdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldHVybkRhdGE7XG5cbiAgICB9XG5cbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb21tb24vZWxlbWVudFBhdGguanNcbiAqKi8iLCJleHBvcnQgY2xhc3MgSGVhdG1hcFV0aWxzIHtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgY2VudGVyIHBvc2l0aW9uIG9mIGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gZWxlbVxuICAgICAqIEByZXR1cm5zIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRFbGVtZW50UG9zaXRpb24oZWxlbSkge1xuXG4gICAgICAgIC8vICgxKVxuICAgICAgICB2YXIgYm94ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICAgICAgICB2YXIgZG9jRWxlbSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuICAgICAgICAvLyAoMilcbiAgICAgICAgdmFyIHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2NFbGVtLnNjcm9sbFRvcCB8fCBib2R5LnNjcm9sbFRvcDtcbiAgICAgICAgdmFyIHNjcm9sbExlZnQgPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jRWxlbS5zY3JvbGxMZWZ0IHx8IGJvZHkuc2Nyb2xsTGVmdDtcblxuICAgICAgICAvLyAoMylcbiAgICAgICAgdmFyIGNsaWVudFRvcCA9IGRvY0VsZW0uY2xpZW50VG9wIHx8IGJvZHkuY2xpZW50VG9wIHx8IDA7XG4gICAgICAgIHZhciBjbGllbnRMZWZ0ID0gZG9jRWxlbS5jbGllbnRMZWZ0IHx8IGJvZHkuY2xpZW50TGVmdCB8fCAwO1xuXG4gICAgICAgIC8vICg0KVxuICAgICAgICB2YXIgdG9wID0gKGJveC50b3AgKyBzY3JvbGxUb3AgLSBjbGllbnRUb3ApICsgKGJveC5oZWlnaHQgLyAyKTtcbiAgICAgICAgdmFyIGxlZnQgPSAoKGJveC5sZWZ0ICsgc2Nyb2xsTGVmdCAtIGNsaWVudExlZnQpICsgKGJveC53aWR0aCAvIDIpKTtcblxuICAgICAgICByZXR1cm4ge3g6IE1hdGgucm91bmQobGVmdCksIHk6IE1hdGgucm91bmQodG9wKX07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmxpcCBhcnJheSwga2V5IHdpbGwgYmUgdmFsdWUgYW5kIHZhbHVlIHdpbGwgYmUga2V5IG9mIGFycmF5XG4gICAgICogQHBhcmFtIHRyYW5zXG4gICAgICogQHJldHVybnMge3t9fVxuICAgICAqL1xuICAgIHN0YXRpYyBhcnJheUZsaXAodHJhbnMpIHtcbiAgICAgICAgdmFyIGtleSwgdG1wX2FyID0ge307XG5cbiAgICAgICAgZm9yIChrZXkgaW4gdHJhbnMpIHtcbiAgICAgICAgICAgIGlmICh0cmFucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdG1wX2FyW3RyYW5zW2tleV1dID0ga2V5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRtcF9hcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBhcHByb3hpbWF0ZSBtZW1vcnkgdXNhZ2UsIGluIGJ5dGVzLCBvZiB0aGUgc3BlY2lmaWVkIG9iamVjdC4gVGhlXG4gICAgICogcGFyYW1ldGVyIGlzOlxuICAgICAqXG4gICAgICogb2JqZWN0IC0gdGhlIG9iamVjdCB3aG9zZSBzaXplIHNob3VsZCBiZSBkZXRlcm1pbmVkXG4gICAgICovXG4gICAgc3RhdGljIHNpemVvZihvYmplY3QpIHtcbiAgICAgICAgdmFyIG9iamVjdExpc3QgPSBbXTtcbiAgICAgICAgdmFyIHN0YWNrID0gW29iamVjdF07XG4gICAgICAgIHZhciBieXRlcyA9IDA7XG5cbiAgICAgICAgd2hpbGUgKHN0YWNrLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gc3RhY2sucG9wKCk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgICAgIGJ5dGVzICs9IDQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgYnl0ZXMgKz0gdmFsdWUubGVuZ3RoICogMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBieXRlcyArPSA4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZlxuICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcbiAgICAgICAgICAgICAgICAmJiBvYmplY3RMaXN0LmluZGV4T2YodmFsdWUpID09PSAtMVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0TGlzdC5wdXNoKHZhbHVlKTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaCh2YWx1ZVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBieXRlcztcbiAgICB9XG5cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbW1vbi91dGlscy5qc1xuICoqLyIsImV4cG9ydCBjb25zdCBjb25maWdXUyA9IHtcclxuICAgIHBvcnQ6ICc4MCcsXHJcbiAgICBhZGRyZXNzOiAnd3M6Ly8xNzguNjIuMjM2Ljk0JyxcclxuICAgIGNvbGxlY3RQYXRoOiAnL2NvbGxlY3QnXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgY29uZmlnSGVhdG1hcCA9IHtcclxuICAgIGVuYWJsZTogdHJ1ZSwgLy8gZW5hYmxlIHRyYWNraW5nXHJcbiAgICBwb3B1bGF0aW9uOiAxMDAgLy8gcGVyY2VudFxyXG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NsaWVudC9jb25maWcuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9