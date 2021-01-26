<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");

$selectedPartition = $_REQUEST["partition"];
$message = $_REQUEST["message"];

$conf = new RdKafka\Conf();
// $conf->set('log_level', (string) LOG_DEBUG);
// $conf->set('debug', 'all');
$rk = new RdKafka\Producer($conf);
$rk->addBrokers("kafka:9092"); // Hopefully by the time this code is actually used, prod will be in Docker as well

$topic = $rk->newTopic("chat");

$msgId = rand(0,1000000);
$msgJSON = "{\"userId\": \"TBI\", \"messageId\": " . $msgId . ", \"message\": \"" . $message . "\"}";

$topic->produce($selectedPartition, 0, $msgJSON);

$rk->flush(2000); // 2 sec

?>
