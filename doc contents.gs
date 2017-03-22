//adds first element of table cells in template doc to array to store as headers
//this can be copied to spreadsheet row 1

function tableHeaders(ssId) {
  
  var templatefileId = fieldValue(ssId).templateId; //as entered on setup field
  
  var doc = DocumentApp.openById(templatefileId);
  var tables = doc.getBody().getTables();
  var r;
  var c;
  var child;
  var cellRef;
  var range;
  var cellHeader;
  var columnHeaders = [];
  columnHeaders[0]=[];
  columnHeaders[1]=[];
  columnHeaders[2]=[];
  columnHeaders[3]=[];
  
  
 for (var i = 0; i < tables.length; i++) {
   
      var RowNumber = tables[i].asTable().getNumRows();
      
      for (r=0; r<RowNumber; r++) {
         var Row = tables[i].asTable().getChild(r)
         var CellsInRow = Row.asTableRow().getNumCells();
      
        for (c=0; c<CellsInRow; c++) {
             var cell = Row.asTableRow().getChild(c)
             cellRef = i*100 + r*10 + c;
             cellHeader = cell.getChild(0).asText().getText(); //this is only different line to function below (getchild) , maybe create object with headers as properties
             columnHeaders[0].push(cellHeader);
             columnHeaders[1].push(i);                         //table number
             columnHeaders[2].push(r);                         //row number
             columnHeaders[3].push(c);                         //column number
             
          } }
   }
  
  return columnHeaders;
 }

//updates doc table cell to template headers
//returns array with objects keyed as header: first element of table cell and content: table cell content

function tableContents(fileId,headers) {
  
  var doc = DocumentApp.openById(fileId);
  var tables = doc.getBody().getTables();
  var r;
  var c;
  var cellNumber = 0;
  var cellHeader;
  var cellContent;
  var tableContent = [];
  tableContent[0] = [];
  var formatHeader = DocumentApp.ParagraphHeading.HEADING2;
  
  
 for (var i = 0; i < tables.length; i++) {
   
      var RowNumber = tables[i].asTable().getNumRows();
      
      for (r=0; r<RowNumber; r++) {
         var Row = tables[i].asTable().getChild(r)
         var CellsInRow = Row.asTableRow().getNumCells();
      
        for (c=0; c<CellsInRow; c++) {
             var cell = Row.asTableRow().getChild(c)
             cell.getChild(0).asText().setText(headers[cellNumber]); //updates table cell header from header array from template
             cellHeader = cell.getChild(0).asText().getText()
             cell.getChild(0).asParagraph().setHeading(formatHeader);
             cellContent = cell.asText().getText();
             cellContent = cellContent.replace(cellHeader,""); //removes cell header from cell content
          tableContent[0].push(cellContent); //adds to array an object with header and content names
          cellNumber++;
          } }
   }
  
  
  return tableContent;
 }


  
