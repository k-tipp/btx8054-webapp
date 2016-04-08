<?php
session_start();

// Test if the user is logged in.
// If no : back to the login page!
if (!isset($_SESSION['staffID'])) {
  header('location: ../index.html');
  exit ;
}

include ('pdo.inc.php');

try {
  $dbh = new PDO("mysql:host=$hostname;dbname=$dbname", $username, $password);
  $response = null;
  $patientID = (int)($_GET['id']);


  // SELECT ALL PATIENTS FOR SIDEBAR
  $sql = "select * from patient";
  $result = $dbh -> query($sql);

  while ($line = $result -> fetch()) {
    // echo "<a href='patient.php?id=".$line['patientID']."'>";
    // echo $line['first_name']." ".$line['name'];
    //
    // echo "</a><br>\n";

    $patient['patientID'] = $line['patientID'];
    $patient['patientName'] = $line['first_name'] . " " . $line['name'];

    $response['patients'][] = $patient;
  }

// SELECT THE SELECTED PATIENT
  if ($patientID > 0) {
    $sql0 = "SELECT name, first_name
  FROM patient
  WHERE patient.patientID = :patientID";

    $statement0 = $dbh -> prepare($sql0);
    $statement0 -> bindParam(':patientID', $patientID, PDO::PARAM_INT);
    $result0 = $statement0 -> execute();

    while ($line = $statement0 -> fetch()) {
      $patient = $line['first_name'] . " " . $line['name'];
      $response['patient']['patient_name'] = $patient;
    }
    $response['patient']['patientID'] = $patientID;


    /*** echo a message saying we have connected ***/
    $sql = "SELECT name, first_name, value, time, sign_name, note
  FROM patient, vital_sign, sign
  WHERE patient.patientID = vital_sign.patientID
    AND vital_sign.signID = sign.signID 
    AND patient.patientID = :patientID";

    $statement = $dbh -> prepare($sql);
    $statement -> bindParam(':patientID', $patientID, PDO::PARAM_INT);
    $result = $statement -> execute();

    while ($line = $statement -> fetch()) {
      $sign['sign_name'] = $line['sign_name'];
      $sign['value'] = $line['value'];
      $sign['time'] = $line['time'];
      $sign['note'] = $line['note'];

      $response['patient']['vital_signs'][] = $sign;
    }
// SELECT THE VITAL SIGNS OF THE PATIENT
    $sql = "SELECT * FROM sign";

    $statement = $dbh -> prepare($sql);
    $result = $statement -> execute();

    while ($line = $statement -> fetch()) {
      $signType['signID'] = $line['signID'];
      $signType['sign_name'] = $line['sign_name'];

      $response['vital_sign_types'][] = $signType;
    }
  }
  echo trim(json_encode($response));
  $dbh = null;
} catch(PDOException $e) {

  /*** echo the sql statement and error message ***/
  echo $e -> getMessage();
}
?>
