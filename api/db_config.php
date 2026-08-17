<?php
// ====================================================================
// MOUNT2OCEAN - PROTECTED DATABASE CONFIGURATION (SERVER-SIDE ONLY)
// Never exposed to browsers or client-side inspect element.
// ====================================================================

// If called directly, deny access
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    http_response_code(403);
    die(json_encode(["error" => "Direct access forbidden."]));
}

define('DB_HOST', 'localhost');
define('DB_USER', 'YOUR_CPANEL_DB_USER');
define('DB_PASS', 'YOUR_CPANEL_DB_PASSWORD');
define('DB_NAME', 'YOUR_CPANEL_DB_NAME');
define('ADMIN_SECRET_KEY', 'm2o_enterprise_secure_token_9988'); // Token for admin verification
?>
