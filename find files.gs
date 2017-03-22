//returns array of objects of files found by search term, with fileName and fileId as properties

function findFiles(searchTerm,editors) {

  var folderId = fieldValue().folderId;
  
  var fileNames = [];
  
  var files = DriveApp.searchFiles('title contains "'+searchTerm+'" and "'+folderId+'" in parents');
  
  while (files.hasNext()) {
   var file = files.next();
   var fileId = file.getId();
    fileNames.push({fileName : file.getName(), fileId : fileId});
 }
 
  return fileNames;
  
}


//returns object keyed to headerIDs of database settings
//source is 'database of databases' spreadsheet

function fieldValue(ssId) {
  
   if (!ssId) { ssId = SpreadsheetApp.getActiveSpreadsheet().getId(); } //if called by menu within spreadsheet
  
  var  ss = SpreadsheetApp.openById('1r5q5I7eLy632GDpNxusNXoV2-J1s2B8VsZYHUISc_FE'); // db of db spreadsheet
  
  var range = ss.getSheetByName('Databases').getDataRange();
  var databases = range.getValues();
  var numCols = range.getNumColumns();
  var urlIndex = ss.getRangeByName('ssId').getColumn()-1;
  var i = 3;
  var rowIndex = "";
  var fieldValues = {};
  
  for (i=3; i<databases.length; i++) { if (databases[i][urlIndex].indexOf(ssId)>-1 ) { rowIndex = i; break } }
  
  if (rowIndex) { for (var c=0; c<numCols; c++) { 
    
    var fieldHeaderId = databases[2][c]; //row with field header Ids
    if (fieldHeaderId) { fieldValues[fieldHeaderId] = databases[rowIndex][c]; }
    
       }         
      } 
  
 

  return fieldValues;
  
}

