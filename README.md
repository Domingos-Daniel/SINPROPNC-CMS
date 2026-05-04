# SIMPROPNC - Full-Featured CMS

A comprehensive Next.js Content Management System that allows non-technical users to seamlessly manage website content, create pages, write posts, and customize themes without any coding knowledge.

## Features

### Core CMS Capabilities
- **Content Management**: Edit text, create new pages and blog posts dynamically
- **Page Builder**: Create custom pages with flexible sections (hero, content, text)
- **Blog Management**: Write, edit, and publish blog posts with rich content
- **Theme Customization**: Change primary and secondary colors, customize site information
- **Admin Dashboard**: Intuitive interface for managing all site content
- **Role-based Access**: Secure admin area with authentication

### Technical Highlights
- **Built with Next.js 16**: Modern React framework with App Router
- **Supabase Backend**: PostgreSQL database with Row Level Security (RLS)
- **Real-time Updates**: Dynamic page rendering with automatic revalidation
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **SEO Optimized**: Dynamic metadata generation for pages and posts

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account with a project set up
- Environment variables configured

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

### Tables
- **pages**: Store page metadata (title, slug, description, publish status)
- **sections**: Store page sections with flexible JSON content
- **posts**: Blog posts with title, content, and publish status
- **settings**: Site-wide configuration (colors, site name, tagline)
- **admin_users**: Admin user accounts with role-based access

## Using the CMS

### Creating Pages
1. Go to Admin → Pages
2. Click "New Page"
3. Enter page title, slug, and description
4. Click "Create Page"
5. In the page editor, add sections with different types (Hero, Content, Text)
6. Click "Save Changes" to publish

### Writing Blog Posts
1. Go to Admin → Posts
2. Click "New Post"
3. Write your title, excerpt, and content
4. Toggle "Publish immediately" to make it live
5. Click "Create Post"
6. Edit posts later using the Edit button

### Customizing Settings
1. Go to Admin → Settings
2. Update site name, tagline, description
3. Choose primary and secondary colors using the color picker
4. Click "Save All Settings"

### Public Pages
- Homepage: `/` - Displays site info and navigation
- Dynamic Pages: `/{slug}` - Auto-generated from your pages
- Blog Index: `/blog` - Lists all published posts
- Blog Posts: `/blog/{slug}` - Individual blog post pages

## Admin Areas

### Dashboard (`/admin`)
Quick overview with statistics and links to management sections

### Pages Manager (`/admin/pages`)
- View all pages
- Create new pages
- Edit existing pages and their sections
- Delete pages

### Posts Manager (`/admin/posts`)
- View all posts
- Create new blog posts
- Edit posts
- Manage publication status

### Settings (`/admin/settings`)
- Configure site name and description
- Set primary and secondary colors
- Customize footer text
- Preview color selections

## Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel settings
4. Deploy with a single click

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Architecture

### Frontend
- **Next.js 16** with React 19.2
- **shadcn/ui** components
- **TailwindCSS** for styling
- **Server Components** for data fetching

### Backend
- **Supabase** (PostgreSQL)
- **Row Level Security (RLS)** policies for data protection
- **Authentication** with email/password
- **Real-time** data synchronization

### File Structure
```
app/
  admin/              # Admin dashboard
    layout.tsx       # Admin layout with sidebar
    page.tsx         # Dashboard home
    pages/           # Page management
    posts/           # Post management
    settings/        # Site settings
  auth/              # Authentication
    callback/        # OAuth callback
    login/           # Login page
    sign-up/         # Registration page
  blog/              # Public blog
  [slug]/            # Dynamic pages
lib/
  supabase/          # Supabase clients
  data.ts            # Data fetching utilities
components/ui/       # shadcn components
```

## Key Technologies

- **Framework**: Next.js 16
- **UI Components**: shadcn/ui
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Security

- **Row Level Security**: All database tables have RLS policies
- **Admin-only writes**: Only authenticated admins can create/edit content
- **Public reads**: Everyone can view published content
- **Secure sessions**: HTTP-only cookies for session management
- **Email verification**: Optional email confirmation for signups

## Customization

### Adding New Section Types
1. Update the section type options in `/app/admin/pages/[id]/page.tsx`
2. Add rendering logic in `/app/[slug]/page.tsx`
3. Update the database schema if needed

### Styling
- Modify `/app/globals.css` for global styles
- Update `tailwind.config.ts` for theme colors
- Use shadcn/ui components for consistency

### Database
- Modify tables via Supabase SQL editor
- Update RLS policies as needed
- Add new fields to the JSON content columns

## Troubleshooting

### Admin not appearing in database
- Make sure you've created an admin_user entry in Supabase
- Verify the email matches your authenticated user

### Pages not showing up
- Check that `is_published` is set to `true`
- Verify the page has a valid slug

### Styling not applying
- Clear browser cache
- Rebuild with `pnpm build`
- Check TailwindCSS configuration

## Support

For issues or questions:
1. Check the Supabase documentation
2. Review the Next.js documentation
3. Check shadcn/ui component docs

## License

MIT License - feel free to use this for your projects

---

**Built with ❤️ using Next.js and Supabase**
