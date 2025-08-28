-- Adding new tables for points, waste submissions, and bins

-- Bins table to store recycling bin locations and information
CREATE TABLE IF NOT EXISTS bins (
    id SERIAL PRIMARY KEY,
    bin_code VARCHAR(50) UNIQUE NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    waste_types TEXT[] NOT NULL, -- Array of accepted waste types
    status VARCHAR(20) DEFAULT 'active', -- active, maintenance, full
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Waste submissions table to track each disposal event
CREATE TABLE IF NOT EXISTS waste_submissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bin_id INTEGER NOT NULL REFERENCES bins(id) ON DELETE CASCADE,
    waste_type VARCHAR(100) NOT NULL,
    waste_category VARCHAR(50) NOT NULL, -- standard, battery, hazardous
    quantity INTEGER DEFAULT 1,
    points_earned INTEGER NOT NULL DEFAULT 0,
    verification_image_url VARCHAR(500),
    transaction_hash VARCHAR(100), -- Cardano transaction hash
    status VARCHAR(20) DEFAULT 'pending', -- pending, verified, rejected
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User points table to track point balances and transactions
CREATE TABLE IF NOT EXISTS user_points (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_points INTEGER NOT NULL DEFAULT 0,
    available_points INTEGER NOT NULL DEFAULT 0, -- points available for redemption
    lifetime_points INTEGER NOT NULL DEFAULT 0, -- total points ever earned
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Point transactions table for detailed point history
CREATE TABLE IF NOT EXISTS point_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    waste_submission_id INTEGER REFERENCES waste_submissions(id) ON DELETE SET NULL,
    transaction_type VARCHAR(20) NOT NULL, -- earned, redeemed, bonus, penalty
    points_amount INTEGER NOT NULL,
    description TEXT,
    cardano_tx_hash VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waste_submissions_user_id ON waste_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_waste_submissions_bin_id ON waste_submissions(bin_id);
CREATE INDEX IF NOT EXISTS idx_waste_submissions_status ON waste_submissions(status);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bins_status ON bins(status);
CREATE INDEX IF NOT EXISTS idx_bins_bin_code ON bins(bin_code);
