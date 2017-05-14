function runQ(sql,projectId,output_sheet,add_stats) {
 
  var d0 = new Date();
  /*
  // ++++++++++
  // Test Values
  var sql = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('query').getRange('b2').getValue();
  var projectId = 'somoto-installer'
  var output_sheet = 'data'
  var add_stats = 'yes' || add_stats = 1  -> will add onother hidden Sheet with stats of runs
  // ++++++++++
  */
  
  var request = {
    query: sql
  };

var queryResults = BigQuery.Jobs.query(request, projectId);
var jobId = queryResults.jobReference.jobId;

  // Check on status of the Query Job.
  var sleepTimeMs = 500;
  while (!queryResults.jobComplete) {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId);
  }

  // Get all the rows of results.
  var rows = queryResults.rows;
  while (queryResults.pageToken) {
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId, {
      pageToken: queryResults.pageToken
    });
    rows = rows.concat(queryResults.rows);
  }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(output_sheet);
    sheet.clear(); 
 if (rows) {
    // Append the headers.
    var headers = queryResults.schema.fields.map(function(field) {
      return field.name;
    });
    sheet.appendRow(headers);

    // Append the results.
    var data = new Array(rows.length);
    for (var i = 0; i < rows.length; i++) {
      var cols = rows[i].f;
      data[i] = new Array(cols.length);
      for (var j = 0; j < cols.length; j++) {
        data[i][j] = cols[j].v;
      }
    }
    sheet.getRange(2, 1, rows.length, headers.length).setValues(data);

    Logger.log('Results spreadsheet created: %s',
        SpreadsheetApp.getActiveSpreadsheet().getUrl());
  } else {
    
    Browser.msgBox('No data found for your request. Maybe you specified to many parameters.');
  }
  
     if(typeof add_stats == "undefined"){ 
       var add_stats = 'yes'
       } 
  
  if (add_stats == 1 || add_stats =='yes') {
  
  // Add cost overview
  var d2 = new Date();
    var bytes = queryResults.totalBytesProcessed;
  bytes=+bytes
      try {
    var check_range = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Query Run history').getRange('a1')
          } 
      catch(err) {
    SpreadsheetApp.getActiveSpreadsheet().insertSheet('Query Run history')
          var hist_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Query Run history');
          hist_sheet.hideSheet()
          
       var col_names = [['Date','Job ID','MB Processed','Cost in $','Running time']];
        
       hist_sheet.getRange('a1:e1').setValues(col_names)
          
          hist_sheet.getRange('g1').setValue('Total Cost');
          hist_sheet.getRange('h1').setValue('=sum(d:d)');
          }
  
    var hist_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Query Run history');
    
    var last_R = hist_sheet.getLastRow();
  
  var now = new Date();
  
  var processed_MB = bytes/(1024*1024);
  var cost = processed_MB/(200*1024)
  
  hist_sheet.getRange(last_R+1, 1).setValue(now);
  hist_sheet.getRange(last_R+1, 2).setValue(processed_MB);
  hist_sheet.getRange(last_R+1, 3).setValue(cost);  
   
     
   var d1 = new Date()
   var how_long = ((d1.getTime()-d0.getTime())/1000)+0.5
   
   var values = [[now,'https://bigquery.cloud.google.com/results/'+projectId+':'+jobId+'?pli=1',processed_MB,cost,how_long]]
   
   hist_sheet.getRange(last_R+1, 1,1,5).setValues(values); 

  }
}
