# Mahabharata Dialogues

## Overview

This is a Next.js 15.0.8 application for "Mahabharata Dialogues" - a platform that hosts retreats, events, blogs, and educational content related to the Mahabharata epic. The application serves both public-facing content pages and an admin dashboard for content management.

The platform features:
- Public pages for retreats, events, and blogs
- Rich text blog editor with TipTap
- Firebase-based authentication and data storage
- Image upload and management via Firebase Storage
- YouTube video integration
- Testimonials management

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with custom theme configuration
- **State Management**: Zustand for global client-side state
- **Rich Text Editor**: TipTap with extensions for images, links, YouTube embeds, and text formatting
- **Icons**: Lucide React
- **Fonts**: Custom "Neco" font family plus Google Fonts (Merriweather Sans, Geist)

### Backend Architecture
- **API Routes**: Next.js API routes under `/src/app/api/`
- **Database**: Firebase Firestore (via firebase-admin for server-side operations)
- **File Storage**: Firebase Storage for images and media
- **Authentication**: Firebase Auth with cookie-based session management using js-cookie

### Data Models
The application manages four primary content types:
1. **Blogs** - Articles with rich text content, author, categories, and cover images
2. **Events** - Event listings with galleries, testimonials, and booking URLs
3. **Retreats** - Multi-day retreat schedules with detailed day-by-day itineraries
4. **Testimonials** - User quotes with name and designation

### Authentication Flow
- Firebase Auth handles user authentication
- Admin routes are protected via `ProtectedRoute` component
- Session tokens stored in cookies for persistence
- Role-based access control (user/admin roles stored in Firestore)

### URL Structure
- Public: `/`, `/blogs`, `/events`, `/retreats`
- Detail pages: `/blogs/[slug]`, `/events/[slug]`, `/retreats/[slug]`
- Admin: `/admin`, `/admin/blogs`, `/admin/events`, `/admin/retreats`, `/admin/testimonials`
- API: `/api/blogs`, `/api/events`, `/api/retreats`, `/api/testimonials`

## External Dependencies

### Firebase Services
- **Firebase Auth**: User authentication
- **Firestore**: NoSQL database for all content
- **Firebase Storage**: Image and media file storage
- **Firebase Admin SDK**: Server-side Firebase operations

### Third-Party APIs
- **YouTube Data API**: Fetches latest videos from configured channel (requires `YOUTUBE_API_KEY` and `YOUTUBE_CHANNEL_ID` environment variables)

### Required Environment Variables
```
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
FIREBASE_STORAGE_BUCKET
YOUTUBE_API_KEY
YOUTUBE_CHANNEL_ID
NEXT_PUBLIC_BASE_URL (optional, for production URL)
```

### Key NPM Dependencies
- `firebase` / `firebase-admin`: Firebase SDK
- `@tiptap/*`: Rich text editor
- `zustand`: State management
- `js-cookie`: Cookie management
- `lucide-react`: Icons
- `clsx`: Conditional classnames