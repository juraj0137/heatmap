import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

//import {deleteIndex,initIndex, initMapping} from './../elastic/heatmaps.js';
//deleteIndex().then(()=>{
//    initIndex().then(()=>{
//        initMapping();
//    });
//});

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/heatmaps', require('./heatmaps.js'));

module.exports = app;
