function write_Table(sql,projectId,datasetId,tableId,writeDisposition) {
  
  //  writeDisposition in (WRITE_TRUNCATE, WRITE_APPEND,WRITE_EMPTY)
  // default : WRITE_EMPTY
  
   if(typeof writeDisposition == "undefined"){
    writeDisposition = 'WRITE_EMPTY'
  }
    
  var job = {
    configuration: {
      query: {
        query: sql,
        writeDisposition:writeDisposition,
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
