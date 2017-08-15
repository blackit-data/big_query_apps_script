function update_analytics() {
  
  
  var pSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Report Configuration')
  
  var last_col = pSheet.getLastColumn()
  
  if(last_col == 3 && pSheet.getRange('c2').getValue()==""){
    var last_col = 2
    }
  
  var reportRange = pSheet.getRange(2, 2, 16, last_col-1) // take all reports
  
  var output_first_row = 15
  
  // 2 tries
  try {
  analytics_export(reportRange,output_first_row)
  } catch(err) {
    Utilities.sleep(1000)
        analytics_export(reportRange,output_first_row)
  }
  
}



function analytics_export(reportRange,output_first_row) {

// Input is a range (not values) identical to the structure of the add-on inputs

// Example:
//  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Report Configuration')
//  var reportRange = sheet.getRange('b2:c15')
//  analytics_export(reportRange)
// No Spreadsheet URL input taken into account
  
// Merged cells in the output sheet will be unmerged (relevant for sheets created with Add-On)
// If no output_first_row defined, output printed on the top of the sheet
     
    
     if(typeof output_first_row == "undefined"){
    output_first_row = 1
     }
  
  var input = reportRange.getValues()
  var rows = reportRange.getNumRows()
  var columns = reportRange.getNumColumns()
  var date_style ='US' // month/day/year
  
  for (var i = 0; i<columns; ++i){
  
    var output_sheet = input[0][i]
    var tableId = input[2][i]
    
    // If past N days available - take them; otherwise use start and end date -- as in Add-On
    if(input[5][i] ==''){
    
    var startDate = Utilities.formatDate(input[3][i], SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "YYYY-MM-dd") 
    var endDate = Utilities.formatDate(input[4][i], SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "YYYY-MM-dd") 
    } else{
      
      var date = new Date();
      var endDate = Utilities.formatDate(new Date(date.setDate(date.getDate() - 1)), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "YYYY-MM-dd")      
      var startDate = Utilities.formatDate(new Date(date.setDate(date.getDate() - input[5][i]+1)), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "YYYY-MM-dd") 
      }

    
    
    var metric = input[6][i].replace(/(?:\r\n|\r|\n)/g, ',');
   
    // OPTIONS
    var dimensions = input[7][i]=='' ? null : input[7][i].replace(/(?:\r\n|\r|\n)/g, ',');
    var sort = input[8][i]=='' ? null : input[8][i].replace(/(?:\r\n|\r|\n)/g, ',');
    var filters = input[9][i]=='' ? null : input[9][i];   
    var segment =input[10][i]=='' ? null : input[10][i];
    var sampling_level =input[11][i]=='' ? 'HIGHER_PRECISION' : input[11][i];
    var start_index = input[12][i]=='' ? null : input[12][i];
    var max_results = input[13][i]=='' ? 1000 : input[13][i];
    var spreadsheet_url = input[14][i]=='' ? 'none' : input[14][i];

    var options = {
    'dimensions': dimensions,
    'sort': sort,
    'filters': filters,
       'segment':segment,   
    'sampling-level':sampling_level,
       'start-index':start_index,
    'max-results': max_results,
//      'spreadsheet-url': spreadsheet_url
  };
    
     
  var report = Analytics.Data.Ga.get(tableId, startDate, endDate, metric,
      options);

  if (report.rows) {

     
      if(spreadsheet_url=='none') {
        try{
    var check_range = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(output_sheet).getRange('a1')
    } catch(err) {
       SpreadsheetApp.getActiveSpreadsheet().insertSheet(output_sheet)
    }  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(output_sheet)
  }else{
        try{
    var check_range = SpreadsheetApp.openByUrl(spreadsheet_url).getSheetByName(output_sheet).getRange('a1')
    }  catch(err) {
        SpreadsheetApp.openByUrl(spreadsheet_url).insertSheet(output_sheet)
    }
  var sheet = SpreadsheetApp.openByUrl(spreadsheet_url).getSheetByName(output_sheet)
   
  }
    sheet.clearContents()
    sheet.clearFormats()
    
    // Unmerge rows 1,10,14
    sheet.getRange(1, 1,1,26).breakApart()
    sheet.getRange(10, 1,1,26).breakApart()
    sheet.getRange(14, 1,1,26).breakApart()

    
    // Append the headers.
    var headers = report.columnHeaders.map(function(columnHeader) {
      return columnHeader.name;
    });
    sheet.appendRow(headers);

    // Append the results.
    // 1 header
   var header2paste =  sheet.getRange(1, 1, 1, headers.length).getValues()
      sheet.getRange(1, 1, 1, headers.length).clear()
   sheet.getRange(output_first_row, 1, 1, headers.length).setValues(header2paste)

    
   // 2 data
    sheet.getRange(output_first_row+1, 1, report.rows.length, headers.length)
        .setValues(report.rows);
    
   // 3 if date part of the data
    date_for_GA_export(sheet,header2paste,output_first_row,date_style)

   /* Logger.log('Report spreadsheet created: %s',
        spreadsheet.getUrl());*/
  } else {
    Logger.log('No rows returned.');
  }
    
  }
  

function date_for_GA_export(sheet,headers,output_first_row,date_style) {
  
  var lastRow = sheet.getLastRow()

     if(typeof date_style == "undefined"){
         date_style = 'US' // month/day/year
     }
  
  var num_headers = sheet.getLastColumn();
  
       for (var k = 0; k<num_headers; ++k){
         
         var trigger = headers[0][k]
         
         if(trigger=='ga:date') {
         
           var values = sheet.getRange(output_first_row+1, k+1,lastRow-output_first_row).getValues()
           
           
             for (var j = 0; j<values.length; ++j){
             
                 var to_insert = parse_date(values[j][0].toString(),date_style);
             
                 sheet.getRange(16+j, k+1).setValue(to_insert)
                               
             } // for j 
         } // if header
       } // for k

  
}

}

function parse_date(date) {
 

  var year        = date.substring(0,4);
  var month       = date.substring(4,6);
  var day         = date.substring(6,8);

  var date_final        = new Date(year, month-1, day,0);
  
  return year+'-'+month+'-'+day;
  
} //parse_date
