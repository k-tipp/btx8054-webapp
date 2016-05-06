<?php

if(!isset($_POST['quantity']) OR !isset($_POST['medicament']) OR !isset($_POST['patientID'])OR !isset($_POST['nurse'])OR !isset($_POST['doctor'])){
    include('index.php');
    exit();
}

session_start();
$patient = (int)$_POST['patientID'];
$medicament = (int)$_POST['medicament'];
$quantity = (double)$_POST['quantity'];
$nurse = (int)$_POST['nurse'];
$doctor = (int)$_POST['doctor'];
$note = $_POST['note'];
if($note==null)
{
    $note="";
}   
 
include('pdo.inc.php');

try {
    $dbh = new PDO("mysql:host=$hostname;dbname=$dbname", $username, $password);
    /*** echo a message saying we have connected ***/
    // echo 'Connected to database<br />';


    /*** set the error reporting attribute ***/
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $query = "INSERT INTO `medicine` (`time`, `quantity`, `medicamentID`, `patientID`, `staffID_nurse`, `staffID_physician`, `note`) "
            ."VALUES (CURRENT_TIMESTAMP, :quantity, :medicament, :patient, :nurse, :doctor, :note)";
    /*** prepare the SQL statement ***/
    $stmt = $dbh->prepare($query);

    /*** bind the paramaters ***/
    $stmt->bindParam(':quantity', $quantity, PDO::PARAM_INT);
    $stmt->bindParam(':medicament', $medicament, PDO::PARAM_INT);
    $stmt->bindParam(':patient', $patient, PDO::PARAM_INT);
    $stmt->bindParam(':nurse', $nurse, PDO::PARAM_INT);    
    $stmt->bindParam(':doctor', $doctor, PDO::PARAM_INT);
    $stmt->bindParam(':note', $note, PDO::PARAM_STR, 5);

    /*** execute the prepared statement ***/
    $stmt->execute();

    // redirect to the page medication
    header('location: ../view/medication.html?id='.$patient);



    /*** close the database connection ***/
    $dbh = null;

}
catch(PDOException $e)
{
    echo $e->getMessage();
}



?>