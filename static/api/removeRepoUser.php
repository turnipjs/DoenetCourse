<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";

$email = mysqli_real_escape_string($conn,$_REQUEST["email"]);
$repoId = mysqli_real_escape_string($conn,$_REQUEST["repoId"]);

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];


$sql = "
SELECT id
FROM repo_access
WHERE userId = '$userId' AND repoId = '$repoId' AND owner = '1'
";

$result = $conn->query($sql);
$hasPermissionToRemove = $result->num_rows > 0;
$userId = $result->userId;
$row = $result->fetch_assoc();
$userId = $row["userId"];

if (!$hasPermissionToRemove) {
  $response_message = "Must be owner to remove access";
}

$response_arr = array(
  "success"=>"0",
  "message"=>$response_message
);

if ($hasPermissionToRemove ){
//  User has permission to remove the user, so remove them
  $sql = "
  DELETE FROM repo_access
  WHERE repoId='$repoId' AND email='$email'
  ";
  $result = $conn->query($sql);

    //Collect users who can access repos
    $sql = "SELECT
                u.firstName AS firstName,
                u.lastName AS lastName,
                u.userId AS userId,
                u.email AS email,
                ra.owner AS owner
            FROM repo_access AS ra

            LEFT JOIN user AS u
            ON u.email = ra.email
            WHERE ra.repoId = '$repoId'
    ";
    $result = $conn->query($sql);
    $users = array();
    while($row = $result->fetch_assoc()){
        $user_info = array(
            "firstName"=>$row["firstName"],
            "lastName"=>$row["lastName"],
            "username"=>$row["username"],
            "email"=>$row["email"],
            "owner"=>$row["owner"]
        );
        array_push($users,$user_info);
    }
    $response_arr = array(
        "success"=>"1",
        "users"=>$users
    );
}


http_response_code(200);
echo json_encode($response_arr);


$conn->close();
?>
