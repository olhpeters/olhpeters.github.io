$(document).ready(function () {

  var table

  var session

  var host = "https://talk-to-table-api-ea5dafcdae70.herokuapp.com"
  //var host = "http://127.0.0.1:8000"

  $('#upload-spinner').hide()
  $('#upload-button-text').text('Upload')

  function buildTable(tabledata) {
    table = new Tabulator("#example-table", {
      data: tabledata, //assign data to table
      layout: "fitData", //fit columns to width of table (optional)
      autoColumns: true,
      printAsHtml: true,
      pagination: "local",
      paginationSize: 6,
      paginationSizeSelector: [3, 6, 8, 10, 50],
      movableColumns: true,
      paginationCounter: "rows",
    });
  }
  //buildTable(tabledata)

  table = new Tabulator("#example-table", {
    placeholder: "Please upload a csv file in the field above.<br/>You can find some sample csvs on <a href='https://www.kaggle.com' target='_blank'>Kaggle</a>.<br/><br/>Sample 1: <a href='../assets/csv/CompanyData.csv'>Company Data</a>&nbsp;&nbsp;&nbsp;&nbsp;Sample 2: <a href='../assets/csv/CelebData.csv'>Celebrity Data</a>", //assign data to table
    layout: "fitColumns",
    height: 300,
    autoColumns: true,
  });

  $('#fileUploadForm').submit(function (e) {
    e.preventDefault();
    var formData = new FormData();
    var fileInput = $('#file')[0].files[0];
    if (!fileInput) {
      $('#ttt-modal').modal('show')
      $('#ttt-modal-label').html('Error')
      $('#ttt-modal-body').html('Please select a CSV using the Choose File button')
      console.log('No File to Upload')
      return
    }
    formData.append('file', fileInput);
    $('#upload-spinner').show()
    $('#upload-button-text').text('Loading...')
    $.ajax({
      url: host + "/upload",
      type: 'POST',
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function (response) {
        // $('#message').html(response.message).addClass(response.class);
        $('#upload-spinner').hide()
        $('#upload-button-text').text('Upload')
        tableData = JSON.parse(response.table)
        session = response.session
        buildTable(tableData)
      },
      error: function (xhr, ajaxOptions, thrownError) {
        $('#upload-spinner').hide()
        $('#upload-button-text').text('Upload')
        $('#ttt-modal').modal('show')
        $('#ttt-modal-label').html('Error')
        $('#ttt-modal-body').html(xhr.responseJSON.detail)
        console.log(xhr)
        /*alert(xhr.status);
        alert(thrownError);*/
      }
    })
  })

  $('#print-table').click(function (e) {
    table.print(false, true)
  })

  $('#download-csv').click(function (e) {
    table.download("csv", "data.csv")
  })

  $('#download-xlsx').click(function (e) {
    table.download("xlsx", "data.xlsx", { sheetName: "My Data" })
  })

  $('#download-pdf').click(function (e) {
    table.download("pdf", "data.pdf", {
      orientation: "portrait", //set page orientation to portrait
      title: "Talked to table", //add title to report
    });
  })

  $('#talk-button').click(function (e) {
    e.preventDefault();
    var talkInput = $("#talkInput").val()
    console.log(talkInput)
    $.ajax({
      url: host + "/chat",
      type: 'POST',
      data: JSON.stringify({
        talk_input: talkInput,
        session: session
      }),
      contentType: 'application/json',
      dataType: "json",
      success: function (response) {
        $('#talk-response').html(response.message)
        tableData = JSON.parse(response.table)
        console.log(tableData)
        buildTable(tableData)
      },
      error: function (xhr, ajaxOptions, thrownError) {
        $('#ttt-modal').modal('show');
        $('#ttt-modal-label').html('Error');
        $('#ttt-modal-body').html(xhr.responseJSON.detail);
        console.log(xhr)
        /*alert(xhr.status);
        alert(thrownError);*/
      }
    })
  })


  $('#revert-button').click(function (e) {
    e.preventDefault();
    $.ajax({
      url: host + "/revert",
      type: 'POST',
      data: JSON.stringify({
        talk_input: '*',
        session: session
      }),
      contentType: 'application/json',
      dataType: "json",
      success: function (response) {
        tableData = JSON.parse(response.table)
        buildTable(tableData)
      },
      error: function (xhr, ajaxOptions, thrownError) {
        $('#ttt-modal').modal('show');
        $('#ttt-modal-label').html('Error');
        $('#ttt-modal-body').html(xhr.responseJSON.detail);
        console.log(xhr)
      }
    })
  })
})