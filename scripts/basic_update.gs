function update() {
  
  var Qsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Query');
    var sql =  Qsheet.getRange('a1').getValue()
    var projectId = 'your_project'
    var output_sheet = 'data'
    var add_stats = 1
    var legacy_sql = 1
    var output_url = 'docs.google.com/spreadsheets/d/Sheet_id/edit'
    var query_tag = 'example'

  runQ(sql,projectId,output_sheet,add_stats,legacy_sql,output_url )   
}
