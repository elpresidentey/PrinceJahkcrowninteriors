# POPDecor - Premium POP & Interior Decoration Platform

A premium business website and lead management system for a POP installation and interior decoration business built with Next.js, TypeScript, Tailwind CSS, and Supabase.

![POPDecor](https://img.shields.io/badge/Next.js-16.4.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e?style=flat-square&logo=supabase)

## 🎯 Project Overview

POPDecor is a premium digital showroom that helps potential customers discover the business, explore completed projects, get design inspiration, request quotations, and contact the business directly.

### Key Features

#### Public Website
- 🏠 **Premium Homepage** - Elegant hero section with compelling CTAs
- 🖼️ **Project Gallery** - Showcase completed projects with filtering
- 🛠️ **Services** - Detailed service pages with pricing
- 📝 **Quote System** - Multi-step quote request form
- 📅 **Consultation Booking** - Site inspection scheduling
- 💬 **WhatsApp Integration** - Direct customer communication
- ⭐ **Testimonials** - Customer reviews and ratings
- 📱 **Mobile-First** - Optimized for Nigerian mobile networks

#### Admin Dashboard
- 📊 **Analytics Dashboard** - Lead tracking and statistics
- 🎨 **Project Management** - Add, edit, and manage projects
- 🔧 **Service Management** - Manage service offerings
- 📬 **Enquiry Management** - Track and manage customer enquiries
- 📆 **Consultation Management** - Schedule and manage inspections
- 💭 **Testimonial Management** - Approve and manage reviews

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 16.4.2](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: Custom shadcn/ui-inspired components
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

### Backend
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: Next.js API Routes

### Deployment
- **Hosting**: [Vercel](https://vercel.com/) (recommended)
- **Database**: Supabase Cloud

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd popdecor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

Follow the comprehensive guide in [`supabase/README.md`](./supabase/README.md):

1. Create a Supabase project
2. Run the database schema from `supabase/schema.sql`
3. Configure storage buckets
4. Set up authentication

### 4. Configure Environment Variables

Copy the example environment file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 6. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
popdecor/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── ui/          # Base UI components
│   │   ├── shared/      # Reusable components
│   │   ├── layout/      # Layout components
│   │   ├── sections/    # Page sections
│   │   └── forms/       # Form components
│   ├── lib/             # Utilities and config
│   │   ├── supabase/   # Supabase client & queries
│   │   ├── utils.ts    # Helper functions
│   │   └── constants.ts # App constants
│   ├── hooks/           # Custom React hooks
│   └── types/           # TypeScript types
├── supabase/            # Database schema & setup
└── public/              # Static assets
```

See [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md) for detailed structure documentation.

## 🎨 Design System

### Color Palette
- **Warm Off-White** (`#fafaf8`) - Background
- **Charcoal** (`#2d2d2d`) - Primary text
- **Deep Brown** (`#3d2f2f`) - Accents
- **Champagne** (`#f0e6d2`) - Secondary backgrounds
- **Gold** (`#d4af37`) - Highlights
- **Warm Beige** (`#e8dcc8`) - Tertiary

### Typography
- **Headings**: Playfair Display (Serif)
- **Body**: Inter (Sans-serif)

### Components
All components follow a premium, minimal aesthetic with:
- Smooth animations
- Generous spacing
- High-quality imagery
- Mobile-first responsive design

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript compiler check (add this script)

# Database
# See supabase/README.md for database commands
```

## 🗄️ Database Schema

The platform uses the following main tables:

- **projects** - Completed projects with images and details
- **project_images** - Project gallery images (gallery, before, after)
- **services** - Service offerings with pricing
- **enquiries** - Quote requests from customers
- **consultations** - Site inspection requests
- **testimonials** - Customer reviews and ratings

See [`supabase/schema.sql`](./supabase/schema.sql) for complete schema.

## 🔐 Authentication

Admin authentication is handled by Supabase Auth:
- Email/password authentication
- Row Level Security (RLS) policies
- Protected admin routes

## 📱 Mobile Optimization

The platform is optimized for Nigerian mobile networks:
- Mobile-first responsive design
- Image optimization and lazy loading
- Minimal JavaScript bundle
- Fast loading on 3G/4G networks
- PWA-ready architecture

## 🌍 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Environment Variables for Production

Ensure these are set in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 📖 Documentation

- [Setup Guide](./SETUP.md) - General setup information
- [Project Structure](./PROJECT_STRUCTURE.md) - Detailed project structure
- [Supabase Setup](./supabase/README.md) - Database setup guide

## 🤝 Contributing

This is a private business project. For questions or support, contact the development team.

## 📄 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

- Design inspiration from premium architecture and interior design studios
- Built with modern web technologies
- Optimized for the Nigerian market

---

**Built with ❤️ for POPDecor**
