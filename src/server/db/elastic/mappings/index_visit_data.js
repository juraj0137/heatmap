import elastic from 'elasticsearch';

var elasticClient = elastic.Client({
    host: '127.0.0.1:9200',
    log: 'trace'
});

var indexName = 'visit_data';

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
        type: "visit",
        body: {
            properties: {
                heatmap_data: {
                    type: "string",
                    index: "no"
                },
                url: {
                    type: "string",
                    index: "not_analyzed"
                },
                visit_time: {type: "date"}
            },
            _all: {
                enabled: false
            }
        }
    });
}
exports.initMapping = initMapping;

// initIndex();
// initMapping;
