function geocode() {
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
  var n_rows = sheet.getLastRow();
  var inputs = sheet.getRange(1, 1, n_rows).getValues();
  var outputs = sheet.getRange(1, 2, n_rows, 3).getValues();
  
  for (var i = 1; i<n_rows; i++){
  
  var search_for = inputs[i][0];
  var response = Maps.newGeocoder().geocode(search_for);
  var result = response.results[0];
  
  var long = result.geometry.location.lng;
  var lat = result.geometry.location.lat;
  var form_address = result.formatted_address;
  
  outputs[i][0] = long;
  outputs[i][1] = lat;
  outputs[i][2] = form_address;
  
  }
  
  sheet.getRange(1, 2, n_rows, 3).setValues(outputs);
  
}
