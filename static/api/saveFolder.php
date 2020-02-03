<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";
$_POST = json_decode(file_get_contents("php://input"),true);
$title =  mysqli_real_escape_string($conn,$_POST["title"]);
$folderId = mysqli_real_escape_string($conn,$_POST["folderId"]);
$parentId = mysqli_real_escape_string($conn,$_POST["parentId"]);
$rootId = mysqli_real_escape_string($conn,$_POST["rootId"]);
$isRepo = (mysqli_real_escape_string($conn,$_POST["isRepo"]) == true) ? 1 : 0;
$public = (mysqli_real_escape_string($conn,$_POST["isPublic"]) == true) ? 1 : 0;
$number_children = count($_POST["childContent"]);
$operationType =  mysqli_real_escape_string($conn,$_POST["operationType"]);

//TEST if folder exists
$sql = "
SELECT id
FROM folder
WHERE folderId = '$folderId'
";
$result = $conn->query($sql); 
if ($result->num_rows < 1){
  //No previous information on this folder so store new folder
  $sql = "
  INSERT INTO folder
  (folderId,title ,parentId, creationDate, isRepo)
  VALUES
  ('$folderId','$title','$parentId' ,NOW(), '$isRepo')
  ";
  $result = $conn->query($sql); 
} else {
  // update folder
  $sql = "
  UPDATE folder
  SET title='$title',
      parentId='$parentId'
  WHERE folderId='$folderId'
  ";
  $result = $conn->query($sql); 
}

for ($i = 0; $i < $number_children; $i++) {
  $childId =  mysqli_real_escape_string($conn,$_POST["childContent"][$i]);
  $childType =  mysqli_real_escape_string($conn,$_POST["childType"][$i]);
  //TEST if children already exists 
  $sql = "
  SELECT id
  FROM folder_content
  WHERE childId = '$childId'
  ";
  $result = $conn->query($sql); 
  if ($result->num_rows < 1 && $operationType == "insert"){
    // Store if not already in folder
    $sql = "
    INSERT INTO folder_content
    (folderId, rootId, childId, childType, timestamp)
    VALUES
    ('$folderId', '$rootId', '$childId' ,'$childType', NOW())
    ";
    $result = $conn->query($sql); 

    if ($childType === "folder") {
      // update parentId of folder
      $sql = "
      UPDATE folder
      SET parentId='$folderId'
      WHERE folderId='$childId'
      ";
      $result = $conn->query($sql); 
    }
  } else if ($result->num_rows > 0 && $operationType == "insert") {
    // Update parent link if child already exist
    $sql = "
    UPDATE folder_content
    SET folderId='$folderId'
    WHERE childId='$childId'
    ";
    $result = $conn->query($sql); 

    if ($childType === "folder") {
      // update parentId of folder
      $sql = "
      UPDATE folder
      SET parentId='$folderId'
      WHERE folderId='$childId'
      ";
      $result = $conn->query($sql); 
    }

  } else if ($result->num_rows > 0 && $operationType == "remove") {
    // move content out of folder to upper directory
    $sql = "
    UPDATE folder_content
    SET folderId='$parentId',
        timestamp=NOW()
    WHERE childId='$childId'
    ";
    $result = $conn->query($sql); 

    if ($childType === "folder") {
      // update parentId of folder
      $sql = "
      UPDATE folder
      SET parentId='$parentId'
      WHERE folderId='$childId'
      ";
      $result = $conn->query($sql); 
    }
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