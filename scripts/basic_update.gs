function update() {
  
  var Qsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Query');
    var sql =  Qsheet.getRange('a1').getValue()
    var projectId = 'bigquery-public-data'
    var output_sheet = 'data'
  
  runQ(sql,projectId,output_sheet,1,1)   
}
