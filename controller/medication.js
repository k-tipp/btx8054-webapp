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
    var patientsList = ""
    for(var patient of jsonResponse.patients) {
      if(patient.patientID == jsonResponse.patient.patientID) {
        patientsList += "<li class='active'><a href='patient.html?id=" + patient.patientID +"'>";
        patientsList += patient.patientName + "</a></li>";    
      } else {
        patientsList += "<li><a href='patient.html?id=" + patient.patientID +"'>";
        patientsList += patient.patientName + "</a></li>";        
      }
    }
    var doctors = "";    
    for(var doctor of jsonResponse.doctors) {
    	doctors += "<option value='" + doctor.doctorID + 
        "'>" + doctor.doctorName + "</option>\n";
    }
    var nurses = "";    
    for(var nurse of jsonResponse.nurses) {
    	nurses += "<option value='" + nurse.nurseID + 
        "'>" + nurse.nurseName + "</option>\n";
    }
    var medicaments = "";    
    for(var medicament of jsonResponse.medicaments) {
    	medicaments += "<option value='" + medicament.medicamentID + 
        "'>" + medicament.medicamentName + "</option>\n";
    }

    var tableRows = "";
    if(jsonResponse.patient.medications == null || jsonResponse.patient.medications == ""){
    	
    }else
    for(var medication of jsonResponse.patient.medications) {
      tableRows += "\t<tr>\n";
      tableRows += "\t\t<td>" + medication.time + "\t\t</td>\n";
      tableRows += "\t\t<td>" + medication.quantity + "\t\t</td>\n";
      tableRows += "\t\t<td>" + medication.medicament_name + "\t\t</td>\n";
      tableRows += "\t\t<td>" + medication.nurse_name +", " + medication.nurse_first_name + "\t\t</td>\n";
      tableRows += "\t\t<td>" + medication.physician_name +", "+ medication.physician_first_name + "\t\t</td>\n";
      tableRows += "\t\t<td>" + medication.note + "\t\t</td>\n";
      tableRows += "\t</tr>\n";
    }
    
    // var signTypesOptions = null;
//  
    // for(var type of jsonResponse.vital_sign_types) {
      // signTypesOptions += "<option value='" + type.signID + 
        // "'>" + type.sign_name + "</option>\n";
    // }
    document.getElementById("patients").innerHTML = patientsList;
    document.getElementById("nav-patient").setAttribute('href', window.location);
    document.getElementById("nav-patient").innerHTML += jsonResponse.patient.patient_name;
    document.getElementById("page-title").innerHTML += jsonResponse.patient.patient_name;  
    document.getElementById("medications").innerHTML += tableRows;
    document.getElementById("nurse-select").innerHTML = nurses;
    document.getElementById("doctor-select").innerHTML = doctors;
    document.getElementById("medicament-select").innerHTML = medicaments;
    document.getElementById("patientID").setAttribute('value', jsonResponse.patient.patientID);
  } catch (ex) {
    document.body.innerHTML = "<h1>JS:</h1><p>" + ex +
      "</p><h1>PHP:</h1><p>" + res.responseText+ "</p>";
  }
}