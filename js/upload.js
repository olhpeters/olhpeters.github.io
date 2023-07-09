$(document).ready(function () {

  var table

  function buildTable(tabledata) {
    table = new Tabulator("#example-table", {
      data: tabledata, //assign data to table
      layout: "fitData", //fit columns to width of table (optional)
      autoColumns:true,
      printAsHtml:true, 
      pagination:"local",
      paginationSize:6,
      paginationSizeSelector:[3, 6, 8, 10, 50],
      movableColumns:true,
      paginationCounter:"rows",
    });
  }

  var tabledata = [
    { id: 1, name: "Oli Bob", age: "12", col: "red", dob: "" },
    { id: 2, name: "Mary May", age: "1", col: "blue", dob: "14/05/1982" },
    { id: 3, name: "Christine Lobowski", age: "42", col: "green", dob: "22/05/1982" },
    { id: 4, name: "Brendon Philips", age: "125", col: "orange", dob: "01/08/1980" },
    { id: 5, name: "Margret Marmajuke", age: "16", col: "yellow", dob: "31/01/1999" },
  ]

  buildTable(tabledata)

  $('#fileUploadForm').submit(function (e) {
    e.preventDefault();
    var formData = new FormData();
    var fileInput = $('#file')[0].files[0];
    formData.append('file', fileInput);
    $.ajax({
      url: "http://127.0.0.1:8000/upload",
      type: 'POST',
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function (response) {
        // $('#message').html(response.message).addClass(response.class);
        tableData = JSON.parse(response.table)
        console.log(tableData)
        buildTable(tableData)
      }
    })
  })

  $('#print-table').click(function (e) {
    table.print(false, true)
  })

  $('#download-csv').click(function (e) {
    table.download("csv", "data.csv");
  })

  $('#download-xlsx').click(function (e) {
    table.download("xlsx", "data.xlsx", {sheetName:"My Data"});
  })

  $('#download-pdf').click(function (e) {
    table.download("pdf", "data.pdf", {
      orientation:"portrait", //set page orientation to portrait
      title:"Talked to table", //add title to report
    });
  })

  $('#talk-button').click(function (e) {
    e.preventDefault();
    var talkInput=$("#talkInput").val()
    console.log(talkInput)
    $.ajax({
      url: "http://127.0.0.1:8000/chat",
      type: 'POST',
      data: JSON.stringify({
        talk_input: talkInput,
      }),
      contentType: 'application/json',
      dataType: "json",
      success: function (response) {
        $('#talk-response').html(response.message)
        /*tableData = JSON.parse(response.table)
        console.log(tableData)*/
        console.log(response)
        //buildTable(tableData)
      }
    })
  })
})