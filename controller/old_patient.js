"use strict";
function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      addDataToView(xhttp);
    }
  };
  xhttp.open("GET", "../server/patient.php" + document.location.search, true);
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

    if(jsonResponse.patient == null || jsonResponse.patient == "") {
      window.alert("Patient does not exist!");
    }
  
    var tableRows = ""
    var temperatureData = new Array();
    var pulseData = new Array();
    var bloodData = new Array();
    
    if(jsonResponse.patient.vital_signs == null || jsonResponse.patient.vital_signs == "") {
      window.alert("Vital sings does not exist!");
    } else {
      for(var sign of jsonResponse.patient.vital_signs) {
        tableRows += "\t<tr>\n";
        tableRows += "\t\t<td>" + sign.sign_name + "\t\t</td>\n";
        tableRows += "\t\t<td>" + sign.value + "\t\t</td>\n";
        tableRows += "\t\t<td>" + sign.time + "\t\t</td>\n";
        tableRows += "\t\t<td>" + sign.note + "\t\t</td>\n";
        tableRows += "\t</tr>\n";
        
        switch(sign.sign_name) {
          case "Temperature":
            temperatureData.push(sign.value);
            break;
          case "Pulse":
            pulseData.push(sign.value);
            break;
          case "Blood pressure":
            bloodData.push(sign.value);
            break;
        }
      }
    }

    
    var signTypesOptions = null;
 
    for(var type of jsonResponse.vital_sign_types) {
      signTypesOptions += "<option value='" + type.signID + 
        "'>" + type.sign_name + "</option>\n";
    }
    
    document.getElementById("patients").innerHTML = patientsList;
    document.getElementById("nav-patient").getAttribute('href').valueOf = window.location;
    document.getElementById("nav-patient").innerHTML += jsonResponse.patient.patient_name;
    document.getElementById("page-title").innerHTML += jsonResponse.patient.patient_name;  
    document.getElementById("vital-signs").innerHTML += tableRows;
    document.getElementById("sign-type-select").innerHTML = signTypesOptions;
    
    
  Chart.defaults.global.responsive = true;  
var data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "Temperature",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: temperatureData
        },
        {
            label: "Pulse",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: pulseData
        }
    ]
};
    
    
    
    
    // Chart
    
    // Get the context of the canvas element we want to select
var ctx = document.getElementById("myChart").getContext("2d");
var myNewChart = new Chart(ctx).Line(data);

    
    
    
    
    
    
  } catch (ex) {
    document.body.innerHTML = "<h1>JS:</h1><p>" + ex + 
      "</p><h1>PHP:</h1><p>" + res.responseText+ "</p>";
  }
}