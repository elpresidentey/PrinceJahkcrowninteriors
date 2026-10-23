# POPDecor - Setup Documentation

## Project Overview
Premium POP & Interior Decoration Business Platform built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Technology Stack
- **Framework**: Next.js 16.4.2 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (to be configured)
- **Backend**: Supabase (to be configured)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Design System

### Color Palette
The platform uses a premium, warm color palette:

- **Warm Off-White** (`#fafaf8`) - Background
- **Charcoal** (`#2d2d2d`) - Primary text and buttons
- **Deep Brown** (`#3d2f2f`) - Hover states
- **Champagne** (`#f0e6d2`) - Secondary backgrounds
- **Gold** (`#d4af37`) - Accents and highlights
- **Warm Beige** (`#e8dcc8`) - Tertiary accents

### Typography
- **Headings**: Playfair Display (Serif) - Elegant and architectural
- **Body**: Inter (Sans-serif) - Clean and modern
- **Font Features**: Ligatures and contextual alternates enabled

### Animations
Pre-configured animations for smooth, premium feel:
- `fade-in` - Gentle opacity transition
- `fade-in-up` - Slide up with fade
- `fade-in-down` - Slide down with fade
- `slide-in-right` - Horizontal slide from left
- `slide-in-left` - Horizontal slide from right
- `scale-in` - Scale up with fade

## Project Structure
```
popdecor/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Root layout with fonts
│   │   ├── page.tsx      # Homepage
│   │   └── globals.css   # Global styles and theme
│   ├── components/       # React components (to be created)
│   ├── lib/             # Utilities
│   │   └── utils.ts     # Helper functions (cn, formatters)
│   └── types/           # TypeScript definitions
│       └── index.ts     # Database and component types
├── public/              # Static assets
├── tailwind.config.ts   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Utility Functions
Located in `src/lib/utils.ts`:
- `cn()` - Merge Tailwind classes
- `formatCurrency()` - Format Nigerian Naira
- `formatDate()` - Format dates for Nigerian locale
- `formatPhoneNumber()` - Format Nigerian phone numbers
- `generateSlug()` - Create URL-friendly slugs
- `truncate()` - Truncate text with ellipsis

## Type Definitions
Located in `src/types/index.ts`:
- Database models (Project, Service, Enquiry, etc.)
- Enums and constants
- Form types
- Component prop types

## Next Steps
1. ✅ Initialize Next.js with TypeScript
2. ✅ Configure Tailwind CSS with custom theme
3. ✅ Set up shadcn/ui components
4. ✅ Configure Supabase schema and client
5. ⏳ Create project structure
6. ⏳ Build homepage sections
7. ⏳ Build admin dashboard

## Environment Variables (To Be Configured)
Create a `.env.local` file with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

See `supabase/README.md` for detailed setup instructions.

## Design Principles
1. **Photography First** - Large, high-quality project images
2. **Editorial Layouts** - Magazine-inspired design
3. **Premium Feel** - Sophisticated, not generic
4. **Mobile-First** - Optimized for mobile devices
5. **Performance** - Fast loading on Nigerian networks
6. **Accessibility** - WCAG compliant
