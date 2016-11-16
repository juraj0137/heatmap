/**
 * @type {{enable: boolean, population: number, collectUrl: string, collectInterval: number, idleTime: number}}
 */
const configHeatmap = {
    enable: true, // enable tracking
    population: 100, // percent
    collectUrl: "http://128.199.44.148/api/visit",
    collectInterval: 60, //ms
    idleTime: 1000 //ms
};

export {configHeatmap};