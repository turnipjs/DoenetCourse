<?php
// ignore_user_abort(true);
// header('Content-Type: text/event-stream');
// header('Cache-Control: no-cache');
// header('Connection: keep-alive');
// header("Access-Control-Allow-Origin: *");
date_default_timezone_set("America/New_York");
header("Cache-Control: no-cache");
header("Content-Type: text/event-stream");

$flushSize = 4096;

$partition = $_REQUEST["partition"];

echo "data: {\"userId\": \"Server\", \"messageId\": -1, \"message\": \"Connection Successful! More messages on the way!\"}\n\n";
echo str_pad('', $flushSize) . "\n";
ob_end_flush();
flush();

$conf = new RdKafka\Conf();
// $conf->set('log_level', (string) LOG_DEBUG);
// $conf->set('debug', 'all');
$rk = new RdKafka\Consumer($conf);
$rk->addBrokers("kafka:9092");

$topic = $rk->newTopic("chat");
$topic->consumeStart($partition, RD_KAFKA_OFFSET_END);

while (true) {
    if (connection_aborted()) break;

    $msg = $topic->consume($partition,1000);
    if (null === $msg || $msg->err === RD_KAFKA_RESP_ERR__PARTITION_EOF) {
        continue;
    } elseif ($msg->err) {
        echo "event: error\ndata: " . $msg->errstr() . "\n\n";
        echo str_pad('', $flushSize) . "\n";
        ob_end_flush();
        flush();
    } else {
        echo "data: " . $msg->payload . "\n\n";
        echo str_pad('', $flushSize) . "\n";
        ob_end_flush();
        flush();
    }

//     echo "event: ping\n";
//   $curDate = date(DATE_ISO8601);
//   echo 'data: {"time": "' . $curDate . '"}';
//   echo "\n\n";
    // if not kafka consume
    // sleep(10);
}


?>
