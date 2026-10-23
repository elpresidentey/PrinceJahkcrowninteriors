# POPDecor Project Structure

This document outlines the complete project structure and organization.

```
popdecor/
│
├── public/                          # Static assets
│   ├── images/                      # Public images
│   │   ├── hero/                    # Hero section images
│   │   ├── services/                # Service images
│   │   ├── about/                   # About section images
│   │   └── placeholder/             # Placeholder images
│   ├── favicon.ico
│   └── robots.txt
│
├── src/                             # Source code
│   │
│   ├── app/                         # Next.js App Router
│   │   ├── (public)/                # Public routes group
│   │   │   ├── about/               # About page
│   │   │   ├── contact/             # Contact page
│   │   │   ├── projects/            # Projects pages
│   │   │   │   ├── [slug]/          # Individual project page
│   │   │   │   └── page.tsx         # Projects listing
│   │   │   ├── services/            # Services pages
│   │   │   │   ├── [slug]/          # Individual service page
│   │   │   │   └── page.tsx         # Services listing
│   │   │   ├── quote/               # Quote request form
│   │   │   └── consultation/        # Consultation request form
│   │   │
│   │   ├── admin/                   # Admin routes (protected)
│   │   │   ├── layout.tsx           # Admin layout with auth
│   │   │   ├── dashboard/           # Admin dashboard
│   │   │   ├── projects/            # Project management
│   │   │   ├── services/            # Service management
│   │   │   ├── enquiries/           # Enquiry management
│   │   │   ├── consultations/       # Consultation management
│   │   │   └── testimonials/        # Testimonial management
│   │   │
│   │   ├── api/                     # API routes
│   │   │   ├── enquiries/           # Enquiry submission
│   │   │   ├── consultations/       # Consultation booking
│   │   │   └── upload/              # Image upload
│   │   │
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Homepage
│   │   ├── globals.css              # Global styles
│   │   └── not-found.tsx            # 404 page
│   │
│   ├── components/                  # React components
│   │   │
│   │   ├── ui/                      # Base UI components (shadcn-style)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── shared/                  # Shared/reusable components
│   │   │   ├── container.tsx        # Content container
│   │   │   ├── section.tsx          # Section wrapper
│   │   │   ├── section-heading.tsx  # Section title component
│   │   │   ├── whatsapp-button.tsx  # WhatsApp CTA
│   │   │   ├── project-card.tsx     # Project preview card
│   │   │   ├── service-card.tsx     # Service preview card
│   │   │   ├── testimonial-card.tsx # Testimonial card
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── header.tsx           # Site header/navigation
│   │   │   ├── footer.tsx           # Site footer
│   │   │   └── mobile-menu.tsx      # Mobile navigation
│   │   │
│   │   ├── sections/                # Page sections
│   │   │   ├── hero.tsx             # Homepage hero
│   │   │   ├── featured-projects.tsx
│   │   │   ├── services-grid.tsx
│   │   │   ├── testimonials.tsx
│   │   │   ├── process-steps.tsx
│   │   │   ├── before-after.tsx
│   │   │   └── cta-section.tsx
│   │   │
│   │   ├── forms/                   # Form components
│   │   │   ├── quote-request-form.tsx
│   │   │   ├── consultation-form.tsx
│   │   │   ├── contact-form.tsx
│   │   │   └── form-steps/          # Multi-step form components
│   │   │
│   │   └── admin/                   # Admin-specific components
│   │       ├── sidebar.tsx
│   │       ├── stats-card.tsx
│   │       ├── data-table.tsx
│   │       └── image-upload.tsx
│   │
│   ├── lib/                         # Utility libraries
│   │   ├── utils.ts                 # General utilities (cn, formatters)
│   │   ├── constants.ts             # App constants
│   │   ├── validations.ts           # Zod schemas (to be created)
│   │   └── supabase/                # Supabase configuration
│   │       ├── client.ts            # Client-side Supabase
│   │       ├── server.ts            # Server-side Supabase
│   │       ├── queries.ts           # Database queries
│   │       └── index.ts
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── use-media-query.ts       # Responsive breakpoints
│   │   ├── use-scroll.ts            # Scroll detection
│   │   └── index.ts
│   │
│   └── types/                       # TypeScript type definitions
│       └── index.ts                 # All type definitions
│
├── supabase/                        # Supabase configuration
│   ├── schema.sql                   # Database schema
│   └── README.md                    # Setup instructions
│
├── .env.local.example               # Environment variables template
├── .gitignore                       # Git ignore rules
├── components.json                  # shadcn/ui config
├── next.config.ts                   # Next.js configuration
├── package.json                     # Dependencies
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── PROJECT_STRUCTURE.md             # This file
├── SETUP.md                         # Setup documentation
└── README.md                        # Project readme

```

