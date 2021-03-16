<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");

$selectedPartition = $_REQUEST["partition"];
$message = $_REQUEST["message"];
$username = $_REQUEST["username"];
var_dump($selectedPartition,$message,$username);

$conf = new RdKafka\Conf();
$conf->set('log_level', (string) LOG_DEBUG);
$conf->set('debug', 'all');
$rk = new RdKafka\Producer($conf);
$rk->addBrokers("kafka:9092"); // Hopefully by the time this code is actually used, prod will be in Docker as well

$topic = $rk->newTopic("chat");

$msgId = rand(0,1000000000);
$msgJSON = "{\"userId\": \"" . $username . "\", \"messageId\": " . $msgId . ", \"message\": \"" . $message . "\"}";
var_dump($msgJSON);
$topic->produce((int)$selectedPartition, 0, $msgJSON);
var_dump((int)$selectedPartition);

$rk->flush(2000); // 2 sec

?>
