<?php
// ====================================================================
// MOUNT2OCEAN TRAVEL & TOURS - ENTERPRISE MILITARY-GRADE SECURITY SHIELD
// iPhone-Level Defense-in-Depth Security Middleware
// ====================================================================

// 1. Block Direct Access to this File
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    http_response_code(403);
    die(json_encode(["error" => "Security Shield: Direct access forbidden."]));
}

// 2. Strict Security Headers
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");
header("Permissions-Policy: camera=(), microphone=(), geolocation=()");

// 3. Rate Limiting Engine (IP-Based Anti-DDoS / Anti-Spam)
function enforceRateLimit($maxRequestsPerMinute = 15) {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    $tempDir = sys_get_temp_dir();
    $rateLimitFile = $tempDir . '/m2o_rate_' . md5($ip) . '.json';

    $currentTime = time();
    $requests = [];

    if (file_exists($rateLimitFile)) {
        $content = @file_get_contents($rateLimitFile);
        $requests = $content ? json_decode($content, true) : [];
        if (!is_array($requests)) $requests = [];
    }

    // Filter requests from the last 60 seconds
    $requests = array_filter($requests, function($timestamp) use ($currentTime) {
        return ($currentTime - $timestamp) < 60;
    });

    if (count($requests) >= $maxRequestsPerMinute) {
        http_response_code(429);
        header('Retry-After: 60');
        die(json_encode([
            "success" => false,
            "security_error" => "RATE_LIMIT_EXCEEDED",
            "message" => "Too many requests. Please wait 1 minute before trying again."
        ]));
    }

    $requests[] = $currentTime;
    @file_put_contents($rateLimitFile, json_encode($requests), LOCK_EX);
}

// 4. Payload Size Limiter (Blocks Oversized Attack Vectors)
function enforcePayloadLimit($maxBytes = 65536) { // 64 KB Max
    $contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($contentLength > $maxBytes) {
        http_response_code(413);
        die(json_encode([
            "success" => false,
            "security_error" => "PAYLOAD_TOO_LARGE",
            "message" => "Payload exceeds allowable security threshold."
        ]));
    }
}

// 5. Malicious Request & SQLi/XSS Inspection
function inspectSecurityThreats() {
    $dangerousPatterns = [
        '/<script\b[^>]*>(.*?)<\/script>/is',
        '/union\s+select/i',
        '/base64_decode/i',
        '/eval\(/i',
        '/document\.cookie/i',
        '/etc\/passwd/i',
        '/(\.\.\/)+/i'
    ];

    $checkTargets = [
        $_SERVER['QUERY_STRING'] ?? '',
        $_SERVER['REQUEST_URI'] ?? ''
    ];

    foreach ($checkTargets as $target) {
        foreach ($dangerousPatterns as $pattern) {
            if (preg_match($pattern, $target)) {
                http_response_code(400);
                die(json_encode([
                    "success" => false,
                    "security_error" => "MALICIOUS_PATTERN_DETECTED",
                    "message" => "Request blocked by Enterprise Web Application Firewall (WAF)."
                ]));
            }
        }
    }
}

// 6. Deep Input Sanitizer Function
function sanitizeSafeText($data) {
    if (is_array($data)) {
        return array_map('sanitizeSafeText', $data);
    }
    $data = trim((string)$data);
    $data = strip_tags($data);
    $data = htmlspecialchars($data, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    return $data;
}

// Auto-run baseline protections
enforceRateLimit(20);
enforcePayloadLimit(65536);
inspectSecurityThreats();
?>
