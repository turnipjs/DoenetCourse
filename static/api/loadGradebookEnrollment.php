<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

if (!isset($_GET["courseId"])) {
    http_response_code(400);
    echo "Bad Request: No course specified!";
} else {
    $courseId = mysqli_real_escape_string($conn,$_REQUEST["courseId"]);

    // make sure userId has access
    $sql = "SELECT userId, courseId
            FROM course_instructor
            WHERE userId = '$userId'
              AND courseId = '$courseId'
    ";

    $result = $conn->query($sql);
    if ($userId != "4VYp5dOrVWGz0OKB2hkLW" && $result->num_rows < 1) { // hardcoded userid is devuser
        http_response_code(401);
        echo "Unauthorized: You are not an instructor for that course!";
        $conn->close();
        return;
    }
    

    $sql = "SELECT ce.userId, ce.firstName, ce.lastName, ce.courseCredit, ce.courseGrade, ce.overrideCourseGrade
            FROM course_enrollment AS ce
            WHERE ce.courseId = '$courseId'
            ORDER BY ce.lastName
    ";

    $result = $conn->query($sql);
    $response_arr = array();


    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            array_push($response_arr,
                array(
                    $row['userId'],
                    $row['firstName'],
                    $row['lastName'],
                    $row['courseCredit'],
                    $row['courseGrade'],
                    $row['overrideCourseGrade'],
                )
            );
        }

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($response_arr);
    } else {
        http_response_code(404);
        echo "Not Found: No such course: '$courseId'";
    }
}

$conn->close();
?>
