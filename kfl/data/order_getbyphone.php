<?php

header('Content-Type:application/json');

$phone = $_REQUEST['phone'];

require('init.php');

$sql = "SELECT kf_order.oid,kf_order.order_time,
kf_order.user_name,kf_order.did ,kf_dish.img_sm FROM kf_dish,kf_order WHERE kf_order.phone=$phone AND kf_order.did=kf_dish.did";
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