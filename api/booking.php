<?php
// ====================================================================
// MOUNT2OCEAN TRAVEL & TOURS - cPANEL MYSQL DATABASE BACKEND API
// ====================================================================
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (\['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// DATABASE CONFIGURATION (Update with your cPanel MySQL Database credentials)
\ = 'localhost';
\ = 'YOUR_CPANEL_DB_USER';
\ = 'YOUR_CPANEL_DB_PASSWORD';
\ = 'YOUR_CPANEL_DB_NAME';

// Connect to MySQL
\ = new mysqli(\, \, \, \);
if (\->connect_error) {
    // Fallback response if DB not configured yet
    echo json_encode(['success' => false, 'message' => 'Database connection fallback to client storage']);
    exit;
}

\->set_charset("utf8mb4");

// HANDLE POST BOOKING
if (\['REQUEST_METHOD'] === 'POST') {
    \ = json_decode(file_get_contents('php://input'), true);
    if (!\ || empty(\['customerName']) || empty(\['phone'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required booking fields']);
        exit;
    }

    \ = \->real_escape_string(\['id'] ?? ('M2O-BK-' . rand(10000, 99999)));
    \ = \->real_escape_string(\['customerName']);
    \ = \->real_escape_string(\['phone']);
    \ = \->real_escape_string(\['email'] ?? '');
    \ = \->real_escape_string(\['travelDate'] ?? '');
    \ = \->real_escape_string(\['tourTitle'] ?? 'Tour Package');
    \ = \->real_escape_string(\['amount'] ?? \['price'] ?? 'à§³0');
    \ = \->real_escape_string(\['travelersCount'] ?? '1 Traveler');
    \ = \->real_escape_string(\['paymentMethod'] ?? 'bKash / Nagad');
    \ = \->real_escape_string(\['status'] ?? 'PENDING');

    \ = "INSERT INTO bookings (id, customer_name, phone, email, travel_date, tour_title, amount, travelers_count, payment_method, status)
            VALUES ('\', '\', '\', '\', '\', '\', '\', '\', '\', '\')
            ON DUPLICATE KEY UPDATE status='\'";

    if (\->query(\) === TRUE) {
        echo json_encode(['success' => true, 'bookingId' => \, 'message' => 'Booking saved to cPanel MySQL Database!']);
    } else {
        echo json_encode(['success' => false, 'error' => \->error]);
    }
    exit;
}

// HANDLE GET BOOKINGS LIST
if (\['REQUEST_METHOD'] === 'GET') {
    \ = \->query("SELECT * FROM bookings ORDER BY created_at DESC");
    \ = [];
    if (\) {
        while (\ = \->fetch_assoc()) {
            \[] = \;
        }
    }
    echo json_encode(['success' => true, 'data' => \]);
    exit;
}
?>