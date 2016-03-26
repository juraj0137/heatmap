import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/heatmaps', require('./heatmaps.js'));
app.use('/visit', require('./visitData.js'));
app.use('/scrapper', require('./webScrapper.js'));

module.exports = app;
