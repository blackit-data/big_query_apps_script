function send_pdf() {
  
  
  // Checkout the blog: wwww.blackitdata.wordpress.com
  // Post about this code: https://lnkd.in/grnbrgx
  
  var email = 'blackit.data@gmail.com'  // Email address to send to; multiple addresses have to be separated by a comma
  
  var subject  = 'Test PDF Sending'     // Subject of the email 
  
  var link = 'https://docs.google.com/spreadsheets/d/some_sheet_id/edit#gid=0' 
                                        // Link to a sheet if you want to refer a hyperlink in the body of the email 
                                        // (make sure the recepient has access to it, otherwise you can post here the sharing link)
  
  var HTMLbody = "TEXT OF MESSAGE. Detailed information you can find  <a href='" + link +"'>here.</a>"
                                        // Text of your message and a hyperlink to a sheet of your choice
  
  var PDFsheet_ID = 'some_sheet_id' // ID of the sheet with data to send as PDF
                                        // --> PDFsheet_ID = 0: Current Spreadsheet (*** default)
                                        //     PDFsheet_ID = 'some_other_sheet_id'

  var tab_name = 'PDF'                  // Name of the tab with data 
                                        // --> tab_name = 0: taking the first tab in the workbook (*** default)
                                        // --> tab_name = 'your_tab_name'
  

  
  var pdf_file_name = 'Test PDF sending' // Name of the PDF file that will be attached to the email
                                         // --> pdf_file_name = 0/false: 'PDF from Gsheet' (*** default)  
                                         // --> pdf_file_name = 'your_file_name'
  
  // DEFINITIONS OF THE PDF FILE (optional)
  // To get the default value, just set the variable to 0
  
  var size = 0                   // Paper size: letter or legal (*** default: letter)
  
  var orientation = 'landscape'  // Orientation: landscape or portrait (*** default: portrait)
  
  var fit_to_width = true        // Fit the result to page width: true or false (*** default: true)
  
  var print_workbook_name = true // Print the name of the workbook: true or false (*** default: false)
  
  var print_tab_name = false     // Print the name of the tab: true or false (*** default: false)
  
  var print_page_nr = false      // Print page number: true or false (*** default: true)
  
  var print_grid = false         // Print the excel grid: true or false (*** default: false)
  
  var frozen_rows = true         // Freeze rows as in the tab: true or false (*** default: true)
  
   createPDF(email,subject,HTMLbody,PDFsheet_ID, tab_name,pdf_file_name,size,
                   orientation ,fit_to_width,print_workbook_name,
                   print_tab_name,print_page_nr,print_grid ,frozen_rows)
}


function createPDF(email,subject,HTMLbody,PDFsheet_ID, tab_name,pdf_file_name,size,
                   orientation ,fit_to_width,print_workbook_name,
                   print_tab_name,print_page_nr,print_grid ,frozen_rows) {
  SpreadsheetApp.flush();
  
// PDF FILE DEFAULTS

  if(typeof PDFsheet_ID == "undefined"|| PDFsheet_ID == 0){
    var PDFsheet_ID = SpreadsheetApp.getActiveSpreadsheet().getId()
    }

  var ss = SpreadsheetApp.openById(PDFsheet_ID);
  
   if(typeof tab_name == "undefined"|| tab_name == 0){
      var sheet = ss.getSheets()[0];
   } else {
      var sheet = ss.getSheetByName(tab_name); 
   } 
  
// DEFINE DEFAULTS 
  
  if(typeof size == "undefined" || size == 0){
    var size = 'letter'}
  
  var _size = '&size='+size

 
  if(typeof orientation == "undefined"|| orientation == 0){
    var orientation = 'portrait'
    }
  
  if(typeof fit_to_width == "undefined"|| fit_to_width == 0){
    var fit_to_width = true
    }
  

  if(typeof print_workbook_name == "undefined" || print_workbook_name == 0){
    var print_workbook_name = false
    }
  
  if(typeof print_tab_name == "undefined" || print_tab_name == 0){
    var print_tab_name = false
    }
  
  if(typeof print_page_nr == "undefined" || print_page_nr == 0){
    var print_page_nr = true
    }  

  if(typeof print_grid == "undefined" || print_grid == 0){
    var print_grid = false
    }
  
  if(typeof frozen_rows == "undefined" || frozen_rows == 0){
    var frozen_rows = true
    }  
  
// DEFINE OPTIONS  
  if(orientation == 'landscape'){
    var _orientation = '&portrait=false'
    }else{
    var _orientation = '&portrait=true'
    }

  if(fit_to_width == true){
    var _fit_to_width = '&fitw=true'
    }else{
      var _fit_to_width = '&fitw=false'
      }
  
  if(print_workbook_name == true){
    var _print_workbook_name = '&sheetnames=true'
    }else{
      var _print_workbook_name = '&sheetnames=false'
      }  
      
  if(print_tab_name == true){
    var _print_tab_name = '&printtitle=true'
    }else{
      var _print_tab_name = '&printtitle=false'
      }        
  
  if(print_page_nr == true){
    var _print_page_nr = '&pagenumbers=true'
    }else{
      var _print_page_nr = '&pagenumbers=false'
      }        
  
  if(print_grid == true){
    var _print_grid = '&gridlines=true'
    }else{
      var _print_grid = '&gridlines=false'
      }        

  if(print_grid == true){
    var _frozen_rows = '&fzr=true'
    }else{
      var _frozen_rows = '&fzr=false'
      }    


  var url = ss.getUrl();

  //remove the trailing 'edit' from the url
  url = url.replace(/edit$/, '');

  //additional parameters for exporting the sheet as a pdf
  var url_ext = 'export?exportFormat=pdf&format=pdf' + //export as pdf
    //below parameters are optional...
//    '&size=letter' + //paper size (letter,legal)
     _size +
       
//    '&portrait=false' + //orientation, false for landscape
     _orientation +
       
//    '&fitw=true' + //fit to width, false for actual size
     _fit_to_width +
       
//    '&sheetnames=false' + //hide optional headers
     _print_workbook_name +
       
//    '&printtitle=false' + //hide optional headers
     _print_tab_name+
       
//    '&pagenumbers=false' + //hide optional footers
     _print_page_nr  +
       
//    '&gridlines=false' + //hide gridlines
     _print_grid +
       
//    '&fzr=false' + //do not repeat row headers (frozen rows) on each page
     _frozen_rows+
       
    '&gid=' + sheet.getSheetId(); //the sheet's Id

  var token = ScriptApp.getOAuthToken();

  var response = UrlFetchApp.fetch(url + url_ext, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });

  var blob = response.getBlob().setName(pdf_file_name);

// Sending the email
  MailApp.sendEmail({ to:email, subject:subject, htmlBody:HTMLbody, attachments:[blob]});


}
