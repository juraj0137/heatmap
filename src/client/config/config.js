/**
 * @type {{enable: boolean, population: number, collectUrl: string, collectInterval: number, idleTime: number}}
 */
const configHeatmap = {
    enable: true, // enable tracking
    population: 100, // percent
    collectUrl: "http://188.166.29.100/api/visit",
    collectInterval: 60, //ms
    idleTime: 1000 //ms
};

export {configHeatmap};