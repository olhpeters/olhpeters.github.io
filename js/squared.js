  $(document).ready(function(){

    console.log("Loaded Page")

    $("#squareButton").click(function(){
      console.log("www")
      myFunction()
    });

  });

  function myFunction() {
    var inputNumber=$("#floatingInput").val()
    console.log(inputNumber)
    var square=inputNumber*inputNumber
    $("#squaredResult").html(square)
  }
