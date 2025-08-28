-- Insert sample bins for testing
INSERT INTO public.bins (name, location_lat, location_lng, address, waste_types, qr_code) VALUES
('Downtown Electronics Hub', 40.7128, -74.0060, '123 Main St, New York, NY', ARRAY['phones', 'laptops', 'tablets'], 'BIN001'),
('Green Tech Center', 40.7589, -73.9851, '456 Broadway, New York, NY', ARRAY['batteries', 'cables', 'small_electronics'], 'BIN002'),
('University Recycling Point', 40.7505, -73.9934, '789 University Ave, New York, NY', ARRAY['computers', 'monitors', 'printers'], 'BIN003'),
('Mall Collection Point', 40.7282, -73.7949, '321 Shopping Center, Queens, NY', ARRAY['phones', 'tablets', 'gaming_devices'], 'BIN004'),
('Community E-Waste Drop', 40.6892, -74.0445, '654 Community Rd, Brooklyn, NY', ARRAY['all_electronics'], 'BIN005')
ON CONFLICT (qr_code) DO NOTHING;
