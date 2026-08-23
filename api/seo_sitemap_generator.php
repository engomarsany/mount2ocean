<?php
// ====================================================================
// MOUNT2OCEAN - DYNAMIC REAL-TIME XML SITEMAP ENGINE
// Generates fresh XML Sitemap on-the-fly for Googlebot & Bingbot
// ====================================================================

header('Content-Type: application/xml; charset=utf-8');

$baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . ($_SERVER['HTTP_HOST'] ?? 'www.mount2ocean.com');

$staticPages = [
    ['loc' => '/customer_portal.html', 'priority' => '1.0', 'freq' => 'daily'],
    ['loc' => '/tour_packages.html', 'priority' => '0.95', 'freq' => 'daily'],
    ['loc' => '/hotels_resorts.html', 'priority' => '0.95', 'freq' => 'daily'],
    ['loc' => '/flights.html', 'priority' => '0.85', 'freq' => 'daily'],
    ['loc' => '/visa_services.html', 'priority' => '0.85', 'freq' => 'weekly'],
    ['loc' => '/ai_assistant.html', 'priority' => '0.80', 'freq' => 'weekly'],
    ['loc' => '/contact_us.html', 'priority' => '0.80', 'freq' => 'monthly'],
    ['loc' => '/refund_policy.html', 'priority' => '0.70', 'freq' => 'monthly']
];

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

foreach ($staticPages as $page) {
    echo "  <url>\n";
    echo "    <loc>" . htmlspecialchars($baseUrl . $page['loc']) . "</loc>\n";
    echo "    <lastmod>" . date('Y-m-d') . "</lastmod>\n";
    echo "    <changefreq>" . $page['freq'] . "</changefreq>\n";
    echo "    <priority>" . $page['priority'] . "</priority>\n";
    echo "  </url>\n";
}

echo '</urlset>';
?>
