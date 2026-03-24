-- Default admin user
-- Password: admin123 (change immediately after first login)
-- Hash generated with bcrypt, 10 rounds
insert into admin_users (email, password_hash) values
  ('admin@matiasperezinmuebles.com', '$2b$10$UpnssrdnqIyKcL/qJccNN.zQXDd4vUG/7MygvLcjEXEbBa2cczr4e')
on conflict (email) do nothing;
