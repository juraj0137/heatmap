require('babel-register');

var visitData = require('./index_visit_data');
var heatmaps = require('./index_heatmaps');

visitData.deleteIndex().then(
    function () {
        visitData.initIndex().then(
            function () {
                visitData.initMapping();
            }
        );
    }
);

heatmaps.deleteIndex().then(
   function () {
       heatmaps.initIndex().then(
           function () {
               heatmaps.initMapping();
           }
       );
    }
);
