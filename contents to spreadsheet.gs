//runs on timer to update spreadsheet headers and docs headers from template and update docs content to spreadsheet
//or runs from submit trigger on doc form

function tableToSpreadsheet(fileId, ssId) {
  var docContent; //object with properties as first element of each table cell

  if (!ssId) { ssId = fieldValue().ssId; }//retrieves from database of database spreadsheet
  
  var ssFile = DriveApp.getFileById(ssId);
  var ss  = SpreadsheetApp.openByUrl(ssFile.getUrl()); //url of spreadsheet that stores data
  
  //updates spreadsheet headers from first elements of table cells in template doc
  var sheetName = fieldValue(ssId).sheetName; //retrieves from database of database spreadsheet
  var sheet = ss.getSheetByName(sheetName);
  
  var headers = tableHeaders(ssId); //2d array of table cell headers in sequence as appear on template with subsequent rows listing table, row and column number of cell
  var colNumber = headers[0].length;
  var rowNumber = headers.length;
  var firstHeaderColumn = fieldValue(ssId).firstColumn; //set column index of where first header from template begins
  var firstHeaderRow = fieldValue(ssId).firstHeaderRow;
  var firstRow = fieldValue(ssId).firstRow; //set row where data first applied
  sheet.getRange(firstHeaderRow,firstHeaderColumn,rowNumber,colNumber).setValues(headers); //updates column headers from template
  
  //copies doc content to spreadsheet row, matched to headers
  
  var UnitData = sheet.getDataRange().getValues(); //returns object[][] of all data
  
  //if function run with argument (ie from add on submit in doc ) then update just one row, otherwise run through all files in folder
  if (fileId) {    
    var file = DriveApp.getFileById(fileId);
    findRow(file,headers,sheet,firstHeaderColumn,UnitData,fileId);
  }
  
  else {
    
  var folderId = fieldValue(ssId).folderId;  //retrieves from database of database spreadsheet
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFiles();
 //loops through all files in folder
    while (files.hasNext()) {
        var file = files.next();
        var fileId = file.getId();
            findRow(file,headers,sheet,firstHeaderColumn,UnitData,fileId);
                       }        
       }
  


}

function findRow(file,headers,sheet,firstHeaderColumn,UnitData,fileId) {
  
   //searches all data to see if id matches that contained in url and return row index, else return -1
      var rowIndex = ArrayLib.indexOf(UnitData, -1, fileId) ;  //row number of matching file
           if (rowIndex === -1) {
             var lastRow = sheet.getDataRange().getLastRow();       
                         applyUnitData(file,lastRow,headers,sheet,firstHeaderColumn); 
                         
                                } //how to find latest new blank row if more than 1 new file? //if none found sets row to first blank row
  
           else { applyUnitData(file,rowIndex,headers,sheet,firstHeaderColumn);} //updates existing file data
 
}



//set row data in spreadsheet from given file and row

function applyUnitData(file,row,headers,sheet,firstHeaderColumn) {
  
 var fileId = file.getId();
 var tableContent = tableContents(fileId,headers[0]); // returns object [][] of table contents
 var fileUrl = file.getUrl();
 var fileName = file.getName();
 var fileModDate = file.getLastUpdated();
  
  sheet.getRange(row+1, firstHeaderColumn,1,tableContent[0].length).setValues(tableContent); //sets unit data or row
  sheet.getRange(row+1, 2, 1).setValue(fileUrl);           //sets file url NOTE make sure corresponds to correct heading
  sheet.getRange(row+1, 3, 1).setValue(fileName);          //sets file id NOTE make sure corresponds to correct heading
  sheet.getRange(row+1, 4, 1).setValue(fileModDate);          //sets file id NOTE make sure corresponds to correct heading

}



