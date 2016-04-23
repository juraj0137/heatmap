import elastic from 'elasticsearch';


function feedVisitData(visitData) {

    let connection = elastic.Client({
        host: 'localhost:9200',
        log: false
    });

    connection.index({
        index: 'visit_data',
        type: 'visit',
        body: visitData
    }).then(function (result) {
        if (result.created == false) {
            console.log(result);
        }
    });
}

export {
    feedVisitData
}