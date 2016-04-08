"use strict";
function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      addDataToView(xhttp);
    }
  };
  xhttp.open("GET", "../server/home.php", true);
  xhttp.send();
}

function addDataToView(res) {
  try {
    var jsonResponse = JSON.parse(res.responseText);
    var patientsList = ""
    for(var patient of jsonResponse.patients) {
      patientsList += "<li><a href='patient.html?id=" + patient.patientID +"'>";
      patientsList += patient.patientName + "</a></li>";
    }
  
    document.getElementById("page-title").innerHTML += jsonResponse.user;  
    document.getElementById("sidebar").innerHTML = patientsList;
  
  } catch (ex) {
    document.body.innerHTML = "<h1>JS:</h1><p>" + ex + 
      "</p><h1>PHP:</h1><p>" + res.responseText+ "</p>";
    window.alert("JS: " + ex + "\n\n\nPHP: " + res.responseText);
  }
}