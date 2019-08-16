<?php

$data = $_POST['newAnswer'];

//Load the file
$contents = file_get_contents('Respuestas.json');
 
//Decode the JSON data into a PHP array.
$contentsDecoded = json_decode($contents, true);

//Push new value

//$rootArray = array();

array_push($contentsDecoded,$data);
//array_push($contentsDecoded,$rootArray);



 
//Encode the array back into a JSON string.
$json = json_encode($contentsDecoded);
 
//Save the file.
file_put_contents('Respuestas.json', $json);
echo $json;




?>