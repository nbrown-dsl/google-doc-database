function onInstall(e) { onOpen(e) }

function onOpen(e) {
  
  var ui = SpreadsheetApp.getUi();
  
  var menu = ui.createAddonMenu();
  menu.addItem('Update all logs', 'tableToSpreadsheet')
  .addItem('Update selected logs', 'update_specific_logs')
  .addSeparator()
  .addItem('Setup', 'setupForm')
  .addToUi()
  
}

//webapp runs when called from Unit doc file add on 
//runs as script owner (nbrown) to allow access to spreadsheet and folder
//updates source file data in spreadsheet and returns confirmation to user

function doGet(e) {
 var param = JSON.stringify(e.parameter);
     param = JSON.parse(param);
  
 
 var fileId = param.fileId;
 var file = DriveApp.getFileById(fileId);
 var fileName = file.getName(); //this will allow identification from prefix of what type of database form it is and thereby to which ss and folder it should be allocated
 //doc prefix code
  var fileNamePrefixwithCode = fileName.split(" ");
  var fileNamePrefix = fileNamePrefixwithCode[0].substr(1); //removes prefix code
 var databases = databasesData();
 
 var headerIDs = databases[2]; //row with header Ids
  
 
  var unitPrefixColumn = headerIDs.indexOf('prefix');
  
  for (var i=3; i<databases.length; i++) {
    
    if (databases[i][unitPrefixColumn] === fileNamePrefix) { break }
  }
  
 var database = databases[i]; //row with database parameters
  
 var folderId = database[headerIDs.indexOf('folderId')];
 var ssId = database[headerIDs.indexOf('ssId')]; 
 var folder = DriveApp.getFolderById(folderId);
 folder.addFile(file); //adds planner to interdisc planner folder
  
 tableToSpreadsheet(fileId, ssId) //runs function to update spreadsheet with Unit data
  
//return HtmlService
  
  var t = HtmlService.createTemplateFromFile('submission response');
      t.data = database[1];
  return t.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);

}

//returns database parameters as object[][]

function databasesData() {
  
  var ss=SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1r5q5I7eLy632GDpNxusNXoV2-J1s2B8VsZYHUISc_FE/edit#gid=1530646903'); //spreadsheet that holds list and parameters of databases
  var range = ss.getRangeByName('databases');
  var data = range.getValues();
  
  return data;
}


function update_specific_logs() {
  
  //create file picker for updating selected files
  
 var html = HtmlService
      .createTemplateFromFile('update_picker')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  

  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showModalDialog(html, 'Update files'); 
}

function setupForm() {
    var formURL = 'https://docs.google.com/a/dwightlondon.org/forms/d/1MNiCroRVfsaolSXIds-fMOfu3B4tfygx-udZw4WHRVU/viewform';

 var html = HtmlService
      .createTemplateFromFile('setupForm')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  

  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showModalDialog(html, 'Setup'); 
  
  
}


