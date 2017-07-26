<?php

header('Content-Type:application/json');

@$id = $_REQUEST['id'];
if(empty($id))
{
  echo '[]';
  return;
}

require('init.php');

$sql = "SELECT did,name,price,img_lg,material,detail  FROM kf_dish WHERE did=$id";
$result = mysqli_query($conn,$sql);

$output = [];
$row = mysqli_fetch_assoc($result);
if(!$row){
  echo '[]';
 }
 else
 {
  $output[] = $row;
  echo json_encode($output);
 }


?>