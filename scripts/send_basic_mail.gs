function send_mail() {
  
  // Sheet with email addresses
  var def_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('NAME');
  
  // number of email addresses
    var numMails = def_sheet.getRange('RC1').getValue()
  
  // get the list of emails
  var Mail = def_sheet.getRange(ROW,COL,numMails).getValues()
  var mail_addresses = Mail[0][0]
  
    if (numMails>1){
      for (var i = 1; i<numMails; ++i){
        mail_addresses+=','+Mail[i][0]
      }
    }
 
  // Trigger (if zero, no emails)
  var trigger = def_sheet.getRange('RC1').getValue()
  
  if (trigger>0) {
  
  // Text email
  var bodyHTML = 'YOUR TEXT'
    

// Sharable link to this file
  var link = "https://docs.google.com/...."
  
  var bodyHTML0 = "<p> Detailed information you can find  <a href='" + link +"'>here.</a>"
  
  var subject = "Automatic email"
  
  
    MailApp.sendEmail({to:mail_addresses, subject:subject, htmlBody:bodyHTML+bodyHTML0});   
  }

}
