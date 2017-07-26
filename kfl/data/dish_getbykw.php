<?php

header('Content-Type:application/json');

@$kw = $_REQUEST['kw'];
if(empty($kw))
{
  echo '[]';
  return;
}

require('init.php');

$sql = "SELECT did,name,price,img_sm,material FROM kf_dish WHERE name LIKE '%$kw%' OR material LIKE '%$kw%'";
$result = mysqli_query($conn,$sql);

$output = [];
while(true)
{
  $row = mysqli_fetch_assoc($result);
  if(!$row){
  break;
 }
  $output[] = $row;
}

echo json_encode($output);

?>