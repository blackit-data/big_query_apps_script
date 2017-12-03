function send_email() {
  
  // Sending a basic email.
  
  // Check the explanations here:
  // https://blackitdata.wordpress.com/2017/12/03/sending-basic-emails-from-google-sheets/
  
  // Check the spreadsheet setup here: 
  // https://docs.google.com/spreadsheets/d/1CiSwrS_h0oI2rgybDuh646fmxFUmMldvRecJwNt8oRY/edit?usp=sharing
  
  var Input_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('input');
  
  // number of email addresses
  var numMails = Input_sheet.getRange('b2').getValue(); 
  
  // get the list of emails
  var Mail = Input_sheet.getRange(2,1,numMails).getValues()
  var mail_addresses = Mail[0][0]
  
    if (numMails>1){
      for (var i = 1; i<numMails; ++i){
        mail_addresses+=','+Mail[i][0]
      }
    }
 
  // Text of the email
  var bodyHTML_1 = Input_sheet.getRange('d2').getValue(); 
    
  // Link to a file
  var link = "https://docs.google.com/spreadsheets/d/1CiSwrS_h0oI2rgybDuh646fmxFUmMldvRecJwNt8oRY/edit?usp=sharing"

  // Adding the link to the email as hyperlink
  var bodyHTML_2 = "<p> Detailed information you can find  <a href='" + link +"'>here.</a>"
  
  // Selecting a subject
  var subject = "Automatic test email"

  // Composing the text of the email
  var text = bodyHTML_1 + bodyHTML_2

  // Sending the emails
  MailApp.sendEmail({to:mail_addresses, subject:subject, htmlBody:text});   

}
