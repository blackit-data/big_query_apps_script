function save_attachment_in_drive() {
 
  var Psheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1')
  
  var search_for_string = Psheet.getRange('b3').getValue();
  var id_folder_to_save = Psheet.getRange('b4').getValue();
  
  if (id_folder_to_save == ''){
    var id_folder_to_save = 'empty'
    }
  
  // Check if the folder can be accessed by the user.
  // If user cannot write in the specified folder, a new folder will be created and the link posted in the spreadsheet
  try{
   
    var folder_to_save = DriveApp.getFolderById(id_folder_to_save)
    
     } catch(e){
       
   var folder_to_save=DriveApp.createFolder("Folder to drop Gmail Attachments")
   var id_folder_to_save = folder_to_save.getId()
   Psheet.getRange('b4').setValue(id_folder_to_save);
   }  

  var start_date = Psheet.getRange('b5').getValue();
  var end_date = Psheet.getRange('b6').getValue();
  
    var threads = GmailApp.search(search_for_string) //search gmail with the given query(partial name using * as a wildcard to find anything in the current subject name).
  var msgs = GmailApp.getMessagesForThreads(threads);
  
  var cnt_emails = msgs.length
  
  for (var i = 0; i < cnt_emails; ++i){
  
  var emailDate = msgs[i][0].getDate();
    var subject = msgs[i][0].getSubject();
    
    if(emailDate>= start_date & emailDate<= end_date){
    
      try{
  var attachments = msgs[i][0].getAttachments();
  
        var j = 0
        while (attachments[j]){
  var attachment = attachments[j];
  var attachmentBlob = attachment.copyBlob();
  var file = DriveApp.createFile(attachmentBlob);
  
    file.getParents().next().removeFile(file);
  
    folder_to_save.addFile(file);
          j++;
        }
      }catch(e){}
  }
  }
}
