<?php

 session_start();

// Test if the user is logged in.
// If no : back to the login page!
if(!isset($_SESSION['staffID'])){
  header('location: index.php');
  exit;
 }


include('pdo.inc.php');

try {
    $dbh = new PDO("mysql:host=$hostname;dbname=$dbname", $username, $password);
    
    $response['user'] = $_SESSION['first_name']." ".$_SESSION['name'];

    $sql = "select * from patient";

    $result = $dbh->query($sql);

    while($line = $result->fetch()){
      // echo "<a href='patient.php?id=".$line['patientID']."'>";
      // echo $line['first_name']." ".$line['name'];
// 
      // echo "</a><br>\n";
      
      $patient['patientID'] = $line['patientID'];
      $patient['patientName'] = $line['first_name']." ".$line['name'];
      
      $response['patients'][] = $patient;
    }
    echo trim(json_encode($response));
    $dbh = null;
}
catch(PDOException $e)
{

    /*** echo the sql statement and error message ***/
    echo $e->getMessage();
}


?> 