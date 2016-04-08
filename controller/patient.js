"use strict";

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      addDataToView(xhttp);
    }
  };
  xhttp.open("GET", "../server/patient.php" + document.location.search, true);
  xhttp.send();

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
  
    var tableRows = "";
    var chartData = {
      temperature: {
        time: new Array(),
        value: new Array()
      },
      pulse: {
        time: new Array(),
        value: new Array()        
      },
      blood: {
        time: new Array(),
        value: new Array()        
      }
    };
    
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
            chartData.temperature.time.push(sign.time);
            chartData.temperature.value.push(sign.value);
            break;
          case "Pulse":
            chartData.pulse.time.push(sign.time);
            chartData.pulse.value.push(sign.value);
            break;
          case "Blood pressure":
            chartData.blood.time.push(sign.time);
            chartData.blood.value.push(sign.value);
            break;
        }
      }
      
    var temperatureTrace = {
      x: chartData.temperature.time, 
      y: chartData.temperature.value, 
      name: 'Temperature', 
      type: 'scatter',
      marker: {
        color: '#1f77b4',
        line: {
          color: '#1f77b4',
        }
      },
    };
    
    var pulsTrace = {
      x: chartData.pulse.time, 
      y: chartData.pulse.value, 
      name: 'Heart rate', 
      yaxis: 'y2', 
      type: 'scatter',
      marker: {
        color: '#ff7f0e',
        line: {
          color: '#ff7f0e',
        }
      },
    };
    
    var bloodTrace = {
      x: chartData.blood.time, 
      y: chartData.blood.value, 
      name: 'Blood pressure', 
      yaxis: 'y3', 
      type: 'scatter',
      marker: {
        color: '#d62728',
        line: {
          color: '#d62728',
        }
      },
    };
    
    var data = [temperatureTrace, pulsTrace, bloodTrace];

    
    var layout = {
      margin: {
        b: 0,
        t: 0,
      },
      
      xaxis: {domain: [0.07, 0.99]}, 
      yaxis: {
        title: 'Temperature', 
        titlefont: {color: '#1f77b4'}, 
        tickfont: {color: '#1f77b4'},
        position: 0.0
      }, 
      yaxis2: {
        title: 'Heart rate', 
        titlefont: {color: '#ff7f0e'}, 
        tickfont: {color: '#ff7f0e'}, 
        anchor: 'x', 
        overlaying: 'y', 
        side: 'right'
      },      
      yaxis3: {
        title: 'Blood pressure', 
        titlefont: {color: '#d62728'}, 
        tickfont: {color: '#d62728'}, 
        anchor: 'free', 
        overlaying: 'y', 
        side: 'left', 
        position: 0.06
      }, 
    };
    
    Plotly.newPlot('dataGraph', data, layout);
    }

    
    var signTypesOptions = null;
 
    for(var type of jsonResponse.vital_sign_types) {
      signTypesOptions += "<option value='" + type.signID + 
        "'>" + type.sign_name + "</option>\n";
    }
    
    document.getElementById("patients").innerHTML = patientsList;
    document.getElementById("nav-patient").setAttribute('href', window.location);
    document.getElementById("nav-patient").innerHTML += jsonResponse.patient.patient_name;
    document.getElementById("page-title").innerHTML += jsonResponse.patient.patient_name;  
    document.getElementById("vital-signs").innerHTML += tableRows;
    document.getElementById("sign-type-select").innerHTML = signTypesOptions;
    document.getElementById("patientID").setAttribute('value', jsonResponse.patient.patientID);
    
        
  } catch (ex) {
    document.body.innerHTML = "<h1>JS:</h1><p>" + ex + 
      "</p><h1>PHP:</h1><p>" + res.responseText+ "</p>";
  }
}