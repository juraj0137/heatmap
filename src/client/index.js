import {configHeatmap} from './config/config.dev.js';
import Heatmap from './heatmap.js';

new Heatmap(configHeatmap.enable, configHeatmap.population);