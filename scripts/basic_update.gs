function update() {
  
  var Qsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Query');
    var sql =  Qsheet.getRange('a1').getValue()
    var projectId = 'your project'
    var output_sheet = 'data'
    var add_stats = 1
    var legacy_sql = 1
    var output_url = 'docs.google.com/spreadsheets/d/Sheet id/edit'

  runQ(sql,projectId,output_sheet,add_stats,legacy_sql)   
}
