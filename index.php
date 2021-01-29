<?php

session_start();

require 'vendor/autoload.php';

use OpenWanderer\OpenWanderer;

$app = OpenWanderer::createApp(["auth" => true]);
$app->run();

?>
