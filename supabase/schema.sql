-- POPDecor Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    location TEXT NOT NULL,
    category TEXT NOT NULL CHECK (
        category IN (
            'all',
            'pop-ceilings',
            'living-rooms',
            'bedrooms',
            'tv-walls',
            'offices',
            'commercial',
            'lighting',
            'interior-decoration'
        )
    ),
    featured BOOLEAN DEFAULT FALSE,
    cover_image TEXT NOT NULL,
    services TEXT[] DEFAULT '{}',
    style TEXT DEFAULT 'Modern',
    summary TEXT,
    completion_date DATE,
    duration TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- =====================================================
-- PROJECT IMAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('gallery', 'before', 'after')),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_type ON project_images(type);

-- =====================================================
-- SERVICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image TEXT NOT NULL,
    highlights TEXT[] DEFAULT '{}',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);

-- =====================================================
-- ENQUIRIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT,
    service TEXT NOT NULL,
    property_type TEXT NOT NULL CHECK (
        property_type IN (
            'house',
            'apartment',
            'office',
            'shop',
            'restaurant',
            'hotel',
            'church',
            'other'
        )
    ),
    location TEXT NOT NULL,
    room TEXT,
    budget TEXT CHECK (
        budget IN ('500k-1m', '1m-2m', '2m-5m', '5m+', 'not-sure') OR budget IS NULL
    ),
    description TEXT,
    images TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'new' CHECK (
        status IN ('new', 'contacted', 'inspection-scheduled', 'quoted', 'won', 'lost')
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);

