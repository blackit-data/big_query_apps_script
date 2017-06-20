function write_Table(sql,projectId,datasetId,tableId,writeDisposition,legacy_sql) {
  
  // writeDisposition in (WRITE_TRUNCATE, WRITE_APPEND,WRITE_EMPTY)
  // default : WRITE_EMPTY
  
   if(typeof writeDisposition == "undefined"){
    writeDisposition = 'WRITE_EMPTY'
  }
  
   if(typeof legacy_sql == "undefined"){ 
       var legacy_sql = true
         } else if(legacy_sql==0 || legacy_sql == false || legacy_sql == 'standard'){ 
            var legacy_sql = false
            } else {
              var legacy_sql = true
              }
    
  var job = {
    configuration: {
      query: {
        query: sql,
        useLegacySql:legacy_sql,
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
