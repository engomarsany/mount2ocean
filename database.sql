-- ====================================================================
-- MOUNT2OCEAN TRAVEL & TOURS - cPANEL MYSQL DATABASE SCHEMA
-- Import this SQL file into cPanel phpMyAdmin
-- ====================================================================

CREATE TABLE IF NOT EXISTS ookings (
  id VARCHAR(50) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) DEFAULT NULL,
  	ravel_date VARCHAR(50) DEFAULT NULL,
  	our_title VARCHAR(255) NOT NULL,
  mount VARCHAR(50) NOT NULL,
  	ravelers_count VARCHAR(100) DEFAULT NULL,
  payment_method VARCHAR(100) DEFAULT NULL,
  status VARCHAR(50) DEFAULT 'PENDING',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS customer_reviews (
  id VARCHAR(50) PRIMARY KEY,
  
ame VARCHAR(255) NOT NULL,
  ating INT DEFAULT 5,
  comment TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'APPROVED',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;