-- =====================================================
-- CONSULTATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    location TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time TEXT NOT NULL,
    service TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (
        status IN ('pending', 'confirmed', 'completed', 'cancelled')
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_preferred_date ON consultations(preferred_date);

-- =====================================================
-- TESTIMONIALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    project_type TEXT,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(published);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
--
-- The admin panel writes with the SERVICE ROLE key, which bypasses RLS
-- entirely, so there are deliberately NO write policies. The anon key that
-- ships in the browser bundle is strictly read-only on public content:
--
--   projects / project_images / services → public read
--   testimonials                        → published rows only
--   enquiries / consultations           → no policies (anon sees nothing;
--                                         inserts happen server-side only)
--
-- Every policy below is preceded by a DROP so re-running this file replaces
-- the old "authenticated users" policies that shipped with earlier schemas.

-- Projects: public read, service-role only writes
DROP POLICY IF EXISTS "Projects are viewable by everyone" ON projects;
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON projects;
CREATE POLICY "Projects are viewable by everyone"
    ON projects FOR SELECT
    USING (true);

-- Project Images: public read, service-role only writes
DROP POLICY IF EXISTS "Project images are viewable by everyone" ON project_images;
DROP POLICY IF EXISTS "Authenticated users can insert project images" ON project_images;
DROP POLICY IF EXISTS "Authenticated users can delete project images" ON project_images;
CREATE POLICY "Project images are viewable by everyone"
    ON project_images FOR SELECT
    USING (true);

-- Services: public read, service-role only writes
DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
DROP POLICY IF EXISTS "Authenticated users can insert services" ON services;
DROP POLICY IF EXISTS "Authenticated users can update services" ON services;
DROP POLICY IF EXISTS "Authenticated users can delete services" ON services;
CREATE POLICY "Services are viewable by everyone"
    ON services FOR SELECT
    USING (true);

-- Enquiries: private. Leads are inserted server-side (through an action that
-- uses the service key) so open-anon spam writes are impossible.
DROP POLICY IF EXISTS "Anyone can submit enquiries" ON enquiries;
DROP POLICY IF EXISTS "Authenticated users can view enquiries" ON enquiries;
DROP POLICY IF EXISTS "Authenticated users can update enquiries" ON enquiries;
-- (no policies — RLS denies the anon key everything)

-- Consultations: private, same as enquiries.
DROP POLICY IF EXISTS "Anyone can submit consultation requests" ON consultations;
DROP POLICY IF EXISTS "Authenticated users can view consultations" ON consultations;
DROP POLICY IF EXISTS "Authenticated users can update consultations" ON consultations;
-- (no policies — RLS denies the anon key everything)

-- Testimonials: only published rows are public; writes are service-role only.
DROP POLICY IF EXISTS "Published testimonials are viewable by everyone" ON testimonials;
DROP POLICY IF EXISTS "Authenticated users can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated users can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated users can delete testimonials" ON testimonials;
CREATE POLICY "Published testimonials are viewable by everyone"
    ON testimonials FOR SELECT
    USING (published = true);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for projects table (idempotent — safe to re-run)
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for services table (idempotent — safe to re-run)
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Create storage buckets for images
-- Note: Run these commands in the Supabase Dashboard Storage section
-- or using the Supabase CLI

-- Projects bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO NOTHING;

-- Services bucket for service images
INSERT INTO storage.buckets (id, name, public)
VALUES ('services', 'services', true)
ON CONFLICT (id) DO NOTHING;

-- Testimonials bucket for customer images
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonials', 'testimonials', true)
ON CONFLICT (id) DO NOTHING;

-- Enquiries bucket for uploaded images
INSERT INTO storage.buckets (id, name, public)
VALUES ('enquiries', 'enquiries', false)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE POLICIES
-- =====================================================
--
-- Same model as the table policies above: admin uploads and deletes run
-- through the service key (RLS bypassed), so these grant public READ access
-- only. The private `enquiries` bucket has no policies at all.

-- Projects bucket policies
DROP POLICY IF EXISTS "Projects images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete project images" ON storage.objects;
CREATE POLICY "Projects images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'projects');

-- Services bucket policies
DROP POLICY IF EXISTS "Service images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload service images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete service images" ON storage.objects;
CREATE POLICY "Service images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'services');

-- Testimonials bucket policies
DROP POLICY IF EXISTS "Testimonial images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload testimonial images" ON storage.objects;
CREATE POLICY "Testimonial images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'testimonials');

-- Enquiries bucket: private, service-role only. The old anonymous-upload
-- policy is removed so the anon key cannot fill the storage bucket.
DROP POLICY IF EXISTS "Authenticated users can view enquiry images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload enquiry images" ON storage.objects;

-- Old permissive read/write policies from the first draft are all dropped;
-- the service key writes (RLS bypassed) and the anon key reads only.

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Sample services. `image` accepts either a Supabase Storage URL from an
-- admin upload or a key of IMAGES in src/lib/image-manifest.ts (authored
-- tiles). These placeholders use real manifest keys so they render.
INSERT INTO services (name, slug, description, image, highlights, active) VALUES
('POP Ceilings', 'pop-ceilings', 'Custom POP ceiling designs built around your space and lifestyle.', 'ceiling-geometric-cove', '{"Suspended ceilings","Cove details"}', true),
('Interior Decoration', 'interior-decoration', 'Complete interior transformation with carefully selected finishes.', 'classic-living-room', '{"Finishes","Fittings"}', true),
('TV Walls', 'tv-walls', 'Modern TV wall designs and decorative paneling.', 'living-feature-wall', '{"Fluted panels","Concealed wiring"}', true),
('Lighting Design', 'lighting-design', 'Architectural and decorative lighting solutions.', 'bedroom-rgb-lighting', '{"Cove lighting","LED profiles"}', true),
('Commercial Interiors', 'commercial-interiors', 'Interior finishing for offices, shops and hospitality spaces.', 'build-shell-01', '{"Offices","Hospitality"}', true)
ON CONFLICT (slug) DO NOTHING;

-- Sample testimonial
INSERT INTO testimonials (name, location, content, rating, project_type, published) VALUES
('Chioma Okafor', 'Lekki, Lagos', 'They completely transformed our living room. The POP ceiling design exceeded our expectations and the finishing was excellent. Highly professional team!', 5, 'POP Ceiling Installation', true),
('Mr. Adebayo', 'Ikeja, Lagos', 'Outstanding work on our office interior. The project was completed on time and within budget. Very impressed with the attention to detail.', 5, 'Commercial Interior', true),
('Sarah Johnson', 'Victoria Island', 'Beautiful TV wall design and lighting. The team was professional and the result is exactly what we wanted.', 5, 'TV Wall & Lighting', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- PROJECT CARD COLUMNS (idempotent — safe to re-run)
-- =====================================================

-- The project cards show a style label and a one-two line summary in the
-- editorial grid. Add them for any database created from an older schema.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS style TEXT DEFAULT 'Modern';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS summary TEXT;

-- Services no longer carry a price.
ALTER TABLE services DROP COLUMN IF EXISTS starting_price;

-- Service cards show a one-per-line highlight list under the description,
-- like the authored placeholder content. Add it for older databases.
ALTER TABLE services ADD COLUMN IF NOT EXISTS highlights TEXT[] DEFAULT '{}';

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
-- Schema setup complete!
-- Next steps:
-- 1. Configure authentication in Supabase Dashboard
-- 2. Upload sample images to storage buckets
-- 3. Update .env.local with your Supabase credentials
