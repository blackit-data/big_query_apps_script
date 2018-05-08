function update_many_sql() {
  
    var Qsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Queries');

    var PRsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Params');  
  
  // Create the table of all the queries and bring them together
    var num_rows = PRsheet.getRange('b32').getValue()
    var num_cols = PRsheet.getRange('b31').getValue()
    
    var queryRange = Qsheet.getRange(2, 1, num_rows, num_cols).getValues()
    
    // bring together all the queries
    // combine them column-wise (first column is subquery 1, second column is subquery 2 etc)
          
  var sql = 'select * from '
    
  for ( var i = 0; i <= num_cols-1; ++i ){
      for ( var j = 0; j <= num_rows-1; ++j ){
  
        var sql = sql + '\n' +queryRange[j][i] +'\n'
 
      }
  }
  
  var max_tu = PRsheet.getRange('b4').getValue()
  
  // finish the query if needed
  var sql = sql + ' order by 1'
  
  runQ(sql,'project_id','output_sheet')
  
}