## Directory Purposes

### `/src/app`
Next.js 14+ App Router structure. Each folder represents a route.
- Route groups like `(public)` organize routes without affecting URLs
- `admin` routes will be protected with authentication
- API routes handle server-side operations

### `/src/components`
All React components organized by purpose:
- **ui/**: Base components (buttons, inputs, cards)
- **shared/**: Reusable components across pages
- **layout/**: Site-wide layout components
- **sections/**: Large page sections
- **forms/**: Form-related components
- **admin/**: Admin-specific components

### `/src/lib`
Utility functions and configurations:
- Helper functions
- Constants and configuration
- Supabase client and queries
- Validation schemas

### `/src/hooks`
Custom React hooks for common functionality

### `/src/types`
TypeScript type definitions and interfaces

## Naming Conventions

### Files
- Components: `PascalCase.tsx` (e.g., `ProjectCard.tsx`)
- Utilities: `kebab-case.ts` (e.g., `use-media-query.ts`)
- Pages: `page.tsx` (Next.js convention)
- Layouts: `layout.tsx` (Next.js convention)

### Components
- Use named exports for reusable components
- Use default exports for pages
- Prefix custom hooks with `use`

### Variables
- Constants: `UPPER_SNAKE_CASE`
- Functions: `camelCase`
- Types/Interfaces: `PascalCase`
- React components: `PascalCase`

## Import Order

Follow this order for cleaner code:

1. React imports
2. Third-party library imports
3. Internal components
4. Internal utilities
5. Types
6. Styles

Example:
```typescript
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
```

## Styling Guidelines

- Use Tailwind CSS utility classes
- Use the `cn()` utility for conditional classes
- Avoid inline styles unless absolutely necessary
- Use custom CSS variables from globals.css
- Follow mobile-first responsive design

## Component Structure

Standard component template:

```typescript
import { cn } from "@/lib/utils";

interface ComponentNameProps {
  // Props definition
  className?: string;
}

export function ComponentName({ 
  className,
  ...props 
}: ComponentNameProps) {
  return (
    <div className={cn("base-classes", className)} {...props}>
      {/* Component content */}
    </div>
  );
}
```

## State Management

- Use React hooks (useState, useReducer) for local state
- Use URL state for filters and pagination
- Supabase handles backend state
- No global state management library needed for MVP

## Form Handling

- Use React Hook Form for form state
- Use Zod for validation schemas
- Handle submissions with Server Actions or API routes

## Data Fetching

- Use Supabase queries from `/src/lib/supabase/queries.ts`
- Fetch data in Server Components when possible
- Use loading.tsx for loading states
- Use error.tsx for error handling

## Testing Structure (Future)

```
src/
├── __tests__/              # Test files
│   ├── components/
│   ├── utils/
│   └── integration/
```

## Environment Variables

Required variables (see `.env.local.example`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Build Output

Production build artifacts:
- `.next/` - Next.js build output (gitignored)
- `out/` - Static export output if needed (gitignored)

## Version Control

Ignored files (see `.gitignore`):
- `.env.local` - Local environment variables
- `.next/` - Build output
- `node_modules/` - Dependencies
- `.DS_Store` - macOS files

## Future Additions

Planned but not yet implemented:
- `/src/middleware.ts` - Auth middleware
- `/src/lib/validations.ts` - Zod schemas
- `/src/components/layout/` - Header, Footer, Navigation
- `/src/app/admin/` - Admin dashboard
- `/tests/` - Test suite
