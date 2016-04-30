/**
 * Trieda na detekovanie necinnosti navstevnika na stranke
 *
 * @class
 */
class IdleDetect {

    /**
     * @constructor
     * @param options
     */
    constructor(options) {

        const defaultSetting = {
            idle: false,
            time: 2000,
            onIdleStart: function () {},
            onIdleStop: function () {}
        };

        this.timer = null;
        this.settings = Object.assign({}, defaultSetting, options);

        this._init = this._init.bind(this);
        this._startIdleTimeridleStart = this._startIdleTimeridleStart.bind(this);
        this._idleStart = this._idleStart.bind(this);
        this._onIdleStart = this._onIdleStart.bind(this);
        this._onIdleStop = this._onIdleStop.bind(this);

        this._init();
    }

    /**
     * Funkcia inicializuje IdleDecet
     *
     * @private
     */
    _init() {
        this._startIdleTimeridleStart();
        document.addEventListener('focus', this._startIdleTimeridleStart);
        document.addEventListener('mousemove', this._startIdleTimeridleStart);
        document.addEventListener('keyup', this._startIdleTimeridleStart);
        window.addEventListener('resize', this._startIdleTimeridleStart);
        window.addEventListener('blur', this._idleStart); //force idle when in a different tab/window
    }

    /**
     * @private
     */
    _startIdleTimeridleStart() {
        clearTimeout(this.timer);

        if (this.settings.idle) {
            this.settings.onIdleStop.call(this, this);
        }

        this.settings.idle = false;

        this.timer = setTimeout(this._idleStart, this.settings.time);
    }

    /**
     * @private
     */
    _idleStart() {
        if (!this.settings.idle) {
            this.settings.onIdleStart.call(this, this);
        }
        this.settings.idle = true;
    }

    /**
     * @param fn
     * @return {IdleDetect}
     * @private
     */
    _onIdleStart(fn) {
        this.settings.onIdleStart = fn;
        return this;
    }

    /**
     * @param fn
     * @return {IdleDetect}
     * @private
     */
    _onIdleStop(fn) {
        this.settings.onIdleStop = fn;
        return this;
    }

}

export {IdleDetect};