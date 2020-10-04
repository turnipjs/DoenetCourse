<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";
$_POST = json_decode(file_get_contents("php://input"),true);
$public = (mysqli_real_escape_string($conn,$_POST["isPublic"]) == true) ? 1 : 0;
$number_items = count($_POST["itemIds"]);

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

for ($i = 0; $i < $number_items; $i++) {
  $itemId =  mysqli_real_escape_string($conn,$_POST["itemIds"][$i]);
  $itemType =  mysqli_real_escape_string($conn,$_POST["itemType"][$i]);

  switch($itemType) {
    case "content":
      $permissionTable = "user_content";
    case "folder":
      $permissionTable = isset($permissionTable) ? $permissionTable : "user_folders";
    case "url":
      $permissionTable = isset($permissionTable) ? $permissionTable : "user_urls";

      $sql = "SELECT userId
              FROM $permissionTable
              WHERE userId = '$userId'
                AND branchId = '$itemId'
      ";

      $result = $conn->query($sql);
      if ($result->num_rows < 1) {
        http_response_code(401);
        echo "Unauthorized: You cannot do that.";
        $conn->close();
        return;
      }

      $sql = "UPDATE $itemType
              SET public='$public'
              WHERE branchId='$itemId'
      ";
      $result = $conn->query($sql);

      break;

    default:
      http_response_code(400);
      echo "Bad Request: \"$itemType\" is an invalid itemType";
      $conn->close();
      return;
  }
}

if ($result === TRUE) {
  // set response code - 200 OK
    http_response_code(200);
}else {
  echo "Error: " . $sql . "\n" . $conn->error;
}
$conn->close();

?>
