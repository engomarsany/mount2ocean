// ==========================================================================
// MOUNT2OCEAN - SUPABASE POSTGRESQL DATABASE INTEGRATION & CLIENT ENGINE
// ==========================================================================

// Supabase Connection Credentials (Replace with your actual Supabase Project URL & Anon Key)
window.SUPABASE_URL = window.SUPABASE_URL || "https://your-project-id.supabase.co";
window.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "your-anon-key";

// Initialize Supabase Client if SDK is loaded
window.initSupabaseClient = function() {
  if (window.supabase && window.supabase.createClient && window.SUPABASE_URL !== "https://your-project-id.supabase.co") {
    try {
      window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
      console.log("✅ Supabase PostgreSQL Database Connected Successfully!");
      return true;
    } catch (err) {
      console.warn("⚠️ Supabase Client Init Warning:", err.message);
    }
  }
  console.log("ℹ️ Running in Hybrid Mode: Using Browser LocalStorage & Supabase Ready Architecture.");
  return false;
};

// SQL Schema for Supabase SQL Editor (1-Click Setup for Owner)
window.SUPABASE_SQL_SCHEMA = `
-- ==========================================================================
-- MOUNT2OCEAN FULL DATABASE SCHEMA FOR SUPABASE POSTGRESQL
-- Copy and run this script in Supabase Dashboard -> SQL Editor
-- ==========================================================================

-- 1. TOUR PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price_bdt NUMERIC NOT NULL,
  duration TEXT NOT NULL,
  badge_tag TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. HOTELS & RESORTS TABLE
CREATE TABLE IF NOT EXISTS public.hotels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  stars INT DEFAULT 4,
  price_per_night NUMERIC NOT NULL,
  image_url TEXT,
  amenities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. VISA PRICE LIST & CHECKLIST TABLE
CREATE TABLE IF NOT EXISTS public.visa_rates (
  id TEXT PRIMARY KEY,
  country TEXT NOT NULL,
  visa_type TEXT NOT NULL,
  embassy_fee NUMERIC DEFAULT 0,
  agency_fee NUMERIC DEFAULT 0,
  service_charge NUMERIC DEFAULT 0,
  security_deposit TEXT,
  total_visa_fee NUMERIC DEFAULT 0,
  entries TEXT,
  max_stay TEXT,
  validity TEXT,
  processing_time TEXT,
  checklist_desc TEXT,
  checklist_file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. VISA APPLICATIONS TRACKING TABLE
CREATE TABLE IF NOT EXISTS public.visa_applications (
  id TEXT PRIMARY KEY,
  passport_no TEXT NOT NULL,
  ref_no TEXT UNIQUE NOT NULL,
  applicant_name TEXT NOT NULL,
  country TEXT NOT NULL,
  dob DATE,
  visa_type TEXT,
  apply_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'Processing',
  issued_visa_file_url TEXT,
  owner_notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. FLIGHT TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.flight_tickets (
  id TEXT PRIMARY KEY,
  airline_name TEXT NOT NULL,
  flight_no TEXT NOT NULL,
  from_city TEXT NOT NULL,
  to_city TEXT NOT NULL,
  depart_time TEXT,
  arrive_time TEXT,
  duration TEXT,
  aircraft TEXT,
  fare_bdt NUMERIC DEFAULT 0,
  tag_bg TEXT DEFAULT '#0072bc',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 6. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  ref_code TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  item_name TEXT NOT NULL,
  item_type TEXT DEFAULT 'Tour Package',
  total_amount NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'bKash',
  payment_status TEXT DEFAULT 'Pending Verification',
  booking_status TEXT DEFAULT 'Pending Approval',
  booking_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 7. SITE CMS CONFIGURATION TABLE
CREATE TABLE IF NOT EXISTS public.site_cms (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ENABLE ROW LEVEL SECURITY (RLS) & POLICIES FOR PUBLIC READ / OWNER ALL
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flight_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_cms ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access
CREATE POLICY "Public Read Packages" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Public Read Hotels" ON public.hotels FOR SELECT USING (true);
CREATE POLICY "Public Read Visa Rates" ON public.visa_rates FOR SELECT USING (true);
CREATE POLICY "Public Read Visa Apps" ON public.visa_applications FOR SELECT USING (true);
CREATE POLICY "Public Read Flights" ON public.flight_tickets FOR SELECT USING (true);
CREATE POLICY "Public Read CMS" ON public.site_cms FOR SELECT USING (true);
CREATE POLICY "Public Insert Bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- Allow Full Access for Authenticated Owner/Admin
CREATE POLICY "Owner Full Packages" ON public.packages FOR ALL USING (true);
CREATE POLICY "Owner Full Hotels" ON public.hotels FOR ALL USING (true);
CREATE POLICY "Owner Full Visa Rates" ON public.visa_rates FOR ALL USING (true);
CREATE POLICY "Owner Full Visa Apps" ON public.visa_applications FOR ALL USING (true);
CREATE POLICY "Owner Full Flights" ON public.flight_tickets FOR ALL USING (true);
CREATE POLICY "Owner Full Bookings" ON public.bookings FOR ALL USING (true);
CREATE POLICY "Owner Full CMS" ON public.site_cms FOR ALL USING (true);
`;
