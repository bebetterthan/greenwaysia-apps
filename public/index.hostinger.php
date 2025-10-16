<?php

/**
 * Modified index.php for Hostinger Shared Hosting
 * 
 * INSTRUCTIONS:
 * 1. Copy this file to your public_html folder
 * 2. Rename to index.php (replace the existing one)
 * 3. Update the paths below to match your server structure
 */

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../maintenance.php')) {
    require $maintenance;
}

/**
 * IMPORTANT: Update these paths based on your Hostinger structure
 * 
 * EXAMPLE STRUCTURE:
 * /home/uXXXXXXX/
 * ├── domains/yourdomain.com/public_html/  ← This file is here
 * └── greenesia/                            ← Laravel files are here
 * 
 * If Laravel is in /home/uXXXXXXX/greenesia/
 * Then use: __DIR__.'/../../greenesia/vendor/autoload.php'
 * 
 * If Laravel is in /home/uXXXXXXX/domains/yourdomain.com/greenesia/
 * Then use: __DIR__.'/../greenesia/vendor/autoload.php'
 */

// METHOD 1: Laravel in parent parent directory (recommended for Hostinger)
// require __DIR__.'/../../greenesia/vendor/autoload.php';
// $app = require_once __DIR__.'/../../greenesia/bootstrap/app.php';

// METHOD 2: Laravel in parent directory
// require __DIR__.'/../greenesia/vendor/autoload.php';
// $app = require_once __DIR__.'/../greenesia/bootstrap/app.php';

// METHOD 3: Standard Laravel structure (if using symlink)
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';

// Handle the request...
$app->handleRequest(Request::capture());
