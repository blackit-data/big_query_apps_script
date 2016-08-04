function write_Table(sql,projectId,datasetId,tableId) {
  
  var job = {
    configuration: {
      query: {
        query: sql,
        destinationTable: {
          projectId: projectId,
          datasetId: datasetId,
          tableId: tableId
        }
      }
    }
  };

  var queryResults = BigQuery.Jobs.insert(job, projectId);
  Logger.log(queryResults.status);
  
}
