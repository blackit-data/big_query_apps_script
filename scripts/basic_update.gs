function update() {
  
      var Qsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('query');
  
  var sql =  Qsheet.getRange('a1').getValue()

  var projectId = 'somoto-installer'
  var output_sheet = 'data'
  
  runQ(sql,projectId,output_sheet) 


  
}
