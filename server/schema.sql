
-- Database schema for Lost & Found system

CREATE DATABASE IF NOT EXISTS alfs;
USE alfs;

-- Objects table (for lost and found items)
CREATE TABLE IF NOT EXISTS Objects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('lost', 'found', 'claimed') NOT NULL,
  location VARCHAR(255),
  date_reported DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Owners table (users)
CREATE TABLE IF NOT EXISTS Owners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  dob DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Owned table (relationship between objects and owners)
CREATE TABLE IF NOT EXISTS Owned (
  object_id INT,
  owner_id INT,
  PRIMARY KEY (object_id, owner_id),
  FOREIGN KEY (object_id) REFERENCES Objects(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES Owners(id) ON DELETE CASCADE
);

-- Admins table
CREATE TABLE IF NOT EXISTS Admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,  -- In a real app, store hashed passwords
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin
INSERT INTO Admins (name, email, password) VALUES ('Admin User', 'admin@lostfound.com', 'admin123');
