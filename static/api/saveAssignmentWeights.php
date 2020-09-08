<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');
include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$response_arr = array(
    "access"=> TRUE
);


$_POST = json_decode(file_get_contents("php://input"),true);
$contentId = mysqli_real_escape_string($conn,$_POST["contentId"]);
$assignmentId = mysqli_real_escape_string($conn,$_POST["assignmentId"]);
$attemptNumber = mysqli_real_escape_string($conn,$_POST["attemptNumber"]);
$weights = array_map(
    function($item) use($conn) {
        return mysqli_real_escape_string($conn, $item);
    },
    $_POST['weights']
);
  // var_dump($_POST);

  //TODO: Test if weights dynamically changed then store updates


$sql = "SELECT userId
        FROM user_assignment_attempt_item
        WHERE userId = '$userId'
          AND assignmentId = '$assignmentId'
          AND attemptNumber = '$attemptNumber'
";
$result = $conn->query($sql);

//If already stored, don't store
if ($result->num_rows < 1){


    $sql = "UPDATE user_assignment_attempt 
            SET contentId='$contentId'
            WHERE userId = '$userId'
              AND assignmentId = '$assignmentId'
              AND attemptNumber = '$attemptNumber'
    ";
    $result = $conn->query($sql);

    for ($itemNumber = 1; $itemNumber < count($weights) + 1; $itemNumber++){
        //Store Item  weights
        $weight = $weights[($itemNumber -1)];
        $sql = "INSERT INTO user_assignment_attempt_item 
                    (userId,assignmentId,attemptNumber,itemNumber,weight)
                values
                    ('$userId','$assignmentId','$attemptNumber','$itemNumber','$weight')
        ";
        $result = $conn->query($sql);
    }
}


// set response code - 200 OK
http_response_code(200);

//  echo json_encode($response_arr);

$conn->close();
?>
