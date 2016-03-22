class IdleDetect {

    constructor(options) {

        const defaultSetting = {
            idle: false,
            time: 2000,
            onIdleStart: function () {},
            onIdleStop: function () {}
        };

        this.timer = null;
        this.settings = Object.assign({}, defaultSetting, options);

        this.init = this.init.bind(this);
        this.startIdleTimeridleStart = this.startIdleTimeridleStart.bind(this);
        this.idleStart = this.idleStart.bind(this);
        this.onIdleStart = this.onIdleStart.bind(this);
        this.onIdleStop = this.onIdleStop.bind(this);

        this.init();
    }

    init() {

        this.startIdleTimeridleStart();

        document.addEventListener('focus', this.startIdleTimeridleStart);
        document.addEventListener('mousemove', this.startIdleTimeridleStart);
        document.addEventListener('keyup', this.startIdleTimeridleStart);
        window.addEventListener('resize', this.startIdleTimeridleStart);
        window.addEventListener('blur', this.idleStart); //force idle when in a different tab/window
    }

    startIdleTimeridleStart() {

        clearTimeout(this.timer); //clear prior timer

        if (this.settings.idle) {
            this.settings.onIdleStop.call(this, this);
        }

        this.settings.idle = false; //not idle

        this.timer = setTimeout(this.idleStart, this.settings.time); //new timer
    }

    idleStart() {

        if (!this.settings.idle) {
            this.settings.onIdleStart.call(this, this);
        }
        this.settings.idle = true;
    }

    onIdleStart(fn) {
        this.settings.onIdleStart = fn;
        return this;
    }

    onIdleStop(fn) {
        this.settings.onIdleStop = fn;
        return this;
    }

    setTime(time) {
        this.settings.time = time;
        return this;
    }

}

export {IdleDetect};