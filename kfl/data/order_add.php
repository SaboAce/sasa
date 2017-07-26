<?php

header('Content-Type:application/json');

@$userName = $_REQUEST['user_name'];
@$sex = $_REQUEST['sex'];
@$phone = $_REQUEST['phone'];
@$addr = $_REQUEST['addr'];
@$did = $_REQUEST['did'];

if(empty($userName) || empty($sex) || empty($phone) || empty($addr) ||  empty($did))
{
  echo '[]';
  return;
}
$orderTime = time()*1000;

require('init.php');

$sql = "INSERT INTO kf_order VALUES(NULL,'$phone','$userName','$sex','$orderTime','$addr','$did')";
$result = mysqli_query($conn,$sql);

$output = [];
if($result){//执行成功
  $arr['msg'] = 'succ';
  $arr['oid'] = mysqli_insert_id($conn);
  $output[] = $arr;
}
else
{
  $arr['msg'] = 'error';
  $output[] = $arr;
}

echo json_encode($output);

?>