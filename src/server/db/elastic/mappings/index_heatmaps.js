import express from 'express';
import elastic from 'elasticsearch';

var elasticClient = elastic.Client({
    host: '127.0.0.1:9200',
    log: 'trace'
});

var indexName = 'heatmap_config';

/**
 * Delete an existing index
 */
function deleteIndex() {
    return elasticClient.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;


/**
 * create the index
 */
function initIndex() {
    return elasticClient.indices.create({
        index: indexName
    });
}
exports.initIndex = initIndex;

/**
 * create/update mapping
 */
function initMapping() {
    return elasticClient.indices.putMapping({
        index: indexName,
        type: "heatmap",
        body: {
            properties: {
                status: {
                    type: "string",
                    index: "not_analyzed"
                },
                matchType: {
                    type: "string",
                    index: "not_analyzed"
                },
                matchStrings: {
                    type: "string",
                    index: "not_analyzed"
                },
                snapshotUrl: {
                    type: "string",
                    index: "not_analyzed"
                },
                title: {
                    type: "string",
                    index: "not_analyzed"
                },
                pageViews: {type: "integer"},
                created: {type: "date"}
            }
        }
    });
}
exports.initMapping = initMapping;

//initIndex();
//deleteIndex();
//initMapping();
