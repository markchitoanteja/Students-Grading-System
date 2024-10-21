<?php
date_default_timezone_set('Asia/Manila');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once '../routes/web.php';
require_once '../config/database.php';

$uri = trim($_SERVER['REQUEST_URI'], '/');

if (array_key_exists($uri, $routes)) {
    require $routes[$uri];
} else {
    http_response_code(404);
    
    require '../views/errors/404.php';
}
