<?php
session_start();

// Test if the user is logged in.
// If no : back to the login page!
if (!isset($_SESSION['staffID'])) {
  header('location: ../index.php');
  exit ;
}

include ('pdo.inc.php');

try {
  $dbh = new PDO("mysql:host=$hostname;dbname=$dbname", $username, $password);
  $response = null;
  $patientID = (int)($_GET['id']);
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

    /*** echo a message saying we have connected ***/
    $sql = "SELECT time, quantity, 
              medicament_name, unit, 
                staff1.staffID AS nurse_staffID, staff1.name AS nurse_name, staff1.first_name AS nurse_first_name, 
                staff2.staffID AS physician_staffID, staff2.name AS physician_name, staff2.first_name AS physician_first_name, 
                note 
  FROM patient, medicine, staff AS staff1, staff AS staff2, medicament
  WHERE patient.patientID = medicine.patientID
    AND medicine.medicamentID = medicament.medicamentID 
    AND staff1.staffID = medicine.staffID_nurse
    AND staff2.staffID = medicine.staffID_physician
    AND patient.patientID = :patientID";

    $statement = $dbh -> prepare($sql);
    $statement -> bindParam(':patientID', $patientID, PDO::PARAM_INT);
    $result = $statement -> execute();

    while ($line = $statement -> fetch()) {
      $medication['time'] = $line['time'];
      $medication['quantity'] = $line['quantity'];
      $medication['medicament_name'] = $line['medicament_name'];
      $medication['nurse_staffID'] =$line['nurse_staffID'];
      $medication['nurse_name'] =$line['nurse_name'];
      $medication['nurse_first_name'] =$line['nurse_first_name'];
      $medication['physician_staffID'] =$line['physician_staffID'];
      $medication['physician_name'] =$line['physician_name'];
      $medication['physician_first_name'] =$line['physician_first_name'];
      $medication['note'] =$line['note'];
      $response['patient']['medications'][] = $medication;
    }

    // $sql = "SELECT * FROM sign";
// 
    // $statement = $dbh -> prepare($sql);
    // $result = $statement -> execute();
// 
    // while ($line = $statement -> fetch()) {
      // $signType['signID'] = $line['signID'];
      // $signType['sign_name'] = $line['sign_name'];
// 
      // $response['vital_sign_types'][] = $signType;
    // }
  }
  echo trim(json_encode($response));
  $dbh = null;
} catch(PDOException $e) {

  /*** echo the sql statement and error message ***/
  echo $e -> getMessage();
}
?>
