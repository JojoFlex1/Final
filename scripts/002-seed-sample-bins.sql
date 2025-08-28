-- Updated seed data to match the correct schema
-- Insert sample recycling bins with correct column names
INSERT INTO public.bins (name, location_lat, location_lng, address, waste_types, qr_code) VALUES
('Downtown Electronics Center', 40.7128, -74.0060, '123 Main St, New York, NY', ARRAY['smartphone', 'basic_phone', 'tablet', 'laptop'], 'QR_BIN001'),
('University Campus - Tech Building', 40.7589, -73.9851, '456 University Ave, New York, NY', ARRAY['laptop', 'desktop_computer', 'monitor', 'keyboard', 'computer_mouse'], 'QR_BIN002'),
('Shopping Mall - Electronics Store', 40.7505, -73.9934, '789 Mall Blvd, New York, NY', ARRAY['phone_charger', 'laptop_charger', 'usb_cable', 'hdmi_cable', 'audio_cable'], 'QR_BIN003'),
('Community Center - Battery Drop', 40.7282, -73.7949, '321 Community Dr, Queens, NY', ARRAY['phone_battery', 'laptop_battery', 'power_bank', 'car_battery', 'ups_battery'], 'QR_BIN004'),
('Tech Repair Shop', 40.6892, -74.0445, '654 Repair St, Brooklyn, NY', ARRAY['headphones', 'earbuds', 'bluetooth_speaker', 'portable_speaker'], 'QR_BIN005')
ON CONFLICT (qr_code) DO NOTHING;
