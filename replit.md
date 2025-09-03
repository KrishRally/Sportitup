# SportItUp - Sports Venue Booking Platform

## Overview

SportItUp is a sports venue booking platform built with Next.js that allows users to book sports facilities after phone number verification via OTP. The platform supports cricket, football, and pickleball bookings across multiple locations.

**Key Features:**
- OTP-based phone authentication using Firebase
- Real-time slot booking system
- Multi-sport support (cricket, football, pickleball)
- Owner admin dashboard for managing bookings
- Location-based venue discovery

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

**Frontend:** Next.js 15 with React 19, TypeScript, and Tailwind CSS
**Authentication:** Firebase Phone Authentication with OTP verification
**State Management:** React hooks with sessionStorage for temporary data
**UI Components:** Radix UI components with shadcn/ui styling
**Data Storage:** In-memory store (to be replaced with database)

**Authentication Flow:**
1. User enters name and phone number on signup
2. Firebase sends OTP to phone number
3. User verifies OTP on verification page
4. System creates user account and session
5. User can book sports venues

**File Structure:**
- `/app/signup` - User registration with phone number
- `/app/login` - User login with phone number
- `/app/verify-otp` - OTP verification page
- `/app/locations` - Sports venue discovery
- `/app/booking/[turfId]` - Venue booking interface
- `/lib/firebase.ts` - Firebase configuration and OTP utilities
- `/lib/auth.ts` - Authentication middleware and user session management

## Recent Changes (September 2025)

✓ Implemented Firebase phone authentication system
✓ Created OTP verification workflow
✓ Updated user data models to support Firebase UIDs
✓ Modified signup/login pages for phone-based auth
✓ Added user session management with cookies
✓ Enhanced booking system to link with authenticated users

## External Dependencies

**Firebase Services:**
- Firebase Authentication for phone number verification
- reCAPTCHA for bot protection during OTP sending

**Required Environment Variables:**
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_PROJECT_ID  
- VITE_FIREBASE_APP_ID

**UI & Styling:**
- Radix UI for accessible components
- Tailwind CSS for styling
- Lucide React for icons