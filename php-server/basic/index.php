<?php

session_start();

require 'vendor/autoload.php';

use OpenWanderer\OpenWanderer;

$app = OpenWanderer::createApp(["auth" => false]);
$app->run();

?>
