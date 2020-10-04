<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

if (!isset($_REQUEST["courseId"])) {
    http_response_code(400);
    echo "Database Retrieval Error: No course specified!";
} else {
    $courseId = mysqli_real_escape_string($conn,$_REQUEST["courseId"]);

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

    $sql = "
        SELECT a.assignmentId, a.title, ua.credit, ua.userId
        FROM assignment AS a
        RIGHT JOIN user_assignment AS ua
        ON a.assignmentId = ua.assignmentId
        WHERE a.courseId = '$courseId'
        ORDER BY a.dueDate
    ";

    $result = $conn->query($sql); 
    $response_arr = array();

    while ($row = $result->fetch_assoc()) {
        array_push($response_arr,
            array(
                $row['assignmentId'],
                $row['title'],
                $row['credit'],
                $row['userId']
            )
        );
    }

    // set response code - 200 OK
    http_response_code(200);

    // make it json format
    echo json_encode($response_arr);
} 

    


$conn->close();
?>
           
