TinyLink - URL Shortener

TinyLink is a modern, full-stack URL shortener built with Next.js, Tailwind CSS, and PostgreSQL (Neon). It allows users to shorten long URLs, create custom aliases, and track click analytics in real-time.

<!-- Replace with actual screenshot if available -->

🚀 Features

Core Functionality

Shorten Links: Convert long URLs into short, shareable links.

Custom Aliases: Users can choose their own custom short codes (e.g., tinylink/mydocs).

Smart Redirects: Visiting a short link (e.g., /:code) performs a 302 redirect to the original URL.

Analytics: Tracks total clicks and the "last clicked" timestamp for every link.

User Interface & UX

Modern Dashboard: Clean, responsive UI built with Tailwind CSS and Glassmorphism effects.

Live Updates: Click counts update in real-time (polling) without page refreshes.

Invisible Auth: Uses browser-based tokens to let users manage their own links without a login screen.

Search & Filter: Filter links by name/URL or sort by "Newest" vs "Most Clicks".

Mobile Responsive: Fully optimized for desktop, tablet, and mobile devices.

API & Architecture

Health Check: GET /healthz endpoint for uptime monitoring.

RESTful API: Standardized endpoints for creating, listing, and deleting links.

Postgres Database: Data persistence using Prisma ORM and Neon Tech.

🛠️ Tech Stack

Framework: Next.js 14+ (App Router)

Language: TypeScript

Styling: Tailwind CSS

Database: PostgreSQL (via Neon)

ORM: Prisma

Icons: Lucide React

Deployment: Vercel

📦 Installation & Setup

Follow these steps to run the project locally.

1. Clone the Repository

git clone [https://github.com/YOUR_USERNAME/tinylink.git](https://github.com/YOUR_USERNAME/tinylink.git)
cd tinylink


2. Install Dependencies

npm install


3. Environment Setup

Create a .env file in the root directory and add your database connection string (see .env.example):

# .env
DATABASE_URL="postgres://user:password@host/database?sslmode=require"


4. Setup Database

Push the Prisma schema to your Neon database:

npx prisma db push


5. Run Development Server

npm run dev


Open http://localhost:3000 in your browser to see the app.

🧪 API Endpoints

The application exposes the following API endpoints for automation and testing:

Method

Endpoint

Description

GET

/healthz

Health check. Returns 200 OK { "ok": true, "version": "1.0" }

GET

/api/links

List all links for the current user.

POST

/api/links

Create a new link. Requires { url, shortCode? }. Returns 409 on duplicate.

GET

/api/links/:code

Get stats for a single link.

DELETE

/api/links/:code

Delete a link.

GET

/:code

Redirects to original URL (Status 302).

📂 Project Structure

src/
├── app/
│   ├── [code]/          # Redirect logic (GET /:code)
│   ├── api/             # Backend API routes
│   ├── code/            # Analytics page UI
│   ├── healthz/         # Health check endpoint
│   ├── globals.css      # Tailwind & Custom Animations
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main Dashboard UI
└── lib/
    └── prisma.ts        # Database client helper


📝 License

This project is open-source and available under the MIT License.