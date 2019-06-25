function update (){
  
    var Qsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('query');
  
    var sql =  Qsheet.getRange('a1').getValue()
    
    var projectId = 'your_project' // Google Cloud project
    
    var datasetId = 'dataset_name' // name of your dataset
    
    var tableId = 'table_name' // name of your table (will create new if does not exist)
    
    var writeDisposition = 'WRITE_EMPTY' // How the table should be saved
                              // WRITE_EMPTY: If table with the specified name exists and has content, script does neither append nor overwrite
                              // WRITE_TRUNCATE: Script replaces exisitng table with the results of the specified query
                              // WRITE_APPEND: Script appends the results to an existend table or creates a new table if needed
    
    var add_stats = 1 // --> add_stats=1: adds onother hidden Sheet with stats of runs (**default)
                           //add_stats=0: saves no stats
    
    var legacy_sql = 0 // --> legacy_sql=0: uses legacy SQL (**default)
                           // legacy_sql=0: uses standard SQL
    
    var query_tag = 'example' // --> 1/true/basic - adds only "Note: Query run from Google Sheets" (**default)
                              //     0/false/none - adds nothing; 
                              //     else adds the string as comment in end of the query.

  write_Table(sql,projectId,datasetId,tableId,writeDisposition,legacy_sql,add_stats,query_tag)
  
}




function write_Table(sql,projectId,datasetId,tableId,writeDisposition,legacy_sql,add_stats,query_tag) {
  
  // Check the explanations here: 
  // https://blackitdata.wordpress.com/2017/06/20/save-query-results-to-as-a-table-in-bigquery/
  // Enable BigQuery API and Drive API in Google API Console
  
  // writeDisposition in (WRITE_TRUNCATE, WRITE_APPEND,WRITE_EMPTY)
  // default : WRITE_EMPTY
  
  var d0 = new Date();
 

  // Check if query_tag provided
     if(typeof query_tag == "undefined" || query_tag == 'basic' || query_tag == 'default' || query_tag == 1 || query_tag == true){
       var query_add_on = '\n \n/* Note: Query run from Google Sheets*/'
       var query_tag = ''
       } else if (query_tag == 0 || query_tag == 'none' || query_tag == false){
         var query_add_on = ''
         var query_tag = ''
         }else{
          var query_add_on = '\n \n/* Note: Query run from Google Sheets (' + query_tag + ')*/'
         }
  
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
    

  
  // Define the inserting job
  var job = {
    configuration: {
      query: {
        query: sql+query_add_on,
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
  var queryResults0 = BigQuery.Jobs.query(request, projectId);
  var bytes = queryResults0.totalBytesProcessed;
  bytes=+bytes
  
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
          
       var col_names = [['Date','Job ID','MB Processed','Cost in $','Running time','User','Query Tag']];
        
       hist_sheet.getRange('a1:g1').setValues(col_names)
  
    // Format the history sheet: Fix the top row, format output numbers
          hist_sheet.getRange('J1').setValue('Total Cost');
          hist_sheet.getRange('K1').setValue('=sum(d:d)');
          hist_sheet.setFrozenRows(1);
        
        hist_sheet.getRange('c:c').setNumberFormat("#,##0");
        hist_sheet.getRange('d:d').setNumberFormat("$#,##0.00");
        hist_sheet.getRange('e:e').setNumberFormat("#,##0");        
          }
  
   // Add stats to history sheet
    var hist_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Query Run history');
    
    var last_R = hist_sheet.getLastRow();
  
  var now = new Date();
  
  var processed_MB = bytes/(1024*1024);
  var cost = processed_MB/(200*1024)
  
//  hist_sheet.getRange(last_R+1, 1).setValue(now);
//  hist_sheet.getRange(last_R+1, 2).setValue(processed_MB);
//  hist_sheet.getRange(last_R+1, 3).setValue(cost);  
   
     
   var d1 = new Date()
   var how_long = ((d1.getTime()-d0.getTime())/1000)+1
   
   var user = Session.getActiveUser().getEmail()
   
   var values = [[now,'https://console.cloud.google.com/bigquery?project='+projectId+'&j=:bq:US:'+jobId+'&page=queryresults',processed_MB,cost,how_long,user,query_tag]]

// OLD UI
//   var values = [[now,'https://bigquery.cloud.google.com/results/'+projectId+':'+jobId+'?pli=1',processed_MB,cost,how_long, user,query_tag]]
  
   
   hist_sheet.getRange(last_R+1, 1,1,7).setValues(values); 

  }
  
  
}

function uploadFile() {
  var image = UrlFetchApp.fetch('http://goo.gl/nd7zjB').getBlob();
  var file = {
    title: 'google_logo.png',
    mimeType: 'image/png'
  };
  file = Drive.Files.insert(file, image);
  Logger.log('ID: %s, File size (bytes): %s', file.id, file.fileSize);
}
