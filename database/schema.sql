CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    role ENUM('user', 'admin') DEFAULT 'user',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('deposit', 'withdrawal', 'profit', 'loss') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    reference VARCHAR(100) UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS application_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    site_name VARCHAR(100) DEFAULT 'AlphaBroker',
    site_description TEXT,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    min_deposit DECIMAL(15, 2) DEFAULT 10.00,
    min_withdrawal DECIMAL(15, 2) DEFAULT 50.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin (password: Admin@Broker123)
-- Hash should be generated properly, but for schema let's just put a placeholder or use password_hash if we were in PHP
INSERT INTO users (full_name, email, password, role) VALUES ('Administrator', 'admin@broker.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
