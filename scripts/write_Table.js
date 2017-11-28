function write_Table(sql,projectId,datasetId,tableId,writeDisposition,legacy_sql,add_stats) {
  
  // writeDisposition in (WRITE_TRUNCATE, WRITE_APPEND,WRITE_EMPTY)
  // default : WRITE_EMPTY
  
  var d0 = new Date();
 
  // Check Write Disposition
   if(typeof writeDisposition == "undefined"){
    writeDisposition = 'WRITE_EMPTY'
  }
  
  // Check SQL-dialect
   if(typeof legacy_sql == "undefined"){ 
       var legacy_sql = true
         } else if(legacy_sql==0 || legacy_sql == false || legacy_sql == 'standard'){ 
            var legacy_sql = false
            } else {
              var legacy_sql = true
              }
  
  // Check how much bytes the job will pass
  var request = {
    query: sql,
    useLegacySql: legacy_sql,
    dryRun: true
  };
    
  var queryResults0 = BigQuery.Jobs.query(request, projectId);
  var bytes = queryResults0.totalBytesProcessed;
  bytes=+bytes
  
  // Define the inserting job
  var job = {
    configuration: {
      query: {
        query: sql,
        useLegacySql:legacy_sql,
        allowLargeResults:true,
        writeDisposition:writeDisposition,
        destinationTable: {
          projectId: projectId,
          datasetId: datasetId,
          tableId: tableId
        }
      }
    }
  };

// Execute inserting job  
var queryResults = BigQuery.Jobs.insert(job, projectId);

  
// Collect data for the stats/history sheet  
var jobId = queryResults.jobReference.jobId;
  
       if(typeof add_stats == "undefined"){ 
       var add_stats = 'yes'
       } 
  
  if (add_stats == 1 || add_stats =='yes') {
  
  // check if history sheet exists
        try {
    var check_range = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Query Run history').getRange('a1')
          } 
      catch(err) {
  
  // Create and hide it if it does not exist
    SpreadsheetApp.getActiveSpreadsheet().insertSheet('Query Run history')
          var hist_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Query Run history');
          hist_sheet.hideSheet()
          
       var col_names = [['Date','Job ID','MB Processed','Cost in $','Running time']];
        
       hist_sheet.getRange('a1:e1').setValues(col_names)
  
    // Format the history sheet: Fix the top row, format output numbers
          hist_sheet.getRange('g1').setValue('Total Cost');
          hist_sheet.getRange('h1').setValue('=sum(d:d)');
          hist_sheet.setFrozenRows(1);
        
        hist_sheet.getRange('c:c').setNumberFormat("#,###");
        hist_sheet.getRange('d:d').setNumberFormat("$#,##0.00");
        hist_sheet.getRange('e:e').setNumberFormat("#,###");        
          }
  
   // Add stats to history sheet
    var hist_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Query Run history');
    
    var last_R = hist_sheet.getLastRow();
  
  var now = new Date();
  
  var processed_MB = bytes/(1024*1024);
  var cost = processed_MB/(200*1024)
  
  hist_sheet.getRange(last_R+1, 1).setValue(now);
  hist_sheet.getRange(last_R+1, 2).setValue(processed_MB);
  hist_sheet.getRange(last_R+1, 3).setValue(cost);  
   
     
   var d1 = new Date()
   var how_long = ((d1.getTime()-d0.getTime())/1000)+1
   
   var values = [[now,'https://bigquery.cloud.google.com/results/'+projectId+':'+jobId+'?pli=1',processed_MB,cost,how_long]]
   
   hist_sheet.getRange(last_R+1, 1,1,5).setValues(values); 

  }
  
  
}
