"use strict";
function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      addDataToView(xhttp);
    }
  };
  xhttp.open("GET", "../server/medication.php" + document.location.search, true);
  xhttp.send();
}

function addDataToView(res) {
  try {
    var jsonResponse = JSON.parse(res.responseText);

    if(jsonResponse.patient == null || jsonResponse.patient == "") {
      window.alert("Patient does not exist!");
    }
    
    var tableRows = ""
    for(var medication of jsonResponse.patient.medications) {
      tableRows += "\t<tr>\n";
      tableRows += "\t\t<td>" + medication.time + "\t\t</td>\n";
      tableRows += "\t\t<td>" + medication.quantity + "\t\t</td>\n";
      tableRows += "\t\t<td>" + medication.medicament_name + "\t\t</td>\n";
      tableRows += "\t\t<td>" + medication.nurse_staffID + "\t\t</td>\n";
      tableRows += "\t\t<td>" + medication.nurse_name + "\t\t</td>\n";
      tableRows += "\t\t<td>" + medication.nurse_first_name + "\t\t</td>\n";
      tableRows += "\t\t<td>" + medication.physician_staffID + "\t\t</td>\n";
      tableRows += "\t\t<td>" + medication.physician_name + "\t\t</td>\n";
      tableRows += "\t\t<td>" + medication.physician_first_name + "\t\t</td>\n";
      tableRows += "\t\t<td>" + medication.note + "\t\t</td>\n";
      tableRows += "\t</tr>\n";
    }
    
    // var signTypesOptions = null;
//  
    // for(var type of jsonResponse.vital_sign_types) {
      // signTypesOptions += "<option value='" + type.signID + 
        // "'>" + type.sign_name + "</option>\n";
    // }
    document.getElementById("nav-patient").getAttribute('href').valueOf = window.location;
    document.getElementById("nav-patient").innerHTML += jsonResponse.patient.patient_name;
    document.getElementById("page-title").innerHTML += jsonResponse.patient.patient_name;  
    document.getElementById("medications").innerHTML += tableRows;
    // document.getElementById("sign-type-select").innerHTML = signTypesOptions;
  } catch (ex) {
    document.body.innerHTML = "<h1>JS:</h1><p>" + ex +
      "</p><h1>PHP:</h1><p>" + res.responseText+ "</p>";
  }
}