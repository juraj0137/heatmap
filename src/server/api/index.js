import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/heatmaps', require('./heatmaps.js'));
app.use('/collect', require('./collectData.js'));

module.exports = app;
